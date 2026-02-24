/**
 * Web Vitals 性能监控插件
 *
 * 功能：
 * 1. 通过环境变量 VITE_ENABLE_WEB_VITALS 配置启用
 * 2. 监控核心性能指标 (CLS, FCP, INP, LCP, TTFB)
 * 3. 额外支持内存使用监控
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';
import type { Metric } from 'web-vitals';

// 扩展 Metric 类型中的 name 字段
type IMetric = Omit<Metric, 'name'> & {
  name: 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB' | 'MEMORY';
};

type ReportHandler = (metric: IMetric) => void;

const MB = 1024 * 1024;

/**
 * 延迟执行函数（原生实现，替代 lodash-es.delay）
 * @param callback 回调函数
 * @param ms 延迟毫秒数
 */
const delay = (callback: () => void, ms: number): void => {
  setTimeout(callback, ms);
};

/**
 * 监控内存使用情况
 * @param onReport 回调函数
 */
const onMEMORY = (onReport: ReportHandler): void => {
  if (!performance.memory) {
    console.warn('Memory API is not supported in this browser');
    return;
  }

  delay(() => {
    const currentUsage = performance.memory.usedJSHeapSize;
    const memoryMetric: IMetric = {
      name: 'MEMORY',
      entries: [],
      rating: 'good',
      value: currentUsage / MB,
      delta: 0,
      id: `mem_${Date.now()}`,
      navigationType: 'navigate',
    };

    onReport(memoryMetric);
  }, 2000);
};

/**
 * 上报性能指标
 * @param onPerfEntry
 * @returns
 */
export const reportWebVitals = (onPerfEntry: ReportHandler) => {
  if (typeof onPerfEntry !== 'function') {
    console.warn('reportWebVitals: onPerfEntry must be a function');
    return;
  }

  // 注册所有性能指标监听器（这些函数是同步注册回调，不返回 Promise）
  try {
    onCLS(onPerfEntry);
    onFCP(onPerfEntry);
    onINP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
    onMEMORY(onPerfEntry);
  } catch (error) {
    console.error('Web vitals registration failed:', error);
  }
};
