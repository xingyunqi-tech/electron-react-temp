/**
 * 响应拦截器配置
 *
 * 核心职责：
 * - 区分 HTTP 成功（200）和业务成功（code === 200）
 * - 业务错误 / HTTP 错误统一抛出，由调用方决定如何提示用户
 * - 认证错误（401）自动触发登录跳转
 */

import type { AxiosResponse } from 'axios';
import type { ApiResponse } from '../http';
import { handleError } from '@/utils/errorHandler';
import { API_CODE } from '@/constants/system';

/**
 * 响应成功拦截器
 *
 * HTTP 2xx 时触发，检查业务状态码：
 * - code === 200 → 返回 response.data（ApiResponse<T>）
 * - code !== 200 → 抛出带 code 的 Error，不弹 UI
 */
export function responseSuccessInterceptor(response: AxiosResponse<ApiResponse<any>>) {
  const { code, message } = response.data;

  if (code === API_CODE.SUCCESS) {
    return response.data;
  }

  // 业务错误：构造带 code 的 Error，抛给调用方处理
  const error = new Error(message || '请求失败') as Error & { code: number };
  error.code = code;
  throw error;
}

/**
 * 响应错误拦截器
 *
 * HTTP 4xx/5xx、网络错误、超时等触发。
 * 仅做分类 + 日志 + 401 跳转，不弹 UI 提示。
 */
export function responseErrorInterceptor(error: unknown): Promise<never> {
  handleError(error);
  return Promise.reject(error);
}
