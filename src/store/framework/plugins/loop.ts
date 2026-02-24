import createSagaMiddleware from 'redux-saga';
import type { Task } from 'redux-saga';
import { fork, cancel, take } from 'redux-saga/effects';
import { createAction } from '@reduxjs/toolkit';
import { loopWorker } from '../utils/loop';
import { logger } from '../utils/logger';
import type { ReduxPlugin } from '../types';
import type { LoopWorkerOptions } from '../utils/loop';

/**
 * 启动一个轮询任务
 */
export const startLoopAction = createAction<{ name: string; options: LoopWorkerOptions }>('@@loop/START');

/**
 * 停止指定轮询任务
 */
export const stopLoopAction = createAction<{ name: string }>('@@loop/STOP');

/**
 * 停止所有轮询任务
 */
export const stopAllLoopsAction = createAction('@@loop/STOP_ALL');

/**
 * Loop 管理 saga — 管理所有轮询任务的生命周期
 */
function* loopManagerSaga(): Generator {
  const runningTasks = new Map<string, Task>();

  while (true) {
    const action: any = yield take([startLoopAction.type, stopLoopAction.type, stopAllLoopsAction.type]);

    if (startLoopAction.match(action)) {
      const { name, options } = action.payload;
      // 如果同名任务已在运行，先停止
      if (runningTasks.has(name)) {
        const existingTask = runningTasks.get(name)!;
        yield cancel(existingTask);
        runningTasks.delete(name);
        logger.info(`Loop "${name}" restarted`);
      }
      const task: any = yield fork(loopWorker, options);
      runningTasks.set(name, task);
      logger.info(`Loop "${name}" started (interval: ${options.interval}ms)`);
    } else if (stopLoopAction.match(action)) {
      const { name } = action.payload;
      const task = runningTasks.get(name);
      if (task) {
        yield cancel(task);
        runningTasks.delete(name);
        logger.info(`Loop "${name}" stopped`);
      }
    } else if (stopAllLoopsAction.match(action)) {
      for (const [name, task] of runningTasks.entries()) {
        yield cancel(task);
        logger.info(`Loop "${name}" stopped`);
      }
      runningTasks.clear();
    }
  }
}

/** Loop 插件类型（包含暴露的 sagaMiddleware） */
export type LoopPlugin = ReduxPlugin & { sagaMiddleware: ReturnType<typeof createSagaMiddleware> };

/**
 * 创建 Loop 轮询插件
 *
 * 基于 redux-saga 实现定时轮询任务管理。
 * 通过 dispatch startLoopAction / stopLoopAction 控制。
 */
export function createLoopPlugin(): LoopPlugin {
  const sagaMiddleware = createSagaMiddleware();

  return {
    name: 'loop',

    middleware: [sagaMiddleware],

    sagaMiddleware,

    onStoreCreated() {
      sagaMiddleware.run(loopManagerSaga);
      logger.info('Loop plugin initialized');
    },
  };
}
