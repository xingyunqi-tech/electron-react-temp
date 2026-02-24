/**
 * 全局错误处理器
 *
 * 统一处理应用中的各类错误，提供用户友好的错误提示
 */

import { message, notification } from '@/components/StaticFunction';
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
 * 错误配置
 */
interface ErrorConfig {
  /** 是否显示错误提示 */
  showMessage?: boolean;
  /** 错误类型 */
  type?: ErrorType;
  /** 自定义错误消息 */
  message?: string;
  /** 是否使用通知而非消息 */
  useNotification?: boolean;
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
function detectErrorType(error: any): ErrorType {
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
 * 获取错误消息
 */
function getErrorMessage(error: any): string {
  // 自定义消息
  if (error.message) return error.message;

  // Axios 错误
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

  // 默认消息
  return '操作失败，请稍后重试';
}

/**
 * 显示错误消息
 */
function showError(msg: string, type: ErrorType, useNotification = false) {
  if (useNotification) {
    notification.error({
      message: '错误',
      description: msg,
      duration: 5,
    });
  } else {
    message.error({ content: msg, duration: 3 });
  }

  // 记录错误日志
  console.error(`[ErrorHandler] ${type}:`, msg);
}

/**
 * 处理错误
 *
 * @param error 错误对象
 * @param config 错误配置
 * @returns 错误类型
 *
 * @example
 * ```typescript
 * try {
 *   await someApiCall();
 * } catch (error) {
 *   handleError(error);
 * }
 * ```
 */
export function handleError(error: any, config: ErrorConfig = {}): ErrorType {
  const { showMessage = true, type: customType, message: customMessage, useNotification = false } = config;

  const errorType = customType || detectErrorType(error);
  const errorMessage = customMessage || getErrorMessage(error);

  // 是否显示错误提示
  if (showMessage) {
    // 服务器错误使用通知，其他使用消息
    const shouldUseNotification = useNotification || errorType === ErrorType.SERVER;
    showError(errorMessage, errorType, shouldUseNotification);
  }

  // 特殊处理：认证错误
  if (errorType === ErrorType.AUTH) {
    handleAuthError();
  }

  return errorType;
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
 * 静默处理错误（不显示提示）
 */
export function handleErrorSilently(error: any): ErrorType {
  return handleError(error, { showMessage: false });
}

/**
 * 创建错误处理装饰器
 * 用于包装函数，自动处理错误
 */
export function withErrorHandler<T extends (...args: any[]) => any>(
  fn: T,
  config?: ErrorConfig,
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, config);
      throw error;
    }
  };
}

/**
 * 处理请求配置错误
 * 专门用于请求拦截器中的错误处理
 */
export function handleRequestError(error: any): never {
  let errorMessage = '请求配置错误';
  let errorType = ErrorType.REQUEST;

  // 请求超时
  if (error.code === 'ECONNABORTED') {
    errorMessage = '请求超时，请检查网络连接';
    errorType = ErrorType.NETWORK;
  }
  // 网络错误
  else if (error.code === 'ERR_NETWORK') {
    errorMessage = '网络错误，请检查网络连接';
    errorType = ErrorType.NETWORK;
  }
  // 取消请求
  else if (error.code === 'ERR_CANCELED') {
    errorMessage = '请求已取消';
    errorType = ErrorType.REQUEST;
  }
  // 其他错误
  else if (error.message) {
    errorMessage = error.message;
  }

  console.error('[Request Error]:', errorMessage, error);

  // 网络错误需要显示提示，配置错误通常是代码问题不需要显示
  const showMessage = errorType === ErrorType.NETWORK;

  handleError(new Error(errorMessage), {
    type: errorType,
    showMessage,
  });

  throw new Error(errorMessage);
}

/**
 * 全局错误处理器（用于未捕获的错误）
 */
export function setupGlobalErrorHandler() {
  // 捕获未处理的 Promise 错误
  window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason);
    handleError(event.reason, { useNotification: true });
    event.preventDefault();
  });

  // 捕获未处理的 JS 错误
  window.addEventListener('error', event => {
    console.error('Unhandled error:', event.error);
    handleError(event.error, { useNotification: true });
    event.preventDefault();
  });
}
