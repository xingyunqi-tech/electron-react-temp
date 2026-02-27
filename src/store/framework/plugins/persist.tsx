import React from 'react';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import type { Persistor, PersistConfig } from 'redux-persist';
import type { Reducer } from '@reduxjs/toolkit';
import type { ReduxPlugin, PluginContext } from '../types';
import localforage from 'localforage';

export interface PersistPluginOptions {
  key: string;
  storage: any;
  whitelist?: string[];
  blacklist?: string[];
  loading?: React.ReactNode;
}

/**
 * localforage 配置
 */
export const appStorage = localforage.createInstance({
  name: 'electron-react-temp',
  storeName: 'redux-persist',
  description: 'Redux 持久化存储',
  driver: localforage.INDEXEDDB,
});

/**
 * 创建 Persist 持久化插件
 *
 * 包装 rootReducer 实现自动持久化，
 * 并提供 PersistGate Provider。
 */
let _persistor: Persistor | null = null;

/**
 * 持久化管理器
 *
 * 对外暴露 redux-persist Persistor 的常用操作，
 * 隐藏内部 Persistor 实例细节，按需扩展。
 */
export const persistManager = {
  /** 等待所有挂起的状态写入存储完成 */
  flush: (): Promise<void> => _persistor?.flush() ?? Promise.resolve(),
  /** 清空所有持久化数据（恢复出厂） */
  purge: (): Promise<void> => _persistor?.purge() ?? Promise.resolve(),
  /** 暂停持久化写入 */
  pause: () => _persistor?.pause(),
  /** 恢复持久化写入 */
  resume: () => _persistor?.persist(),
};

export function createPersistPlugin(options: PersistPluginOptions): ReduxPlugin {
  let persistor: Persistor | null = null;

  const persistConfig: PersistConfig<any> = {
    key: options.key,
    storage: options.storage,
    whitelist: options.whitelist,
    blacklist: options.blacklist,
  };

  return {
    name: 'persist',

    wrapReducer(reducer: Reducer): Reducer {
      return persistReducer(persistConfig, reducer) as unknown as Reducer;
    },

    onStoreCreated(context: PluginContext) {
      // persistStore 需要完整的 store 对象（subscribe 必须是真实引用，否则状态变更后不会写入存储）
      const storeProxy = {
        getState: context.getState,
        dispatch: context.dispatch,
        subscribe: context.subscribe,
        replaceReducer: () => {},
        [Symbol.observable]: () => ({
          subscribe: () => ({ unsubscribe: () => {} }),
          [Symbol.observable]() {
            return this;
          },
        }),
      };
      persistor = persistStore(storeProxy as any);
      _persistor = persistor;
    },

    Provider({ children }: { children: React.ReactNode }) {
      if (!persistor) {
        return <>{children}</>;
      }
      return (
        <PersistGate loading={options.loading ?? null} persistor={persistor}>
          {children}
        </PersistGate>
      );
    },
  };
}

/**
 * persist 插件需要忽略的 action types（供外部 middleware 配置使用）
 */
export const persistIgnoredActions = [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER];
