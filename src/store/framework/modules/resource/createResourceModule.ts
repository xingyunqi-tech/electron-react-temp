import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import type { Effect } from 'redux-saga/effects';
import { createAction } from '@reduxjs/toolkit';
import type { SR } from '../../utils/saga';
import { createKeyValueModule } from '../key-value';
import type { IKeyValueModuleContext } from '../key-value';
import type { IResourceModule, IResourceModuleContext } from './model';

/**
 * 创建资源模块
 *
 * 每个资源必须有唯一的键 (key)
 *
 * 模块维护资源的集合，提供对外的存取接口，并隐藏内部实现
 *
 * @template T 资源的类型
 * @template P 额外参数类型，默认为 any
 * @param ctx 资源模块的上下文配置
 * @returns 配置好的资源模块实例
 */
export const createResourceModule = <T, P = any>(ctx: IResourceModuleContext<T, P>): IResourceModule<T, P> => {
  /** Resource Module 内部是一个 key-value 存储 */
  const keyValueModule = createKeyValueModule<T>({
    name: ctx.name,
    rootSelector: ctx.rootSelector,
    optImpureReducer: ctx.optImpureReducer,
  } as IKeyValueModuleContext);

  const updateItemsAction = createAction<T[]>(`${ctx.name}/updateItems`);
  const removeItemsAction = createAction<string[]>(`${ctx.name}/removeItems`);
  const touchItemsAction = createAction<string[]>(`${ctx.name}/touchItems`);
  const fetchItemsAction = createAction<string[]>(`${ctx.name}/fetchItems`);
  const clearItemsAction = createAction<void>(`${ctx.name}/clearItems`);

  /**
   * 资源模块的reducer
   */
  const reducer: typeof keyValueModule.reducer = (state, action) => {
    if (updateItemsAction.match(action)) {
      const $payload = action.payload.map((item): [string, T] => [ctx.getKey(item), item]);
      return keyValueModule.reducer(state, keyValueModule.actions.updateAction($payload));
    }
    if (removeItemsAction.match(action)) {
      return keyValueModule.reducer(state, keyValueModule.actions.removeAction(action.payload));
    }
    if (clearItemsAction.match(action)) {
      return keyValueModule.reducer(state, keyValueModule.actions.clearAction());
    }
    return keyValueModule.reducer(state, action);
  };

  const getItemByKeySelector = keyValueModule.selectors.getByKey;
  const getKeysSelector = keyValueModule.selectors.getKeys;
  const getItemsSelector = keyValueModule.selectors.getValues;
  const getEntriesSelector = keyValueModule.selectors.getEntries;
  const getSizeSelector = keyValueModule.selectors.getSize;

  /**
   * 执行单个资源项的获取
   */
  function* fetchItemExecutor($key: string, $params?: P): IterableIterator<Effect | T[]> {
    if (!ctx.fetchHandler) {
      return [];
    }
    const result: T[] = yield call(ctx.fetchHandler, $key, $params, module);
    yield put(updateItemsAction(result));
    return result;
  }

  /**
   * 执行多个资源项的批量获取
   */
  function* fetchItemsExecuter($keys: string[], $params?: P): IterableIterator<Effect | T[]> {
    const { fetchHandler, batchFetchHandler } = ctx;
    if ($keys.length === 0) {
      return [];
    }
    if (batchFetchHandler) {
      return yield call(batchFetchHandler, $keys, $params, module);
    }
    if (fetchHandler) {
      const $results: Array<T[]> = yield all($keys.map(key => call(fetchItemExecutor, key, $params)));
      const result: T[] = [];
      $results.forEach($result => {
        if (Array.isArray($result)) {
          result.push(...$result);
        }
      });
      return result;
    }
    return [];
  }

  /**
   * 获取资源项的服务
   */
  function* getItemsService($keys: string[], $params?: P) {
    const $results: T[] = [];
    const $entriesToFetch: [number, string][] = [];
    const getItemByKey: SR<typeof getItemByKeySelector> = yield select(getItemByKeySelector);
    $keys.forEach((key, idx) => {
      const item = getItemByKey(key);
      if (item === undefined) {
        $entriesToFetch.push([idx, key]);
      } else {
        $results[idx] = item;
      }
    });
    if ($entriesToFetch.length > 0) {
      const keysToFetch = $entriesToFetch.map(([, key]) => key);
      const $theResults: T[] = yield call(fetchItemsExecuter, keysToFetch, $params);
      if (Array.isArray($theResults) && $theResults.length > 0) {
        yield put(updateItemsAction($theResults));
      }
      const map = new Map<string, T>();
      if (Array.isArray($theResults)) {
        $theResults.forEach(result => {
          map.set(ctx.getKey(result), result);
        });
      }
      const $keysFailedToFetch: string[] = [];
      $entriesToFetch.forEach(([idx, key]) => {
        const item = map.get(key);
        if (item !== undefined) {
          $results[idx] = item;
        } else {
          $keysFailedToFetch.push(key);
        }
      });
      if ($keysFailedToFetch.length > 0) {
        console.warn(
          `[redux-framework] 资源模块 '${ctx.name}' 获取资源失败. 获取失败的 key 为: ${$keysFailedToFetch.join()}.`,
        );
      }
    }
    return $results;
  }

  /**
   * 资源模块的saga
   */
  function* saga() {
    yield takeEvery(touchItemsAction.match, function* (action: ReturnType<typeof touchItemsAction>) {
      try {
        yield call(getItemsService, action.payload);
      } catch (e) {
        console.error(e);
      }
    });
    yield takeEvery(fetchItemsAction.match, function* (action: ReturnType<typeof fetchItemsAction>) {
      const items: T[] = yield call(fetchItemsExecuter, action.payload, undefined);
      yield put(updateItemsAction(items));
    });
  }

  const module: IResourceModule<T, P> = {
    reducer,
    saga,
    actions: {
      updateItemsAction,
      removeItemsAction,
      touchItemsAction,
      fetchItemsAction,
      clearItemsAction,
    },
    selectors: {
      getItemByKey: getItemByKeySelector,
      getItems: getItemsSelector,
      getEntries: getEntriesSelector,
      getKeys: getKeysSelector,
      getSize: getSizeSelector,
    },
    services: {
      getItems: getItemsService,
    },
    utils: {
      getKey: ctx.getKey,
    },
    name: ctx.name,
  };

  return module;
};
