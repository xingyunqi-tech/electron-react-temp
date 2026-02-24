import type { Effect, SagaReturnType } from 'redux-saga/effects';

/** SagaReturnType 简写 */
export type SR<T extends (...args: any[]) => any> = SagaReturnType<T>;

/** Saga Effect 主题类型 */
export type SagaEffectSubject<T> = IterableIterator<Effect | T>;
