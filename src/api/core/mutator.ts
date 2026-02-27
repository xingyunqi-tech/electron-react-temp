import type { AxiosRequestConfig } from 'axios';
import { instances } from './instances';
import type { InstanceType } from './instances';
import type { ApiResponse } from './http';
import { generateRequestKey } from './utils/requestKey';

/**
 * 扩展的请求配置
 * 支持指定使用哪个实例和请求去重配置
 */
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  /** 指定使用的实例名称 */
  instance?: InstanceType;
  /** 是否禁用请求去重（默认启用） */
  disableDedup?: boolean;
}

/**
 * 提取响应对象中的 data 字段类型
 * - 如果 T 是 ApiResponse<R>，则返回 R
 * - 如果 T 有 data 属性，则返回 data 的类型
 * - 否则返回 T
 */
export type ExtractResult<T> = T extends ApiResponse<infer R> ? R : T extends { data?: infer D } ? D : T;

/**
 * 请求去重管理器
 * 防止短时间内发起相同的请求
 */
class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<unknown>>();

  /**
   * 检查是否有相同请求正在进行
   */
  has(config: AxiosRequestConfig): boolean {
    try {
      const key = generateRequestKey(config);
      return this.pendingRequests.has(key);
    } catch {
      return false;
    }
  }

  /**
   * 获取正在进行的请求
   */
  get(config: AxiosRequestConfig): Promise<unknown> | undefined {
    try {
      const key = generateRequestKey(config);
      return this.pendingRequests.get(key);
    } catch {
      return undefined;
    }
  }

  /**
   * 添加请求到队列
   */
  set(config: AxiosRequestConfig, promise: Promise<unknown>): void {
    try {
      const key = generateRequestKey(config);
      this.pendingRequests.set(key, promise);

      // 请求完成后清理
      promise.finally(() => {
        this.pendingRequests.delete(key);
      });
    } catch {
      // 如果生成 key 失败，直接返回，不添加到去重队列
    }
  }

  /**
   * 清空所有请求
   */
  clear(): void {
    this.pendingRequests.clear();
  }
}

// 创建全局去重管理器
const deduplicator = new RequestDeduplicator();

/**
 * Orval 自定义 Mutator
 *
 * 作用：
 * 1. 让 Orval 生成的代码使用我们自定义的 http 实例
 * 2. 支持多实例切换（default/upload/external/download）
 * 3. 确保所有请求都经过对应实例的拦截器
 * 4. 统一响应格式，自动提取 data 字段
 * 5. 请求去重，防止重复提交
 *
 * 类型说明：
 * - Orval 生成的函数指定 T = ApiResponse<Data>（如 PostAuthLogin200）
 * - mutator 自动提取 data 字段并返回 Data 类型（如 LoginResponse）
 * - 通过 ExtractResult<T> 类型工具实现类型转换
 *
 * @example
 * // 使用默认实例
 * customMutator<PostAuthLogin200>({ method: 'post', url: '/auth/login' })
 * // 返回类型：LoginResponse（自动提取 data）
 *
 * // 使用上传实例
 * customMutator({ method: 'post', url: '/upload', data: formData, instance: 'upload' })
 *
 * // 禁用请求去重
 * customMutator({ method: 'post', url: '/api/data', data, disableDedup: true })
 */
export const customMutator = async <T>(config: CustomAxiosRequestConfig): Promise<ExtractResult<T>> => {
  const {
    method = 'get',
    url,
    data,
    params,
    instance: instanceName = 'default',
    disableDedup = false,
    ...restConfig
  } = config;

  const requestConfig: AxiosRequestConfig = {
    method,
    url,
    data,
    params,
    ...restConfig,
  };

  // 请求去重检查（默认启用，POST/PUT/PATCH/DELETE 请求，FormData 除外）
  const shouldDedup =
    !disableDedup && ['post', 'put', 'patch', 'delete'].includes(method.toLowerCase()) && !(data instanceof FormData);

  if (shouldDedup && deduplicator.has(requestConfig)) {
    if (import.meta.env.DEV) {
      console.log(`[RequestDedup] Duplicate request detected: ${method.toUpperCase()} ${url}`);
    }
    const existingRequest = deduplicator.get(requestConfig);
    if (existingRequest) {
      return existingRequest as Promise<ExtractResult<T>>;
    }
  }

  // 选择实例
  const httpInstance = instances[instanceName];

  if (!httpInstance) {
    throw new Error(`HTTP instance "${instanceName}" not found. Available: ${Object.keys(instances).join(', ')}`);
  }

  // 创建请求 Promise
  const requestPromise = (async () => {
    // 使用选定的实例发起请求
    // 会自动经过该实例配置的拦截器
    const response = await httpInstance.request<T>(method.toUpperCase() as import('axios').Method, url!, {
      data,
      params,
      ...restConfig,
    });

    // 返回 data 字段（适配 ApiResponse<T> 格式）
    // 注意：download 实例返回 Blob，不需要提取 data
    if (instanceName === 'download') {
      // download 实例返回的是 Blob/ArrayBuffer 等二进制数据
      return response as unknown as ExtractResult<T>;
    }

    // 默认实例返回 ApiResponse<T> 格式，提取 data 字段
    // T 是 ApiResponse<Data> 类型，ExtractResult<T> 提取出 Data 类型
    const responseData = (response as ApiResponse<any>).data;
    return responseData as ExtractResult<T>;
  })();

  // 添加到去重队列
  if (shouldDedup) {
    deduplicator.set(requestConfig, requestPromise);
  }

  return requestPromise;
};

/**
 * 清空所有待处理的请求（用于测试或特殊场景）
 */
export const clearPendingRequests = () => {
  deduplicator.clear();
};

export default customMutator;
