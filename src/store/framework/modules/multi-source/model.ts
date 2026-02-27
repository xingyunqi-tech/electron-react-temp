import type { Effect } from 'redux-saga/effects';
import type { PayloadActionCreator } from '@reduxjs/toolkit';
import type { Selector } from '../../utils/defineSelector';
import type { ReduxSagaModule } from '../../types';
import type { IMultiSourceFetcherStatusValuesType } from './constant';

/**
 * 多源数据模块接口定义
 *
 * 管理来自多个数据源的数据，支持数据的加载、合并和排序
 *
 * @template T 数据项类型
 */
export interface IMultiSourceModule<T> extends ReduxSagaModule {
  actions: {
    /** 中断正在执行的数据请求 */
    abortAction: PayloadActionCreator<void>;
    /** 触发前N项数据加载 */
    touchTopNAction: PayloadActionCreator<number>;
    /** 清空所有数据 */
    clearAction: PayloadActionCreator<void>;
  };

  selectors: {
    /** 获取已排序的稳定数据列表 */
    sortedItems: Selector<T[]>;
    /** 获取数据总数 */
    total: Selector<number | undefined>;
    /** 获取不稳定的已加载数据列表 */
    unstableItems: Selector<T[]>;
    /** 获取各数据源的加载状态 */
    sourceFetchingStatus: Selector<Record<string, IMultiSourceFetcherStatusValuesType>>;
    /** 获取指定数据源的数据总数 */
    getTotalBySourceId: Selector<(sourceId: string) => number | undefined>;
  };
}

/**
 * 创建多源数据模块所需的上下文配置
 *
 * @template T 数据项类型
 */
export interface IMultiSourceModuleContext<T> {
  /** 模块名称 */
  name: string;
  /** 自定义根 Selector */
  rootSelector?: (state: any) => any;
  /** 获取可用的数据源ID列表 */
  sourceIds: Selector<string[]>;
  /** 数据项排序比较器 */
  comparator: (itemA: T, itemB: T) => number;
  /** 获取数据项所属的数据源ID */
  getSourceId: (item: T) => string;
  /** 获取数据项的唯一标识 */
  getItemKey: (item: T) => string;

  /**
   * 批量数据请求处理器
   */
  batchFetcherHandler: (
    requests: Array<{
      sourceId: string;
      start: number;
      limit: number;
    }>,
    actions: {
      triggerUpdateMultiSourceDataAction: PayloadActionCreator<Array<{ sourceId: string; items: T[]; total?: number }>>;
      updateMultiSourceFetchingStatusAction: PayloadActionCreator<Array<[string, IMultiSourceFetcherStatusValuesType]>>;
    },
  ) => IterableIterator<
    | Effect
    | Array<{
        sourceId: string;
        items: T[];
        total?: number;
      }>
  >;
}
