import type { Reducer } from '@reduxjs/toolkit';
import { createAction } from '@reduxjs/toolkit';
import { DefaultRootSelectorFactory } from '../../utils/rootSelector';
import { defineSelector } from '../../utils/defineSelector';
import type { IKeyValueModule, IKeyValueModuleContext } from './model';

/**
 * 键值对存储模块的状态接口
 * @template T 存储值的类型
 */
interface IState<T> {
  /** 存储键值对的映射 */
  hub: Record<string, T>;
  /** 当前存储的键值对数量 */
  size: number;
}

/**
 * 创建键值对存储模块
 *
 * @template T 值的类型
 * @param ctx 模块上下文配置
 * @returns 键值对存储模块实例
 */
export const createKeyValueModule = <T>(ctx: IKeyValueModuleContext): IKeyValueModule<T> => {
  const { name } = ctx;

  // 创建 Action creators（RTK 原生）
  const actions = {
    updateAction: createAction<Array<[string, T]>>(`${name}/update`),
    removeAction: createAction<string[]>(`${name}/remove`),
    clearAction: createAction<void>(`${name}/clear`),
  };

  // 初始状态
  const initState: IState<T> = { hub: {}, size: 0 };

  /**
   * 模块的reducer函数，处理状态更新逻辑
   */
  const reducer: Reducer<IState<T>> = (state = initState, action) => {
    // 处理更新操作
    if (actions.updateAction.match(action)) {
      const { payload } = action;
      if (payload.length === 0) {
        return state;
      }

      const hub = ctx.optImpureReducer ? state.hub : { ...state.hub };
      let size = state.size;

      payload.forEach(([key, value]) => {
        const isNewKey = !Object.prototype.hasOwnProperty.call(hub, key);
        if (isNewKey) {
          size++;
        }
        hub[key] = value;
      });

      return { ...state, hub, size };
    }

    // 处理删除操作
    if (actions.removeAction.match(action)) {
      const keysToRemove = action.payload.filter(key => Object.prototype.hasOwnProperty.call(state.hub, key));

      if (keysToRemove.length === 0) {
        return state;
      }

      const hub = ctx.optImpureReducer ? state.hub : { ...state.hub };

      keysToRemove.forEach(key => delete hub[key]);

      return { ...state, hub, size: state.size - keysToRemove.length };
    }

    // 处理清空操作
    if (actions.clearAction.match(action)) {
      return { ...state, hub: {}, size: 0 };
    }

    return state;
  };

  // 获取模块的根选择器，如未提供则使用默认实现
  const rootSelector = ctx.rootSelector || DefaultRootSelectorFactory(name);

  const selectors = {
    getByKey: defineSelector(
      () => ({ rootSelector }),
      ({ rootSelector }) =>
        (key: string): T | undefined =>
          rootSelector.hub[key],
    ),

    getKeys: defineSelector(
      () => ({ rootSelector }),
      ({ rootSelector }) =>
        function* (): IterableIterator<string> {
          const { hub } = rootSelector;
          for (const key in hub) {
            if (Object.prototype.hasOwnProperty.call(hub, key)) {
              yield key;
            }
          }
        },
    ),

    getValues: defineSelector(
      () => ({ rootSelector }),
      ({ rootSelector }) =>
        function* (): IterableIterator<T> {
          const { hub } = rootSelector;
          for (const key in hub) {
            if (Object.prototype.hasOwnProperty.call(hub, key)) {
              yield hub[key]!;
            }
          }
        },
    ),

    getEntries: defineSelector(
      () => ({ rootSelector }),
      ({ rootSelector }) =>
        function* (): IterableIterator<[string, T]> {
          const { hub } = rootSelector;
          for (const key in hub) {
            if (Object.prototype.hasOwnProperty.call(hub, key)) {
              yield [key, hub[key]!];
            }
          }
        },
    ),

    getSize: defineSelector(
      () => ({ rootSelector }),
      ({ rootSelector }) => rootSelector.size,
    ),
  };

  return {
    name,
    reducer,
    actions,
    selectors,
  };
};
