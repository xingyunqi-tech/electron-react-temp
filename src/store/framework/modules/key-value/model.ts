import type { PayloadActionCreator } from '@reduxjs/toolkit';
import type { Selector } from '../../utils/defineSelector';
import type { ReduxModule } from '../../types';

/**
 * Key Value 存储模块的接口定义
 * 维护一组键值对映射关系，支持增删改查操作
 *
 * @template T 值类型
 */
export interface IKeyValueModule<T> extends ReduxModule {
  /**
   * 键值对模块的动作集合
   */
  actions: {
    /** 批量更新键值对 */
    updateAction: PayloadActionCreator<Array<[string, T]>>;
    /** 批量删除键 */
    removeAction: PayloadActionCreator<string[]>;
    /** 清空所有键值对 */
    clearAction: PayloadActionCreator<void>;
  };

  /**
   * 访问键值对数据的选择器集合
   *
   * 设计原则：
   * 1. 通过迭代器模式访问数据，避免不必要的数组构造
   * 2. 强制处理值不存在的情况，提高类型安全性
   * 3. 不提供顺序保证，由外部决定排序逻辑
   */
  selectors: {
    /** 通过键获取值，处理值不存在的情况 */
    getByKey: Selector<(key: string) => T | undefined>;
    /** 获取所有键的迭代器 */
    getKeys: Selector<() => IterableIterator<string>>;
    /** 获取所有值的迭代器 */
    getValues: Selector<() => IterableIterator<T>>;
    /** 获取所有键值对的迭代器 */
    getEntries: Selector<() => IterableIterator<[string, T]>>;
    /** 获取键值对数量 */
    getSize: Selector<number>;
  };
}

/**
 * 创建键值对模块所需的上下文配置
 */
export interface IKeyValueModuleContext {
  /** 模块名称，需要在 store 中唯一 */
  name: string;
  /** 自定义根 Selector（默认为 state => state[name]） */
  rootSelector?: (state: any) => any;
  /**
   * 性能优化选项：允许不纯的Reducer
   *
   * 当启用时，Reducer 将直接修改状态对象而非创建副本，提高性能
   * 注意：启用此选项会影响 Redux DevTools 的时间旅行功能
   *
   * @default false
   */
  optImpureReducer?: boolean;
}
