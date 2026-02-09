/**
 * 请求唯一键生成工具
 * 统一管理 HttpClient 和 Mutator 的请求键生成逻辑
 */

import type { AxiosRequestConfig } from 'axios';

/**
 * 简单哈希函数
 * 用于对大数据生成固定长度的哈希值，提升性能
 */
function hashCode(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

// 性能优化：对于超过此长度的字符串，使用哈希而非完整序列化
const MAX_STRING_LENGTH = 1000;

/**
 * 生成请求的唯一键
 *
 * 基于以下因素：
 * - HTTP 方法（GET/POST/PUT/DELETE 等）
 * - 请求 URL
 * - 查询参数 params
 * - 请求体 data
 *
 * 对于大数据使用哈希优化性能
 *
 * @param config Axios 请求配置
 * @returns 请求唯一键
 */
export function generateRequestKey(config: AxiosRequestConfig): string {
  const { method = 'get', url, params, data } = config;

  if (!url) {
    throw new Error('[generateRequestKey] URL is required');
  }

  // 处理 params
  let paramsStr = '';
  if (params) {
    const serialized = JSON.stringify(params);
    paramsStr = serialized.length > MAX_STRING_LENGTH ? hashCode(serialized) : serialized;
  }

  // 处理 data
  let dataStr = '';
  if (data) {
    // 跳过 FormData（文件上传等场景，不参与去重键生成）
    if (data instanceof FormData) {
      dataStr = '[FormData]';
    } else {
      const serialized = JSON.stringify(data);
      dataStr = serialized.length > MAX_STRING_LENGTH ? hashCode(serialized) : serialized;
    }
  }

  return `${method.toUpperCase()}-${url}-${paramsStr}-${dataStr}`;
}

/**
 * 生成简单的请求键（仅基于 method + url）
 * 适用于请求取消等场景，不需要考虑参数
 *
 * @param config Axios 请求配置
 * @returns 简单请求键
 */
export function generateSimpleRequestKey(config: AxiosRequestConfig): string {
  const { method = 'get', url } = config;

  if (!url) {
    throw new Error('[generateSimpleRequestKey] URL is required');
  }

  return `${method.toUpperCase()}-${url}`;
}
