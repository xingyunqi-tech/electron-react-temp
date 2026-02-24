/**
 * 多源数据加载状态枚举
 */
export enum MultiSourceFetcherStatus {
  /** 初始状态，未开始加载 */
  IDLE = 'idle',
  /** 加载中 */
  LOADING = 'loading',
  /** 加载成功 */
  SUCCESS = 'success',
  /** 加载失败 */
  FAILURE = 'failure',
  /** 加载被中断 */
  ABORTED = 'aborted',
}

/**
 * 多源数据加载状态类型
 */
export type IMultiSourceFetcherStatusValuesType =
  | MultiSourceFetcherStatus.IDLE
  | MultiSourceFetcherStatus.LOADING
  | MultiSourceFetcherStatus.SUCCESS
  | MultiSourceFetcherStatus.FAILURE
  | MultiSourceFetcherStatus.ABORTED;

/**
 * 默认情况下，source的状态为初始状态
 */
export const DEFAULT_FETCHER_STATUS = MultiSourceFetcherStatus.IDLE;
