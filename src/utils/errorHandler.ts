/**
 * 全局错误处理器
 *
 * 职责：错误分类、消息提取、认证跳转、日志记录
 * 不负责 UI 提示 —— 是否弹出提示由调用方决定
 */

import type { AxiosError } from 'axios';

/**
 * 错误类型
 */
export enum ErrorType {
  /** 网络错误 */
  NETWORK = 'network',
  /** 请求配置错误 */
  REQUEST = 'request',
  /** 业务错误 */
  BUSINESS = 'business',
  /** 认证错误 */
  AUTH = 'auth',
  /** 权限错误 */
  PERMISSION = 'permission',
  /** 服务器错误 */
  SERVER = 'server',
  /** 未知错误 */
  UNKNOWN = 'unknown',
}

/**
 * 结构化错误信息
 */
export interface ErrorInfo {
  /** 错误类型 */
  type: ErrorType;
  /** 用户友好的错误消息 */
  message: string;
  /** 原始错误对象 */
  raw: unknown;
}

/**
 * 错误消息映射
 */
const ERROR_MESSAGES: Record<number, string> = {
  400: '请求参数错误',
  401: '未登录或登录已过期',
  403: '没有权限访问',
  404: '请求的资源不存在',
  408: '请求超时',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务暂时不可用',
  504: '网关超时',
};

/**
 * 判断错误类型
 */
export function detectErrorType(error: any): ErrorType {
  if (!error) return ErrorType.UNKNOWN;

  // Axios 错误
  if (error.isAxiosError) {
    const axiosError = error as AxiosError;

    if (!axiosError.response) {
      return ErrorType.NETWORK;
    }

    const status = axiosError.response.status;

    if (status === 401) return ErrorType.AUTH;
    if (status === 403) return ErrorType.PERMISSION;
    if (status >= 500) return ErrorType.SERVER;
    if (status >= 400) return ErrorType.BUSINESS;
  }

  // 业务错误（有 code 字段）
  if (error.code !== undefined) {
    return ErrorType.BUSINESS;
  }

  return ErrorType.UNKNOWN;
}

/**
 * 获取用户友好的错误消息
 */
export function getErrorMessage(error: any): string {
  // Axios 错误（优先处理，避免返回技术性 error.message）
  if (error.isAxiosError) {
    const axiosError = error as AxiosError;

    // 网络错误
    if (!axiosError.response) {
      return '网络连接失败，请检查网络';
    }

    const status = axiosError.response.status;
    const data = axiosError.response.data as any;

    // 服务器返回的错误消息
    if (data?.message) return data.message;

    // 标准 HTTP 错误消息
    if (ERROR_MESSAGES[status]) {
      return ERROR_MESSAGES[status];
    }

    return `请求失败 (${status})`;
  }

  // 其他错误的自定义消息
  if (error.message) return error.message;

  // 默认消息
  return '操作失败，请稍后重试';
}

/**
 * 处理错误：分类 + 日志 + 认证跳转
 *
 * 不弹出 UI 提示。调用方根据返回的 ErrorInfo 自行决定是否展示。
 *
 * @example
 * ```typescript
 * try {
 *   await someApiCall();
 * } catch (error) {
 *   const info = handleError(error);
 *   // 调用方决定是否弹提示
 *   message.error(info.message);
 * }
 * ```
 */
export function handleError(error: any): ErrorInfo {
  const type = detectErrorType(error);
  const msg = getErrorMessage(error);

  console.error(`[ErrorHandler] ${type}:`, msg, error);

  // 认证错误：自动跳转登录页
  if (type === ErrorType.AUTH) {
    handleAuthError();
  }

  return { type, message: msg, raw: error };
}

/**
 * 认证错误处理回调（可通过 setAuthErrorHandler 自定义）
 */
let authErrorCallback: (() => void) | null = null;

/**
 * 设置自定义认证错误处理器
 * 用于在应用初始化时注入 store.dispatch(logout()) 等逻辑
 */
export function setAuthErrorHandler(handler: () => void) {
  authErrorCallback = handler;
}

/**
 * 处理认证错误
 */
function handleAuthError() {
  if (authErrorCallback) {
    authErrorCallback();
    return;
  }

  // 回退：直接清除 token 并跳转登录页
  localStorage.removeItem('token');
  setTimeout(() => {
    window.location.href = '/login';
  }, 1500);
}

/**
 * 处理请求配置错误
 * 专门用于请求拦截器中的错误处理
 */
export function handleRequestError(error: any): never {
  let errorMessage = '请求配置错误';
  let errorType = ErrorType.REQUEST;

  if (error.code === 'ECONNABORTED') {
    errorMessage = '请求超时，请检查网络连接';
    errorType = ErrorType.NETWORK;
  } else if (error.code === 'ERR_NETWORK') {
    errorMessage = '网络错误，请检查网络连接';
    errorType = ErrorType.NETWORK;
  } else if (error.code === 'ERR_CANCELED') {
    errorMessage = '请求已取消';
    errorType = ErrorType.REQUEST;
  } else if (error.message) {
    errorMessage = error.message;
  }

  console.error('[Request Error]:', errorMessage, error);

  const enriched = new Error(errorMessage) as Error & { errorType: ErrorType };
  enriched.errorType = errorType;
  throw enriched;
}

/**
 * 全局错误处理器（用于未捕获的错误）
 */
export function setupGlobalErrorHandler() {
  window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason);
    if (import.meta.env.PROD) event.preventDefault();
  });

  window.addEventListener('error', event => {
    console.error('Unhandled error:', event.error);
    if (import.meta.env.PROD) event.preventDefault();
  });
}
