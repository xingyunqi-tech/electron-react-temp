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
