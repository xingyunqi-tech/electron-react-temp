import { call, delay, cancelled, type SagaReturnType } from 'redux-saga/effects';
import { logger } from './logger';

export interface LoopWorkerOptions {
  /** 轮询间隔 (ms) */
  interval: number;
  /** 执行的异步任务 */
  task: () => Promise<any> | Generator;
  /** 是否立即执行第一次（默认 true） */
  immediate?: boolean;
  /** 错误回调 */
  onError?: (error: unknown) => void;
}

/**
 * Saga Loop Worker — 定时执行任务
 *
 * 在 saga 上下文中循环调用 task，直到被 cancel。
 */
export function* loopWorker(options: LoopWorkerOptions): Generator {
  const { interval, task, immediate = true, onError } = options;

  try {
    if (!immediate) {
      yield delay(interval);
    }

    while (true) {
      try {
        yield call(task as any);
      } catch (error) {
        if (onError) {
          onError(error);
        } else {
          logger.warn('Loop task error:', error);
        }
      }
      yield delay(interval);
    }
  } finally {
    const isCancelled: SagaReturnType<typeof cancelled> = yield cancelled();
    if (isCancelled) {
      logger.info('Loop worker cancelled');
    }
  }
}

/**
 * LoopFactory — 创建可管理的轮询任务描述
 */
export interface LoopTask {
  name: string;
  options: LoopWorkerOptions;
}

export function createLoopTask(name: string, options: LoopWorkerOptions): LoopTask {
  return { name, options };
}
