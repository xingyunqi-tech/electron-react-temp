import { compact, uniqBy } from 'lodash-es';
import type { Reducer } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import { call, put, race, select, take, takeEvery } from 'redux-saga/effects';
import type { Effect } from 'redux-saga/effects';
import { createAction } from '@reduxjs/toolkit';
import { DefaultRootSelectorFactory } from '../../utils/rootSelector';
import { defineSelector } from '../../utils/defineSelector';
import { createKeyValueModule } from '../key-value';
import { MultiSourceFetcherStatus } from './constant';
import type { IMultiSourceFetcherStatusValuesType } from './constant';
import type { IMultiSourceModule, IMultiSourceModuleContext } from './model';

// 定义类型
type SourceData<T> = {
  sourceId: string;
  items: T[];
  total?: number;
};

type BatchRequest = {
  sourceId: string;
  start: number;
  limit: number;
};

/**
 * 多来源的资源加载器模块的状态接口
 */
interface IState {
  items: unknown;
  buckets: unknown;
  totalOfEachSourceItems: unknown;
  statusOfEachSource: unknown;
}

/**
 * 创建一个多来源的资源加载器
 *
 * @template T 资源的类型
 * @param ctx 模块上下文配置
 * @returns 多来源模块实例
 */
export const createMultiSourceModule = <T>(ctx: IMultiSourceModuleContext<T>) => {
  const prevIndexesRef = { current: {} as Record<string, number> };
  const rootSelector: (state: any) => IState = ctx.rootSelector || DefaultRootSelectorFactory(ctx.name);

  // 创建子模块
  const createModule = <V>(key: keyof IState) =>
    createKeyValueModule<V>({
      name: `${ctx.name}/${String(key)}`,
      rootSelector: defineSelector(
        () => ({ rootSelector }),
        x => x.rootSelector[key],
      ),
    });

  const kvItemsModule = createModule<T>('items');
  const kvBucketsModule = createModule<string[]>('buckets');
  const kvTotalOfEachSourceItemsModule = createModule<number | undefined>('totalOfEachSourceItems');
  const kvStatusOfEachSourceModule = createModule<IMultiSourceFetcherStatusValuesType>('statusOfEachSource');

  // 创建 Actions（RTK 原生 createAction）
  const clearAction = createAction<void>(`${ctx.name}/clear`);
  const triggerUpdateMultiSourceDataAction = createAction<Array<SourceData<T>>>(
    `${ctx.name}/triggerUpdateMultiSourceData`,
  );
  const touchTopNAction = createAction<number>(`${ctx.name}/touchTopN`);
  const abortAction = createAction<void>(`${ctx.name}/abort`);

  const defaultState: IState = {
    items: undefined,
    buckets: undefined,
    totalOfEachSourceItems: undefined,
    statusOfEachSource: undefined,
  };

  /**
   * 内部reducer
   */
  const innerReducer: Reducer<IState> = combineReducers({
    items: kvItemsModule.reducer,
    buckets: kvBucketsModule.reducer,
    totalOfEachSourceItems: kvTotalOfEachSourceItemsModule.reducer,
    statusOfEachSource: kvStatusOfEachSourceModule.reducer,
  });

  /**
   * 主reducer，处理清除操作（使用 RTK .match()）
   */
  const reducer: Reducer<IState> = (state: IState = defaultState, action) => {
    if (clearAction.match(action)) {
      return {
        items: kvItemsModule.reducer(state.items, kvItemsModule.actions.clearAction()),
        buckets: kvBucketsModule.reducer(state.buckets, kvBucketsModule.actions.clearAction()),
        totalOfEachSourceItems: kvTotalOfEachSourceItemsModule.reducer(
          state.totalOfEachSourceItems,
          kvTotalOfEachSourceItemsModule.actions.clearAction(),
        ),
        statusOfEachSource: kvStatusOfEachSourceModule.reducer(
          state.statusOfEachSource,
          kvStatusOfEachSourceModule.actions.clearAction(),
        ),
      };
    }
    return innerReducer(state, action);
  };

  const totalSelector = defineSelector(
    () => ({ getTotals: kvTotalOfEachSourceItemsModule.selectors.getValues }),
    x => {
      let sum: number | undefined = 0;
      for (const total of x.getTotals()) {
        sum = sum !== undefined && total !== undefined ? sum + total : undefined;
      }
      return sum;
    },
  );

  const getTotalBySourceIdSelector = defineSelector(
    () => ({
      getTotalByKey: kvTotalOfEachSourceItemsModule.selectors.getByKey,
    }),
    x => (sourceId: string) => x.getTotalByKey(sourceId),
  );

  const getItemsSelectors = defineSelector(
    () => ({
      getKeysInBucket: kvBucketsModule.selectors.getByKey,
      getSourceItemsTotal: kvTotalOfEachSourceItemsModule.selectors.getByKey,
      getByKey: kvItemsModule.selectors.getByKey,
      getSourceIds: ctx.sourceIds,
    }),
    (x): T[] => {
      const indexes: Record<string, number> = {};
      const sourceIdsArray = x.getSourceIds;
      sourceIdsArray.forEach((id: string) => {
        indexes[id] = 0;
      });
      const results: T[] = [];
      const finished: string[] = [];
      const head: Array<[string, T]> = compact(
        sourceIdsArray.map((sourceId: string) => {
          const keys = x.getKeysInBucket(sourceId);
          if (!keys) {
            finished.push(sourceId);
            return undefined;
          }
          const key = keys[0];
          if (key === undefined) {
            finished.push(sourceId);
            return undefined;
          }
          const item = x.getByKey(key);
          if (item === undefined) {
            // item 尚未写入 store，将该 source 标记为已完成以避免阻塞归并
            finished.push(sourceId);
            return undefined;
          }
          indexes[sourceId]!++;
          return [ctx.getSourceId(item), item];
        }),
      );

      while (head.length + finished.length === sourceIdsArray.length) {
        head.sort((a, b) => -ctx.comparator(a[1], b[1]));
        const entry = head.pop();
        if (!entry) {
          break;
        }
        const [sourceId, item] = entry;
        results.push(item);

        const keys = x.getKeysInBucket(sourceId);
        if (!keys) {
          break;
        }
        const index = indexes[sourceId]!;
        if (index < keys.length) {
          const item = x.getByKey(keys[index]!);
          if (item) {
            head.push([sourceId, item]);
          }
          indexes[sourceId]!++;
        } else {
          const total = x.getSourceItemsTotal(sourceId);
          if (total !== undefined && total <= index) {
            finished.push(sourceId);
          }
        }
      }
      const finalIndexes = { ...indexes };
      head.forEach(item => finalIndexes[item[0]]!--);
      prevIndexesRef.current = finalIndexes;

      return results;
    },
  );

  const unstableItemsSelectors = defineSelector(
    () => ({
      getKeysInBucketSelector: kvBucketsModule.selectors.getByKey,
      getSourceIds: ctx.sourceIds,
      getItem: kvItemsModule.selectors.getByKey,
    }),
    ({ getKeysInBucketSelector, getSourceIds, getItem }) => {
      const allItems: T[] = [];
      getSourceIds.forEach((sourceId: string) => {
        const keys = getKeysInBucketSelector(sourceId);
        if (keys) {
          keys.forEach(key => {
            const item = getItem(key);
            if (item) {
              allItems.push(item);
            }
          });
        }
      });
      return allItems.sort(ctx.comparator);
    },
  );

  const sortedItemsSelector = getItemsSelectors;
  const unstableItemsSelector = unstableItemsSelectors;

  const sourceFetchingStatusSelector = defineSelector(
    () => ({
      getAllStatusEntries: kvStatusOfEachSourceModule.selectors.getEntries,
    }),
    x => {
      const entries = x.getAllStatusEntries();
      return Array.from(entries).reduce((acc: Record<string, IMultiSourceFetcherStatusValuesType>, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    },
  );

  /**
   * 处理更新数据的逻辑
   */
  function* processSourceData(sourceItems: SourceData<T>[]): Generator<Effect, void, any> {
    const entries: Array<[string, T]> = [];
    sourceItems.forEach(({ items }) => {
      items.forEach(item => entries.push([ctx.getItemKey(item), item]));
    });
    yield put(kvItemsModule.actions.updateAction(entries));

    const getBucketByKey = yield select(kvBucketsModule.selectors.getByKey);
    const getItemByKey = yield select(kvItemsModule.selectors.getByKey);

    const updates = sourceItems.reduce(
      (acc, { sourceId, items, total }) => {
        const existingKeys = (getBucketByKey(sourceId) || []) as string[];
        const existingItems = existingKeys
          .map(itemKey => getItemByKey(itemKey) as T | undefined)
          .filter((item): item is T => item !== undefined);

        const nextItems = uniqBy([...existingItems, ...items], (item: T) => ctx.getItemKey(item));

        acc.nextBucket.push([sourceId, nextItems.sort(ctx.comparator).map((item: T) => ctx.getItemKey(item))]);
        acc.nextTotals.push([sourceId, total]);
        acc.statusUpdates.push([sourceId, MultiSourceFetcherStatus.SUCCESS]);

        return acc;
      },
      {
        nextBucket: [] as Array<[string, string[]]>,
        nextTotals: [] as Array<[string, number | undefined]>,
        statusUpdates: [] as Array<[string, IMultiSourceFetcherStatusValuesType]>,
      },
    );

    yield put(kvBucketsModule.actions.updateAction(updates.nextBucket));
    yield put(kvTotalOfEachSourceItemsModule.actions.updateAction(updates.nextTotals));
    yield put(kvStatusOfEachSourceModule.actions.updateAction(updates.statusUpdates));
  }

  /**
   * 从键值存储中格式化bucket数据
   */
  function* formatBucketFromKv(): Generator<Effect, Record<string, string[]>, any> {
    const getKvValues = yield select(kvItemsModule.selectors.getValues);
    const sourceIds = yield select(ctx.sourceIds);

    const nextBucket = sourceIds.reduce((acc: Record<string, string[]>, sourceId: string) => {
      acc[sourceId] = [];
      return acc;
    }, {});

    for (const item of getKvValues()) {
      const typedItem = item as T;
      nextBucket[ctx.getSourceId(typedItem)]!.push(ctx.getItemKey(typedItem));
    }

    return nextBucket;
  }

  /**
   * 获取批量请求参数
   */
  function* getBatchRequests(topN: number): Generator<Effect, BatchRequest[], any> {
    const lastBuckets = yield call(formatBucketFromKv);
    const prevSorted = yield select(sortedItemsSelector);

    if (prevSorted.length >= topN) {
      return [];
    }

    const prevSortedItemsNumOfEachSource: Record<string, number> = {};
    const sourceIds = yield select(ctx.sourceIds);
    sourceIds.forEach((sourceId: string) => (prevSortedItemsNumOfEachSource[sourceId] = 0));
    prevSorted.forEach((item: T) => prevSortedItemsNumOfEachSource[ctx.getSourceId(item)]!++);

    return Object.entries(lastBuckets)
      .map(([bucketKey, bucketValue]) => {
        const typedBucketValue = bucketValue as string[];
        let selfLeft = typedBucketValue.length - (prevIndexesRef.current[bucketKey] || 0);
        if (selfLeft < 0) {
          selfLeft = 0;
        }
        return {
          limit:
            topN - prevSorted.length - (typedBucketValue.length - (prevSortedItemsNumOfEachSource[bucketKey] || 0)),
          sourceId: bucketKey,
          start: typedBucketValue.length,
        };
      })
      .filter(r => r.limit > 0);
  }

  /**
   * 处理touchTopN请求（使用 RTK .match 作为 pattern）
   */
  function* touchTopNWorker(action: ReturnType<typeof touchTopNAction>): Generator<Effect, void, any> {
    const requests = yield call(getBatchRequests, action.payload);
    if (requests.length === 0) {
      return;
    }

    yield put(
      kvStatusOfEachSourceModule.actions.updateAction(
        requests.map((req: BatchRequest) => [req.sourceId, MultiSourceFetcherStatus.LOADING]),
      ),
    );

    const { sourceItems, isAborted } = yield race({
      sourceItems: ctx.batchFetcherHandler(requests, {
        triggerUpdateMultiSourceDataAction,
        updateMultiSourceFetchingStatusAction: kvStatusOfEachSourceModule.actions.updateAction,
      }),
      isAborted: take(abortAction.match),
    });

    if (isAborted) {
      return;
    }

    if (sourceItems && Array.isArray(sourceItems) && sourceItems.length) {
      yield* processSourceData(sourceItems);
    }
  }

  /**
   * 处理更新多来源数据
   */
  function* updateMultiSourceDataWorker({
    payload,
  }: ReturnType<typeof triggerUpdateMultiSourceDataAction>): Generator<Effect, void, any> {
    yield* processSourceData(payload);
  }

  /**
   * 模块saga（使用 RTK .match 作为 pattern）
   */
  function* saga(): Generator<Effect, void, any> {
    yield takeEvery(touchTopNAction.match, touchTopNWorker);
    yield takeEvery(triggerUpdateMultiSourceDataAction.match, updateMultiSourceDataWorker);
  }

  return {
    reducer,
    saga,
    name: ctx.name,
    actions: {
      abortAction,
      touchTopNAction,
      clearAction,
    },
    selectors: {
      total: totalSelector,
      sortedItems: sortedItemsSelector,
      unstableItems: unstableItemsSelector,
      sourceFetchingStatus: sourceFetchingStatusSelector,
      getTotalBySourceId: getTotalBySourceIdSelector,
    },
  } as IMultiSourceModule<T>;
};
