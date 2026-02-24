import { combineReducers } from '@reduxjs/toolkit';
import type { Reducer, UnknownAction } from '@reduxjs/toolkit';
import type { ReducerManager } from '../types';

/**
 * 创建动态 Reducer 管理器
 *
 * 支持运行时动态注册和销毁 reducer，
 * 不需要重新创建 store。
 */
export function createReducerManager(initialReducers: Record<string, Reducer>): ReducerManager {
  const reducers = { ...initialReducers };
  let combinedReducer = combineReducers(reducers);
  let keysToRemove: string[] = [];

  return {
    getReducerMap() {
      return reducers;
    },

    reduce(state: any, action: UnknownAction) {
      // 清理已删除的 reducer 对应的 state
      if (keysToRemove.length > 0) {
        state = { ...state };
        for (const key of keysToRemove) {
          delete state[key];
        }
        keysToRemove = [];
      }
      return combinedReducer(state, action);
    },

    add(key: string, reducer: Reducer) {
      if (reducers[key]) return;
      reducers[key] = reducer;
      combinedReducer = combineReducers(reducers);
    },

    remove(key: string) {
      if (!reducers[key]) return;
      delete reducers[key];
      keysToRemove.push(key);
      combinedReducer = combineReducers(reducers);
    },
  };
}
