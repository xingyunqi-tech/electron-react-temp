import { createSelector } from '@reduxjs/toolkit';

export type Selector<T> = (state: any) => T;

/**
 * 解析依赖类型
 */
type ResolveDependencies<TDep> = {
  [key in keyof TDep]: TDep[key] extends (...args: any[]) => infer K ? K : never;
};

/**
 * 定义 Selector 类型
 */
export type IDefinedSelector<TResult, ResolvedDep> = ((state: any) => TResult) & {
  /**
   * 获取 combiner 的引用
   *
   * 当 combiner 的类型是通过类型推导，比较复杂时，从 IDefineSelector.combiner 获取 combiner 会更加方便
   */
  combiner: (deps: ResolvedDep) => TResult;
};

/**
 * 定义 Selector — 懒初始化 memoized selector 工厂
 * @param resolver 引用依赖
 * @param combiner 组合函数
 */
export const defineSelector = <TResult, TDep extends Record<string, any>>(
  resolver: () => TDep,
  combiner: (deps: ResolveDependencies<TDep>) => TResult,
): IDefinedSelector<TResult, ResolveDependencies<TDep>> => {
  let selector: Selector<TResult> | undefined;

  const f = (state: any) => {
    if (!selector) {
      const deps = resolver();
      const arr = Object.entries(deps);
      const keys = arr.map(item => item[0]);
      const selectors = arr.map(item => item[1]);

      selector = createSelector(selectors, (...args: any[]) => {
        const ret: Record<string, any> = {};
        args.forEach((arg, idx) => {
          ret[keys[idx]!] = arg;
        });
        return combiner(ret as ResolveDependencies<TDep>);
      });
    }
    return selector(state);
  };

  return Object.assign(f, { combiner });
};
