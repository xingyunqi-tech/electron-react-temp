import type { EnhancedStore } from '@reduxjs/toolkit';
import type { Task } from 'redux-saga';
import createSagaMiddleware from 'redux-saga';
import type { ReducerManager, ReduxModule } from '../types';

/** saga 任务注册表类型 */
export type SagaTaskRegistry = Map<string, Task>;

/** 创建独立的 saga 任务注册表（每个 store 应有独立实例） */
export function createSagaTaskRegistry(): SagaTaskRegistry {
  return new Map<string, Task>();
}

/**
 * 动态注册一个模块到 store
 */
export function defineModule(
  store: EnhancedStore,
  reducerManager: ReducerManager,
  module: ReduxModule,
  sagaMiddleware?: ReturnType<typeof createSagaMiddleware>,
  sagaTasks?: SagaTaskRegistry,
): void {
  const { name, reducer, saga } = module;
  const existingReducers = reducerManager.getReducerMap();

  if (existingReducers[name]) {
    console.warn(`[redux-framework] Module "${name}" is already registered, skipping.`);
    return;
  }

  reducerManager.add(name, reducer);
  // 触发 store 更新（通过 dispatch 而非 replaceReducer，保持插件包装层完整）
  store.dispatch({ type: `@@redux-framework/MODULE_DEFINED/${name}` });

  // 启动模块的 saga（如果提供了 sagaMiddleware）
  if (saga && sagaMiddleware) {
    const task = sagaMiddleware.run(saga);
    sagaTasks?.set(name, task);
  }
}

/**
 * 动态销毁一个模块
 */
export function destroyModule(
  store: EnhancedStore,
  reducerManager: ReducerManager,
  moduleName: string,
  sagaTasks?: SagaTaskRegistry,
): void {
  // 先取消 saga 任务
  const task = sagaTasks?.get(moduleName);
  if (task) {
    task.cancel();
    sagaTasks!.delete(moduleName);
  }

  const existingReducers = reducerManager.getReducerMap();

  if (!existingReducers[moduleName]) {
    console.warn(`[redux-framework] Module "${moduleName}" is not registered, skipping.`);
    return;
  }

  reducerManager.remove(moduleName);
  // 触发 store 更新（通过 dispatch 而非 replaceReducer，保持插件包装层完整）
  store.dispatch({ type: `@@redux-framework/MODULE_DESTROYED/${moduleName}` });
}
