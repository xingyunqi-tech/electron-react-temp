/**
 * 请求拦截器配置
 *
 * 本文件包含：
 * 1. requestInterceptor - 请求发送前的处理（添加 Token、自定义 Headers 等）
 * 2. requestErrorInterceptor - 请求配置错误的处理
 */

import type { InternalAxiosRequestConfig } from 'axios';
import storage from '@/plugins/storage';
import { handleRequestError } from '@/utils/errorHandler';

/**
 * 请求拦截器
 *
 * 执行时机：
 * - 每个请求发送到服务器之前
 * - 在 Axios 内部序列化请求数据之前
 *
 * 功能：
 * 1. 自动添加 Authorization Token（从 localStorage 读取）
 * 2. 可扩展：添加其他通用 Headers（如设备信息、语言等）
 * 3. 可扩展：请求参数加密、签名等
 *
 * 错误处理：
 * - Token 读取失败不会阻断请求，仅记录错误日志
 * - 确保后端能够正确处理无 Token 的请求（返回 401）
 *
 * @param config - Axios 内部请求配置对象
 * @returns 修改后的请求配置
 *
 * @example
 * // 请求前自动添加 Token
 * // 原始请求: GET /api/users
 * // 拦截后: GET /api/users (Header: Authorization: Bearer xxx)
 */
export function requestInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  try {
    // 从 localStorage 读取 Token
    const token = storage('localStorage').get('token');
    if (token) {
      // 添加到请求头，使用 Bearer 认证方案
      // 格式：Authorization: Bearer <token>
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    // 如果获取 token 失败（如 localStorage 不可用），记录错误但不影响请求
    // 让请求继续发送，由后端返回 401 错误，前端统一处理
    console.error('[RequestInterceptor] Failed to get token from storage:', error);
  }

  return config;
}

/**
 * 请求错误拦截器
 *
 * 执行时机：
 * - 请求配置阶段发生错误时（较少见）
 * - 如配置对象格式错误、URL 格式错误等
 *
 * 处理逻辑：
 * - 使用全局错误处理器 handleRequestError 统一处理
 * - 格式化错误信息、记录日志、显示用户提示
 *
 * 注意：
 * - 这里的 error 不是网络错误或服务器错误
 * - 网络错误和服务器错误由响应拦截器处理
 *
 * @param error - 请求配置错误对象
 * @returns Promise.reject - 拒绝的 Promise
 */
export function requestErrorInterceptor(error: unknown): Promise<never> {
  return Promise.reject(handleRequestError(error));
}
