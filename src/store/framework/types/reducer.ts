import type { Reducer, UnknownAction } from '@reduxjs/toolkit';

/**
 * ReducerManager — 动态增删 reducer
 */
export interface ReducerManager {
  getReducerMap: () => Record<string, Reducer>;
  reduce: (state: any, action: UnknownAction) => any;
  add: (key: string, reducer: Reducer) => void;
  remove: (key: string) => void;
}
