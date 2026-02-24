import { call, delay, put, select, takeEvery } from 'redux-saga/effects';
import type { Effect } from 'redux-saga/effects';
import { createAction } from '@reduxjs/toolkit';
import type { PayloadActionCreator } from '@reduxjs/toolkit';
import type { ReduxSagaModule } from '../../types';
import { DefaultRootSelectorFactory } from '../../utils/rootSelector';
import { defineSelector } from '../../utils/defineSelector';
import type { Selector } from '../../utils/defineSelector';
import type { SR } from '../../utils/saga';
import { createKeyValueModule } from '../key-value';
import type { IKeyValueModule, IKeyValueModuleContext } from '../key-value';

/**
 * 存储项目结构
 */
interface StorageItem<T> {
  /** 更新时间戳 */
  u: number;
  /** 删除标记 */
  r: boolean;
  /** 实际数据 */
  p: T;
}

/**
 * 持久化存储的数据结构
 */
export type IPersistedStorageItem<T> = Record<string, StorageItem<T>>;

/**
 * 持久化键值对模块的上下文配置
 */
export interface IPersistedKeyValueModuleContext<T> extends IKeyValueModuleContext {
  /**
   * 数据写入存储的方法
   *
   * @param key 存储键
   * @param value 要存储的数据
   */
  write: (key: string, value: IPersistedStorageItem<T>) => Promise<unknown>;

  /**
   * 从存储读取数据的方法
   *
   * @param key 存储键
   * @returns 读取的数据或undefined
   */
  read: (key: string) => Promise<IPersistedStorageItem<T> | undefined>;

  /**
   * 已删除项目的存活时间(毫秒)
   * @default 86400000 (1天)
   */
  deletedItemTtl?: number;
}

/**
 * 持久化键值对模块接口
 */
export interface IPersistedKeyValueModule<T> extends ReduxSagaModule {
  actions: {
    updateAction: PayloadActionCreator<[string, T][]>;
    removeAction: PayloadActionCreator<string[]>;
    clearAction: PayloadActionCreator<void>;
  };

  selectors: {
    getByKey: Selector<(key: string) => T | undefined>;
    getKeys: Selector<() => IterableIterator<string>>;
    getValues: Selector<() => IterableIterator<T>>;
    getEntries: Selector<() => IterableIterator<[string, T]>>;
    getSize: Selector<number>;
  };

  services: {
    read: (keys: string[]) => IterableIterator<Effect | (T | undefined)[]>;
    update: (pairs: [string, T][]) => IterableIterator<Effect | void>;
    remove: (keys: string[]) => IterableIterator<Effect | void>;
    clear: () => IterableIterator<Effect | void>;
  };
}

/**
 * 创建一个持久化的键值对存储模块
 *
 * @template T 存储值的类型
 * @param ctx 模块上下文配置
 * @returns 持久化键值对模块实例
 */
export const createPersistedKeyValueModule = <T>(
  ctx: IPersistedKeyValueModuleContext<T>,
): IPersistedKeyValueModule<T> => {
  const deletedItemTtl = ctx.deletedItemTtl ?? 86400000;

  const { name } = ctx;
  const rootSelector = ctx.rootSelector || DefaultRootSelectorFactory(name);

  // 创建内部键值对模块
  const kvModule = createKeyValueModule<StorageItem<T>>({
    name: `${name}[kv]`,
    rootSelector,
    optImpureReducer: ctx.optImpureReducer,
  });

  // 创建 Action creators（RTK 原生）
  const updateAction = createAction<[string, T][]>(`${name}/update`);
  const removeAction = createAction<string[]>(`${name}/remove`);
  const clearAction = createAction<void>(`${name}/clear`);

  const getCurrentTime = () => Date.now();

  /**
   * 将当前状态写入存储
   */
  function* writeStorage(): Generator<Effect, void, any> {
    const getEntries: SR<typeof kvModule.selectors.getEntries> = yield select(kvModule.selectors.getEntries);

    const nextStorage: IPersistedStorageItem<T> = {};
    const now = Date.now();

    for (const [key, storageItem] of getEntries()) {
      if (!(storageItem.r && storageItem.u + deletedItemTtl < now)) {
        nextStorage[key] = storageItem;
      }
    }

    yield call(ctx.write, name, nextStorage);
  }

  /**
   * 读取指定键的数据服务
   */
  function* readService(keys: string[]): Generator<Effect, (T | undefined)[], any> {
    if (keys.length === 0) return [];

    const storage: SR<typeof ctx.read> = yield call(ctx.read, name);
    if (!storage) return keys.map(() => undefined);

    const now: number = yield call(getCurrentTime);

    const toUpdate: Array<[string, StorageItem<T>]> = [];
    const result: Array<T | undefined> = [];

    for (const key of keys) {
      const storageItem = storage[key];
      if (storageItem && !storageItem.r) {
        toUpdate.push([key, { u: now, r: false, p: storageItem.p }]);
        result.push(storageItem.p);
      } else {
        result.push(undefined);
      }
    }

    if (toUpdate.length > 0) {
      yield put(kvModule.actions.updateAction(toUpdate));
      // 等待 store 状态更新传播后再继续，确保后续 selector 读取到最新数据
      yield delay(10);
    }

    return result;
  }

  /**
   * 更新数据服务
   */
  function* updateService(pairs: [string, T][]): Generator<Effect, void, any> {
    if (pairs.length === 0) return;

    const now: number = yield call(getCurrentTime);

    const items: Array<[string, StorageItem<T>]> = pairs.map(([key, value]) => [key, { u: now, r: false, p: value }]);
    yield put(kvModule.actions.updateAction(items));

    yield call(writeStorage);
  }

  /**
   * 删除数据服务
   */
  function* removeService(keys: string[]): Generator<Effect, void, any> {
    if (keys.length === 0) return;

    const now: number = yield call(getCurrentTime);

    const getByKey = yield select(kvModule.selectors.getByKey);
    const existingKeys = keys.filter(key => getByKey(key) !== undefined);
    if (existingKeys.length === 0) return;

    yield put(kvModule.actions.removeAction(existingKeys));

    const deletedItems: Array<[string, StorageItem<T>]> = existingKeys.map(key => [
      key,
      { u: now, r: true, p: {} as T },
    ]);
    yield put(kvModule.actions.updateAction(deletedItems));

    yield call(writeStorage);
  }

  /**
   * 清空数据服务
   */
  function* clearService(): Generator<Effect, void, any> {
    const getKeys = yield select(kvModule.selectors.getKeys);
    const keys = [...getKeys()];
    if (keys.length === 0) return;

    const now: number = yield call(getCurrentTime);

    yield put(kvModule.actions.clearAction());

    const deletedItems: Array<[string, StorageItem<T>]> = keys.map(key => [key, { u: now, r: true, p: {} as T }]);
    yield put(kvModule.actions.updateAction(deletedItems));

    yield call(writeStorage);
  }

  /**
   * 模块的saga函数
   */
  function* saga(): Generator<Effect, void, any> {
    // 从存储初始化数据
    const storage: IPersistedStorageItem<T> | undefined = yield call(ctx.read, name);
    if (storage) {
      const now: number = yield call(getCurrentTime);
      const validItems: Array<[string, StorageItem<T>]> = Object.entries(storage)
        .filter(([, item]) => {
          return item && typeof item === 'object' && 'r' in item && !item.r;
        })
        .map(([key, item]) => {
          const typedItem = item as StorageItem<T>;
          return [key, { u: now, r: false, p: typedItem.p }];
        });

      if (validItems.length > 0) {
        yield put(kvModule.actions.updateAction(validItems));
      }
    }

    // 监听各类动作（使用 RTK .match 作为 pattern）
    yield takeEvery(updateAction.match, (action: ReturnType<typeof updateAction>) =>
      call(updateService, action.payload),
    );
    yield takeEvery(removeAction.match, (action: ReturnType<typeof removeAction>) =>
      call(removeService, action.payload),
    );
    yield takeEvery(clearAction.match, () => call(clearService));
  }

  /**
   * 创建转换过的选择器
   */
  function createTransformedSelector<K extends keyof IKeyValueModule<StorageItem<T>>['selectors']>(selector: K): any {
    if (selector === 'getByKey') {
      return defineSelector(
        () => ({ kvSelector: kvModule.selectors[selector] }),
        ({ kvSelector }) =>
          (key: string) => {
            const item = (kvSelector as any)(key) as StorageItem<T> | undefined;
            return item && !item.r ? item.p : undefined;
          },
      );
    }

    if (selector === 'getValues') {
      return defineSelector(
        () => ({ kvSelector: kvModule.selectors[selector] }),
        ({ kvSelector }) =>
          function* () {
            const valuesIterator = (kvSelector as any)() as Iterable<StorageItem<T>>;
            for (const item of valuesIterator) {
              if (!item.r) yield item.p;
            }
          },
      );
    }

    if (selector === 'getEntries') {
      return defineSelector(
        () => ({ kvSelector: kvModule.selectors[selector] }),
        ({ kvSelector }) =>
          function* () {
            const entriesIterator = (kvSelector as any)() as Iterable<[string, StorageItem<T>]>;
            for (const [key, item] of entriesIterator) {
              if (!item.r) yield [key, item.p] as [string, T];
            }
          },
      );
    }

    if (selector === 'getKeys') {
      return defineSelector(
        () => ({ entriesSelector: kvModule.selectors.getEntries }),
        ({ entriesSelector }) =>
          function* () {
            const entries = (entriesSelector as any)() as Iterable<[string, StorageItem<T>]>;
            for (const [key, item] of entries) {
              if (!item.r) yield key;
            }
          },
      );
    }

    if (selector === 'getSize') {
      return defineSelector(
        () => ({ entriesSelector: kvModule.selectors.getEntries }),
        ({ entriesSelector }) => {
          let count = 0;
          const entries = (entriesSelector as any)() as Iterable<[string, StorageItem<T>]>;
          for (const [, item] of entries) {
            if (!item.r) count++;
          }
          return count;
        },
      );
    }

    throw new Error(`未知的选择器: ${String(selector)}`);
  }

  return {
    name,
    reducer: kvModule.reducer,
    saga,
    actions: { updateAction, removeAction, clearAction },
    selectors: {
      getByKey: createTransformedSelector('getByKey'),
      getValues: createTransformedSelector('getValues'),
      getKeys: createTransformedSelector('getKeys'),
      getEntries: createTransformedSelector('getEntries'),
      getSize: createTransformedSelector('getSize'),
    },
    services: {
      read: readService,
      update: updateService,
      remove: removeService,
      clear: clearService,
    },
  };
};
