import type { Reducer, Middleware, StoreEnhancer } from '@reduxjs/toolkit';

/**
 * 插件上下文 — 在插件初始化时传入
 */
export interface PluginContext {
  getState: () => any;
  dispatch: (action: any) => any;
  subscribe: (listener: () => void) => () => void;
}

/**
 * Redux 框架插件接口
 */
export interface ReduxPlugin {
  name: string;
  /** 包装 reducer（如 persist） */
  wrapReducer?: (reducer: Reducer) => Reducer;
  /** 额外的中间件 */
  middleware?: Middleware[];
  /** Store enhancer */
  enhancers?: StoreEnhancer[];
  /** store 创建后的回调 */
  onStoreCreated?: (context: PluginContext) => void;
  /** 渲染 Provider 包装层（由外到内） */
  Provider?: React.ComponentType<{ children: React.ReactNode }>;
}

/**
 * 插件管理器
 */
export interface PluginManager {
  plugins: ReduxPlugin[];
  getPlugin: (name: string) => ReduxPlugin | undefined;
}
