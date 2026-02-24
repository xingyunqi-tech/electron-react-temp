/**
 * 响应拦截器配置
 *
 * 本文件包含：
 * 1. responseSuccessInterceptor - 响应成功的处理（业务逻辑判断、数据提取）
 * 2. responseErrorInterceptor - 响应错误的处理（网络错误、HTTP 错误）
 *
 * 核心职责：
 * - 区分 HTTP 成功（200）和业务成功（code === 200）
 * - 统一处理业务错误和网络错误
 * - 自动显示错误提示，简化上层调用
 */

import type { AxiosResponse } from 'axios';
import type { ApiResponse } from '../http';
import { handleError, ErrorType } from '@/utils/errorHandler';
import { API_CODE } from '@/constants/system';

/**
 * 响应成功拦截器
 *
 * 执行时机：
 * - HTTP 状态码为 2xx（200、201、204 等）时触发
 * - 注意：HTTP 200 不代表业务成功，需要检查 response.data.code
 *
 * 处理逻辑：
 * 1. 检查业务状态码 code
 * 2. code === 200 → 业务成功，返回 response.data
 * 3. code !== 200 → 业务失败，抛出错误并显示提示
 *
 * 返回值：
 * - 成功：ApiResponse<T> (提取 response.data，移除外层 AxiosResponse)
 * - 失败：抛出 Error (会被 catch 捕获)
 *
 * 为什么要提取 response.data？
 * - 简化上层调用：不需要 response.data.data，直接使用 response.data
 * - 类型安全：ApiResponse<T> 清晰表示业务数据结构
 *
 * @param response - Axios 响应对象（HTTP 成功）
 * @returns ApiResponse<T> - 业务数据（已提取 response.data）
 * @throws Error - 业务错误（code !== 200）
 *
 * @example
 * // 假设后端返回
 * // HTTP 200, { code: 200, data: { id: 1 }, message: 'success' }
 * const result = await api.getUser(); // result = { code: 200, data: { id: 1 }, message: 'success' }
 *
 * // 假设后端返回业务错误
 * // HTTP 200, { code: 40001, data: null, message: '用户不存在' }
 * // 自动显示错误提示，并抛出异常
 */
export function responseSuccessInterceptor(response: AxiosResponse<ApiResponse<any>>) {
  const { code, message } = response.data;

  // ==================== 业务成功 ====================
  if (code === API_CODE.SUCCESS) {
    // 返回业务数据（提取 response.data）
    // 上层调用可直接访问 result.data，无需 result.data.data
    return response.data;
  }

  // ==================== 业务错误 ====================
  // 场景：HTTP 200，但 code !== 200（如用户不存在、权限不足等）
  const error = new Error(message || '请求失败') as Error & { code: number };
  error.code = code;

  // 使用全局错误处理器，自动显示错误提示（message.error）
  // ErrorType.BUSINESS 表示这是业务逻辑错误，不是网络错误
  handleError(error, {
    type: ErrorType.BUSINESS,
  });

  // 抛出错误，让上层 catch 捕获
  // 上层可以通过 try-catch 处理特定业务错误
  throw error;
}

/**
 * 响应错误拦截器
 *
 * 执行时机：
 * - HTTP 状态码为 4xx、5xx（400、401、404、500、502 等）
 * - 网络错误（Network Error）、超时错误（Timeout）
 * - 请求被取消（Abort）
 *
 * 处理逻辑：
 * 1. 使用全局错误处理器 handleError
 * 2. 自动识别错误类型（网络错误、HTTP 错误、超时等）
 * 3. 自动显示错误提示（message.error）
 * 4. 特殊处理：401 自动跳转登录页、403 跳转无权限页
 *
 * 常见错误类型：
 * - 401 Unauthorized → Token 过期，跳转登录页
 * - 403 Forbidden → 无权限，跳转 403 页面
 * - 404 Not Found → 接口不存在
 * - 500 Internal Server Error → 服务器错误
 * - Network Error → 网络断开
 * - Timeout → 请求超时
 *
 * @param error - Axios 错误对象或其他错误
 * @returns Promise.reject - 拒绝的 Promise
 *
 * @example
 * // 网络错误
 * // 自动显示：网络连接失败，请检查网络设置
 *
 * // 401 错误
 * // 自动显示：登录已过期，请重新登录
 * // 自动跳转：/login
 *
 * // 500 错误
 * // 自动显示：服务器错误，请稍后重试
 */
export function responseErrorInterceptor(error: unknown): Promise<never> {
  // 使用全局错误处理器，自动显示错误提示
  // handleError 会根据错误类型显示不同的提示信息
  // 并处理特殊状态码（401、403 等）
  handleError(error);

  return Promise.reject(error);
}
