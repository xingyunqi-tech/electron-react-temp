import type { Reducer } from '@reduxjs/toolkit';
import type { ReduxPlugin } from './plugin';

/**
 * createReduxFramework 配置项
 */
export interface ReduxFrameworkOptions {
  /** 初始静态 reducers */
  initialReducers: Record<string, Reducer>;
  /** 插件列表 */
  plugins?: ReduxPlugin[];
  /** redux-toolkit 的 middleware 配置回调 */
  middlewareCallback?: (getDefaultMiddleware: any) => any;
  /** 是否启用 Redux DevTools（建议生产环境关闭）@default true */
  devTools?: boolean;
}
