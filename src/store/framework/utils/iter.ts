/**
 * 执行 effect 并返回结果
 */
export function* doEffect<T>(iter: IterableIterator<T>, effect: (v: T) => any): IterableIterator<T> {
  for (const v of iter) {
    effect(v);
    yield v;
  }
}

/**
 * 过滤
 */
export function* filter<T>(iter: IterableIterator<T>, predicate: (v: T) => boolean): IterableIterator<T> {
  for (const v of iter) {
    if (predicate(v)) {
      yield v;
    }
  }
}

/**
 * 映射
 */
export function* map<T, K>(iter: IterableIterator<T>, mapper: (v: T) => K): IterableIterator<K> {
  for (const v of iter) {
    yield mapper(v);
  }
}

/**
 * 归约
 */
export function reduce<T, K>(iter: IterableIterator<T>, reducer: (acc: K, cur: T) => K, init: K) {
  let acc = init;
  for (const v of iter) {
    acc = reducer(acc, v);
  }
  return acc;
}

/**
 * 跳过
 */
export function* skip<T>(iter: IterableIterator<T>, count: number): IterableIterator<T> {
  let i = 0;
  for (const v of iter) {
    if (i >= count) {
      yield v;
    }
    i++;
  }
}

/**
 * 取前 n 个
 */
export function* take<T>(iter: IterableIterator<T>, count: number): IterableIterator<T> {
  let i = 0;
  for (const v of iter) {
    if (i < count) {
      yield v;
    } else {
      break;
    }
    i++;
  }
}
