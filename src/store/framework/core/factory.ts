import { configureStore } from '@reduxjs/toolkit';
import type { EnhancedStore, Middleware } from '@reduxjs/toolkit';
import { createReducerManager } from './reducers';
import type { ReduxFrameworkOptions, ReducerManager, PluginManager, ReduxPlugin } from '../types';

export interface ReduxFrameworkResult {
  store: EnhancedStore;
  reducerManager: ReducerManager;
  pluginManager: PluginManager;
}

/**
 * 创建 Redux Framework
 *
 * 整合 ReducerManager + 插件体系，返回增强的 store。
 */
export function createReduxFramework(options: ReduxFrameworkOptions): ReduxFrameworkResult {
  const { initialReducers, plugins = [], middlewareCallback, devTools = true } = options;

  // 1. 创建 ReducerManager
  const reducerManager = createReducerManager(initialReducers);

  // 2. 让插件包装 rootReducer
  let rootReducer = reducerManager.reduce;
  for (const plugin of plugins) {
    if (plugin.wrapReducer) {
      rootReducer = plugin.wrapReducer(rootReducer as any) as any;
    }
  }

  // 3. 收集插件中间件
  const pluginMiddleware: Middleware[] = [];
  for (const plugin of plugins) {
    if (plugin.middleware) {
      pluginMiddleware.push(...plugin.middleware);
    }
  }

  // 4. 收集插件 enhancers
  const pluginEnhancers = plugins.flatMap(p => p.enhancers ?? []);

  // 5. 创建 store
  const store = configureStore({
    reducer: rootReducer as any,
    devTools,
    middleware: getDefaultMiddleware => {
      const base = middlewareCallback
        ? middlewareCallback(getDefaultMiddleware)
        : getDefaultMiddleware({ serializableCheck: false });
      return base.concat(pluginMiddleware);
    },
    enhancers: getDefaultEnhancers => {
      return getDefaultEnhancers().concat(pluginEnhancers);
    },
  });

  // 6. 创建插件管理器
  const pluginManager: PluginManager = {
    plugins,
    getPlugin(name: string): ReduxPlugin | undefined {
      return plugins.find(p => p.name === name);
    },
  };

  // 7. 通知插件 store 已创建
  for (const plugin of plugins) {
    if (plugin.onStoreCreated) {
      plugin.onStoreCreated({
        getState: store.getState,
        dispatch: store.dispatch,
        subscribe: store.subscribe,
      });
    }
  }

  return { store, reducerManager, pluginManager };
}
