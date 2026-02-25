/**
 * Sentry 配置模块
 * 可配置项从前端配置系统读取，安全/过滤规则保留在代码中
 */

import { config as frontendConfig } from '@/constants/frontendConfig';

/**
 * 检查是否启用 Sentry
 * 通过环境变量 VITE_ENABLE_SENTRY 控制（主开关，不受前端配置影响）
 */
export const isSentryEnabled = (): boolean => {
  return import.meta.env.VITE_ENABLE_SENTRY === 'true' && !!frontendConfig.sentry?.dsn;
};

/**
 * 安全和隐私配置（包含 RegExp，无法序列化到 JSON，保留在代码中）
 */
const SENTRY_SECURITY_CONFIG = {
  ignoreErrors: [
    // 浏览器扩展错误
    'Non-Error promise rejection captured',
    'ResizeObserver loop limit exceeded',
    // 网络错误
    'Network request failed',
    'Failed to fetch',
    // 脚本加载错误
    'Loading chunk',
    'Loading CSS chunk',
    // 其他常见的非关键错误
    'Script error',
    'UnhandledPromiseRejectionWarning',
  ] as (string | RegExp)[],
  denyUrls: [
    // 阻止来自浏览器扩展的错误
    /extensions\//i,
    /^chrome:\/\//i,
    /^chrome-extension:\/\//i,
    /^moz-extension:\/\//i,
  ] as (string | RegExp)[],
};

/**
 * Sentry配置接口
 */
export interface SentryConfig {
  /** Sentry DSN */
  dsn?: string;
  /** 环境名称 */
  environment?: string;
  /** 应用版本 */
  release?: string;
  /** 是否启用调试模式 */
  debug?: boolean;
  /** 跟踪采样率 (0-1) */
  tracesSampleRate?: number;
  /** 会话重放采样率 (0-1) */
  replaysSessionSampleRate?: number;
  /** 错误时重放采样率 (0-1) */
  replaysOnErrorSampleRate?: number;
  /** 是否发送默认PII信息 */
  sendDefaultPii?: boolean;
  /** 最大面包屑数量 */
  maxBreadcrumbs?: number;
  /** 是否启用会话重放 */
  enableReplay?: boolean;
  /** 是否启用用户反馈 */
  enableFeedback?: boolean;
  /** 是否启用性能监控 */
  enablePerformance?: boolean;
  /** 是否启用路由追踪 */
  enableRouterTracking?: boolean;
  /** 是否启用状态管理追踪 */
  enableStateTracking?: boolean;
  /** 忽略的错误 */
  ignoreErrors?: (string | RegExp)[];
  /** 允许的URLs */
  allowUrls?: (string | RegExp)[];
  /** 阻止的URLs */
  denyUrls?: (string | RegExp)[];
}

/**
 * 获取 Sentry 配置
 * 从前端配置系统读取可配置项，合并代码级安全配置
 */
export const getSentryConfig = (): Required<SentryConfig> => {
  const sentry = frontendConfig.sentry;
  return {
    dsn: sentry.dsn,
    environment: import.meta.env.MODE || 'development',
    release: sentry.release,
    debug: sentry.debug,
    tracesSampleRate: sentry.tracesSampleRate,
    replaysSessionSampleRate: sentry.replaysSessionSampleRate,
    replaysOnErrorSampleRate: sentry.replaysOnErrorSampleRate,
    enablePerformance: sentry.enablePerformance,
    enableReplay: sentry.enableReplay,
    enableFeedback: sentry.enableFeedback,
    enableRouterTracking: sentry.enableRouterTracking,
    enableStateTracking: sentry.enableStateTracking,
    sendDefaultPii: sentry.sendDefaultPii,
    maxBreadcrumbs: sentry.maxBreadcrumbs,
    ...SENTRY_SECURITY_CONFIG,
    allowUrls: [window.location.origin],
  };
};

/**
 * 获取当前环境的 Sentry 配置摘要
 */
export const getSentryConfigSummary = () => {
  const config = getSentryConfig();
  return {
    environment: config.environment,
    release: config.release,
    debug: config.debug,
    tracesSampleRate: config.tracesSampleRate,
    enabledFeatures: {
      performance: config.enablePerformance,
      replay: config.enableReplay,
      feedback: config.enableFeedback,
      routerTracking: config.enableRouterTracking,
      stateTracking: config.enableStateTracking,
    },
  };
};
