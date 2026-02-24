import type { Reducer } from '@reduxjs/toolkit';

/**
 * Redux 模块定义
 */
export interface ReduxModule {
  name: string;
  reducer: Reducer;
  saga?: () => Generator;
}

/**
 * 带 Saga 的 Redux 模块定义（saga 必选）
 */
export interface ReduxSagaModule extends ReduxModule {
  saga: () => Generator;
}
