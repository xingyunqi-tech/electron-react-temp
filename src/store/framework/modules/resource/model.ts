import type { PayloadActionCreator } from '@reduxjs/toolkit';
import type { ReduxSagaModule } from '../../types';
import type { SagaEffectSubject } from '../../utils/saga';
import type { Selector } from '../../utils/defineSelector';
import type { IKeyValueModuleContext } from '../key-value';

/**
 * 资源模块接口定义
 * 维护一组同类型资源(item)的状态，每个item都有唯一的键(key)
 * @template T 资源类型
 * @template P 额外参数类型，默认为 any
 */
export interface IResourceModule<T, P = any> extends ReduxSagaModule {
  /**
   * 资源操作动作集合
   */
  actions: {
    /** 更新资源项 */
    updateItemsAction: PayloadActionCreator<T[]>;
    /** 移除资源项 */
    removeItemsAction: PayloadActionCreator<string[]>;
    /** 触碰资源项(缓存优先策略) */
    touchItemsAction: PayloadActionCreator<string[]>;
    /** 强制获取资源项 */
    fetchItemsAction: PayloadActionCreator<string[]>;
    /** 清空所有资源 */
    clearItemsAction: PayloadActionCreator<void>;
  };

  /**
   * 资源查询选择器集合
   */
  selectors: {
    /** 通过键获取资源项 */
    getItemByKey: Selector<(key: string) => T | undefined>;
    /** 获取所有资源键的迭代器 */
    getKeys: Selector<() => IterableIterator<string>>;
    /** 获取所有资源项的迭代器 */
    getItems: Selector<() => IterableIterator<T>>;
    /** 获取所有资源键值对的迭代器 */
    getEntries: Selector<() => IterableIterator<[string, T]>>;
    /** 获取资源数量 */
    getSize: Selector<number>;
  };

  /** 模块服务接口 */
  services: {
    /**
     * 确保资源项有效并返回
     * @param keys 要获取的资源键数组
     * @param params 额外参数（可选）
     * @returns 资源项数组
     */
    getItems: (keys: string[], params?: P) => SagaEffectSubject<T[]>;
  };

  /** 模块工具函数 */
  utils: {
    /** 获取资源的唯一键 */
    getKey: (item: T) => string;
  };
}

/**
 * 创建资源模块所需的上下文配置
 * @template T 资源类型
 * @template P 额外参数类型，默认为 any
 */
export interface IResourceModuleContext<T, P = any> extends Pick<IKeyValueModuleContext, 'optImpureReducer'> {
  /** 模块名称 */
  name: string;
  /** 自定义根 Selector */
  rootSelector?: (state: any) => any;
  /** 获取资源的唯一键 */
  getKey: (item: T) => string;
  /** 批量资源获取处理器（优先级高于单一处理器） */
  batchFetchHandler?: (keys: string[], params: P | undefined, module: IResourceModule<T, P>) => SagaEffectSubject<T[]>;
  /** 单一资源获取处理器 */
  fetchHandler?: (key: string, params: P | undefined, module: IResourceModule<T, P>) => SagaEffectSubject<T[]>;
}
