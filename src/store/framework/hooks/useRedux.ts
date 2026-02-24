import { useDispatch, useSelector, useStore } from 'react-redux';
import { useCallback } from 'react';
import type { ThunkAction, UnknownAction } from '@reduxjs/toolkit';

/**
 * 增强的 useReduxDispatch — 支持 thunk 和普通 action
 */
export function useReduxDispatch() {
  return useDispatch();
}

/**
 * 增强的 useReduxSelector — 带类型推断
 */
export function useReduxSelector<TState = any, TSelected = unknown>(selector: (state: TState) => TSelected): TSelected {
  return useSelector(selector);
}

/**
 * useReduxCall — dispatch 一个 thunk 并返回结果
 */
export function useReduxCall() {
  const dispatch = useDispatch();

  return useCallback(
    <ReturnType>(thunkAction: ThunkAction<ReturnType, any, any, UnknownAction>): ReturnType => {
      return dispatch(thunkAction as any) as ReturnType;
    },
    [dispatch],
  );
}

/**
 * useReduxStore — 直接访问 store
 */
export function useReduxStore() {
  return useStore();
}
