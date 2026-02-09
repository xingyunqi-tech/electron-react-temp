import Axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type Method,
  type AxiosError,
} from 'axios';
import { generateSimpleRequestKey } from './utils/requestKey';

// 基础配置
const defaultConfig: AxiosRequestConfig = {
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
};

/**
 * API响应通用接口
 */
export interface ApiResponse<T = any> {
  /** 响应码，200表示成功 */
  code: number;
  /** 响应数据 */
  data?: T;
  /** 响应消息 */
  message: string;
  /** 响应时间戳 */
  timestamp?: number;
}

// 重试配置
export interface RetryConfig {
  retries?: number; // 重试次数
  retryDelay?: number; // 重试延迟（毫秒）
  retryCondition?: (error: AxiosError) => boolean; // 重试条件
}

// 拦截器类型定义
export type RequestInterceptor = (
  config: InternalAxiosRequestConfig,
) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
export type RequestErrorInterceptor = (error: unknown) => Promise<never>;
export type ResponseInterceptor = (response: AxiosResponse<any>) => any;
export type ResponseErrorInterceptor = (error: unknown) => Promise<never>;

// 拦截器配置类型（支持单个或数组）
interface InterceptorsConfig {
  requestInterceptor?: RequestInterceptor | RequestInterceptor[];
  requestErrorInterceptor?: RequestErrorInterceptor | RequestErrorInterceptor[];
  responseInterceptor?: ResponseInterceptor | ResponseInterceptor[];
  responseErrorInterceptor?: ResponseErrorInterceptor | ResponseErrorInterceptor[];
}

// 请求唯一键
type RequestKey = string | symbol;

/**
 * 增强型 HTTP 客户端，基于 Axios 封装
 * 支持拦截器配置、请求取消、多实例管理等功能
 */
export class HttpClient {
  private instance: AxiosInstance;
  private requestInterceptorIds: number[] = [];
  private responseInterceptorIds: number[] = [];
  private abortControllers: Map<RequestKey, AbortController> = new Map();

  /**
   * 创建 HTTP 客户端实例
   * @param customConfig 自定义 Axios 配置
   * @param interceptors 自定义拦截器配置
   */
  constructor(customConfig?: AxiosRequestConfig, interceptors?: InterceptorsConfig) {
    this.instance = Axios.create({ ...defaultConfig, ...customConfig });
    this.initInterceptors(interceptors);
  }

  /** 初始化拦截器 */
  private initInterceptors(interceptors?: InterceptorsConfig): void {
    this.initRequestInterceptor(interceptors?.requestInterceptor, interceptors?.requestErrorInterceptor);
    this.initResponseInterceptor(interceptors?.responseInterceptor, interceptors?.responseErrorInterceptor);
  }

  /** 初始化请求拦截器（支持多个） */
  private initRequestInterceptor(
    customInterceptor?: InterceptorsConfig['requestInterceptor'],
    customErrorInterceptor?: InterceptorsConfig['requestErrorInterceptor'],
  ): void {
    // 转换为数组
    const interceptors = Array.isArray(customInterceptor)
      ? customInterceptor
      : customInterceptor
        ? [customInterceptor]
        : [];
    const errorInterceptors = Array.isArray(customErrorInterceptor)
      ? customErrorInterceptor
      : customErrorInterceptor
        ? [customErrorInterceptor]
        : [];

    // 注册所有请求拦截器
    interceptors.forEach((interceptor, index) => {
      const errorInterceptor = errorInterceptors[index] || errorInterceptors[0];
      const id = this.instance.interceptors.request.use(interceptor, errorInterceptor);
      this.requestInterceptorIds.push(id);
    });
  }

  /**
   * 初始化响应拦截器（支持多个）
   *
   * 处理逻辑：
   * 1. 默认拦截器：提取 response.data
   * 2. 清理 AbortController：避免内存泄漏
   * 3. 多拦截器链式执行：第一个拦截器负责清理，其他拦截器按顺序执行
   *
   * @param customInterceptor - 自定义响应拦截器（可选，支持单个或数组）
   * @param customErrorInterceptor - 自定义错误拦截器（可选，支持单个或数组）
   */
  private initResponseInterceptor(
    customInterceptor?: InterceptorsConfig['responseInterceptor'],
    customErrorInterceptor?: InterceptorsConfig['responseErrorInterceptor'],
  ): void {
    // 默认响应拦截器：提取 response.data
    const defaultResponseInterceptor = <T = any>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> => {
      return response.data;
    };

    /**
     * 清理 AbortController 的辅助函数
     *
     * 核心逻辑：
     * 1. 请求成功或失败后，从 Map 中删除对应的 AbortController
     * 2. 重试场景处理：通过 signal 匹配确保只删除当前请求的 controller
     *
     * 为什么需要 signal 匹配？
     * - 重试场景：request() 方法会在重试前删除旧的 controller (第376行)
     * - 如果不匹配 signal，可能会误删新请求的 controller
     *
     * 示例场景：
     * 1. 第一次请求失败，触发 cleanupErrorInterceptor
     * 2. request() 重试前删除旧 controller (第376行)
     * 3. request() 创建新 controller (第379行)
     * 4. 此时如果 cleanupErrorInterceptor 执行，必须通过 signal 匹配避免误删新 controller
     *
     * @param config - Axios 请求配置
     */
    const cleanupAbortController = (config: AxiosRequestConfig) => {
      const requestKey = this.getRequestKey(config);
      if (requestKey) {
        // 如果 config 中有 signal，只有当存储的 controller 的 signal 匹配时才删除
        // 这样可以避免在重试场景下误删新请求的 controller
        if (config.signal) {
          const storedController = this.abortControllers.get(requestKey);
          if (storedController && storedController.signal === config.signal) {
            this.abortControllers.delete(requestKey);
          }
        } else {
          // 如果没有 signal，则直接删除（兼容旧逻辑）
          this.abortControllers.delete(requestKey);
        }
      }
    };

    const cleanupErrorInterceptor = (error: AxiosError): Promise<never> => {
      if (error.config) {
        cleanupAbortController(error.config);
      }
      return Promise.reject(error);
    };

    // 转换为数组
    const interceptors = Array.isArray(customInterceptor)
      ? customInterceptor
      : customInterceptor
        ? [customInterceptor]
        : [];
    const errorInterceptors = Array.isArray(customErrorInterceptor)
      ? customErrorInterceptor
      : customErrorInterceptor
        ? [customErrorInterceptor]
        : [];

    // 如果没有自定义拦截器，注册默认拦截器
    if (interceptors.length === 0) {
      const id = this.instance.interceptors.response.use((response: AxiosResponse<ApiResponse<any>>): any => {
        cleanupAbortController(response.config);
        return defaultResponseInterceptor(response);
      }, cleanupErrorInterceptor);
      this.responseInterceptorIds.push(id);
      return;
    }

    // 注册所有响应拦截器（第一个拦截器组合清理和默认提取逻辑）
    interceptors.forEach((interceptor, index) => {
      const errorInterceptor = errorInterceptors[index] || errorInterceptors[0];

      // 第一个拦截器需要清理 AbortController
      if (index === 0) {
        const id = this.instance.interceptors.response.use(
          async (response: AxiosResponse<ApiResponse<any>>): Promise<any> => {
            cleanupAbortController(response.config);
            return await interceptor(response);
          },
          errorInterceptor
            ? async (error: AxiosError) => {
                await cleanupErrorInterceptor(error);
                return errorInterceptor(error);
              }
            : cleanupErrorInterceptor,
        );
        this.responseInterceptorIds.push(id);
      } else {
        const id = this.instance.interceptors.response.use(interceptor, errorInterceptor);
        this.responseInterceptorIds.push(id);
      }
    });
  }

  /** 生成请求唯一标识（用于请求取消） */
  private getRequestKey(config: AxiosRequestConfig): RequestKey | undefined {
    if (!config.url) return undefined;
    try {
      return generateSimpleRequestKey(config);
    } catch {
      return undefined;
    }
  }

  /**
   * 设置取消控制器 - 为请求添加 AbortController
   *
   * 功能：
   * 1. 为每个请求创建唯一的 AbortController
   * 2. 将 controller 存储到 Map，key 为请求唯一标识
   * 3. 将 controller.signal 添加到请求配置
   *
   * 使用场景：
   * - 用户主动取消请求（如离开页面、切换 Tab）
   * - 重复请求取消（如搜索框快速输入）
   * - 超时取消（配合 timeout 使用）
   *
   * 清理时机：
   * - 请求成功：响应拦截器自动清理（见 cleanupAbortController）
   * - 请求失败：错误拦截器自动清理
   * - 手动取消：cancelRequest/cancelAllRequests 方法
   *
   * @param config - Axios 请求配置
   * @param requestKey - 可选的自定义请求唯一键
   * @returns 添加了 signal 的请求配置
   */
  private setupAbortController(config: AxiosRequestConfig, requestKey?: RequestKey): AxiosRequestConfig {
    const key = requestKey || this.getRequestKey(config);
    if (!key) return config;

    const controller = new AbortController();
    this.abortControllers.set(key, controller);

    return {
      ...config,
      signal: controller.signal,
    };
  }

  /** 移除所有请求拦截器 */
  public removeRequestInterceptors(): void {
    this.requestInterceptorIds.forEach(id => {
      this.instance.interceptors.request.eject(id);
    });
    this.requestInterceptorIds = [];
  }

  /** 移除所有响应拦截器 */
  public removeResponseInterceptors(): void {
    this.responseInterceptorIds.forEach(id => {
      this.instance.interceptors.response.eject(id);
    });
    this.responseInterceptorIds = [];
  }

  /** 添加请求拦截器 */
  public addRequestInterceptor(interceptor: RequestInterceptor, errorInterceptor?: RequestErrorInterceptor): number {
    const id = this.instance.interceptors.request.use(interceptor, errorInterceptor);
    this.requestInterceptorIds.push(id);
    return id;
  }

  /** 添加响应拦截器 */
  public addResponseInterceptor(interceptor: ResponseInterceptor, errorInterceptor?: ResponseErrorInterceptor): number {
    const id = this.instance.interceptors.response.use(interceptor, errorInterceptor);
    this.responseInterceptorIds.push(id);
    return id;
  }

  /** 移除特定请求拦截器 */
  public removeRequestInterceptor(id: number): void {
    this.instance.interceptors.request.eject(id);
    this.requestInterceptorIds = this.requestInterceptorIds.filter(i => i !== id);
  }

  /** 移除特定响应拦截器 */
  public removeResponseInterceptor(id: number): void {
    this.instance.interceptors.response.eject(id);
    this.responseInterceptorIds = this.responseInterceptorIds.filter(i => i !== id);
  }

  /** 动态设置请求拦截器（会移除所有现有的请求拦截器） */
  public setRequestInterceptors(
    customInterceptor?: InterceptorsConfig['requestInterceptor'],
    customErrorInterceptor?: InterceptorsConfig['requestErrorInterceptor'],
  ): void {
    this.removeRequestInterceptors();
    this.initRequestInterceptor(customInterceptor, customErrorInterceptor);
  }

  /** 动态设置响应拦截器（会移除所有现有的响应拦截器） */
  public setResponseInterceptors(
    customInterceptor?: InterceptorsConfig['responseInterceptor'],
    customErrorInterceptor?: InterceptorsConfig['responseErrorInterceptor'],
  ): void {
    this.removeResponseInterceptors();
    this.initResponseInterceptor(customInterceptor, customErrorInterceptor);
  }

  /** 获取 Axios 实例 */
  public getInstance(): AxiosInstance {
    return this.instance;
  }

  /**
   * 取消某个请求
   * @param key 请求唯一标识
   * @param message 取消原因
   * @returns 是否成功取消
   */
  public cancelRequest(key: RequestKey, message?: string): boolean {
    const controller = this.abortControllers.get(key);
    if (controller) {
      controller.abort(message || `取消请求: ${String(key)}`);
      this.abortControllers.delete(key);
      return true;
    }
    return false;
  }

  /**
   * 取消所有请求
   * @param message 取消原因
   */
  public cancelAllRequests(message?: string): void {
    this.abortControllers.forEach((controller, key) => {
      controller.abort(message || `取消所有请求: ${String(key)}`);
    });
    this.abortControllers.clear();
  }

  /**
   * 判断是否为取消错误
   * @param error 错误对象
   * @returns 是否为取消错误
   */
  public static isCancel(error: unknown): boolean {
    return Axios.isCancel(error);
  }

  /**
   * 睡眠函数
   * @param ms 毫秒数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 通用请求方法
   *
   * 核心功能：
   * 1. 支持请求重试（网络错误、超时、5xx错误）
   * 2. 支持请求取消（通过 AbortController）
   * 3. 支持自定义请求唯一键
   * 4. 自动清理 AbortController 避免内存泄漏
   *
   * 重试机制：
   * - 默认不重试（retries: 0）
   * - 可重试场景：网络错误、408/429/5xx 状态码
   * - 重试前删除旧 controller，避免误取消新请求
   * - 支持自定义重试条件和延迟
   *
   * 类型转换说明：
   * - Axios 原始返回：AxiosResponse<ApiResponse<T>>
   * - 响应拦截器提取：ApiResponse<T>
   * - TypeScript 无法追踪拦截器类型转换，需手动断言
   *
   * @param method - HTTP 请求方法
   * @param url - 请求地址
   * @param config - 请求配置，可选 requestKey（自定义唯一键）和 retry（重试配置）
   * @returns Promise<ApiResponse<T>> - 响应数据（已由拦截器提取 data）
   *
   * @example
   * // 基础请求
   * await httpClient.request('GET', '/api/users');
   *
   * // 带重试的请求
   * await httpClient.request('POST', '/api/data', {
   *   data: { id: 1 },
   *   retry: { retries: 3, retryDelay: 1000 }
   * });
   *
   * // 可取消的请求
   * const key = Symbol('my-request');
   * httpClient.request('GET', '/api/slow', { requestKey: key });
   * // 稍后取消
   * httpClient.cancelRequest(key);
   */
  public async request<T = any>(
    method: Method,
    url: string,
    config?: AxiosRequestConfig & { requestKey?: RequestKey; retry?: RetryConfig },
  ): Promise<ApiResponse<T>> {
    const { requestKey, retry, ...restConfig } = config || {};

    // ==================== 设置默认重试条件 ====================
    const defaultRetryCondition = (error: AxiosError) => {
      // 1. 没有响应（网络错误、超时等）应该重试
      if (!error.response) {
        return true;
      }

      const status = error.response.status;

      // 2. 可重试的 HTTP 状态码
      const retryableStatusCodes = [
        408, // Request Timeout
        429, // Too Many Requests
        500, // Internal Server Error
        502, // Bad Gateway
        503, // Service Unavailable
        504, // Gateway Timeout
      ];

      return retryableStatusCodes.includes(status);
    };

    // 合并重试配置
    const retryConfig = {
      retries: 0,
      retryDelay: 1000,
      retryCondition: defaultRetryCondition,
      ...retry,
    };

    let lastError: unknown;
    const key = requestKey || this.getRequestKey({ ...restConfig, method, url });

    // ==================== 重试循环 ====================
    for (let attempt = 0; attempt <= retryConfig.retries; attempt++) {
      try {
        // 重试前清除旧的 AbortController
        // 原因：避免旧请求的 controller.abort() 取消新的重试请求
        // 场景：第一次请求超时 → 用户取消 → 重试时会创建新 controller
        if (attempt > 0 && key) {
          this.abortControllers.delete(key);
        }

        // 设置 AbortController 以支持请求取消
        const requestConfig = this.setupAbortController({ ...restConfig, method, url }, requestKey);

        /* 在这里写通用请求前的业务逻辑 */
        // 示例: 记录请求日志
        // console.log(`[${method.toUpperCase()}] ${url}:`, restConfig);

        // 发起请求
        const response = await this.instance.request<ApiResponse<T>>(requestConfig);

        /* 在这里写通用请求后的业务逻辑 */
        // 示例: 记录响应日志
        // console.log(`[${method.toUpperCase()}] ${url} 响应:`, response);

        // ==================== 类型断言说明 ====================
        // Axios 返回类型：AxiosResponse<ApiResponse<T>>
        // 响应拦截器返回：ApiResponse<T> (见 initResponseInterceptor 第126行)
        // TypeScript 无法追踪拦截器的类型转换，需要手动断言
        return response as unknown as ApiResponse<T>;
      } catch (error) {
        lastError = error;

        // ==================== 判断是否需要重试 ====================
        // 1. 已是最后一次尝试 → 不重试
        // 2. 不满足重试条件 → 不重试
        // 3. 请求被手动取消 → 不重试
        if (
          attempt === retryConfig.retries ||
          !retryConfig.retryCondition(error as AxiosError) ||
          HttpClient.isCancel(error)
        ) {
          break;
        }

        // 延迟后重试
        if (retryConfig.retryDelay > 0) {
          await this.sleep(retryConfig.retryDelay);
        }
      }
    }

    // ==================== 错误处理 ====================
    // 由响应拦截器统一处理错误（显示消息、记录日志等）
    return Promise.reject(lastError);
  }

  /**
   * GET 请求
   * @param url 请求地址
   * @param config 请求配置
   * @returns 响应数据
   */
  public get<T = any>(
    url: string,
    config?: AxiosRequestConfig & { requestKey?: RequestKey; retry?: RetryConfig },
  ): Promise<ApiResponse<T>> {
    return this.request<T>('get', url, config);
  }

  /**
   * POST 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   * @returns 响应数据
   */
  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & { requestKey?: RequestKey; retry?: RetryConfig },
  ): Promise<ApiResponse<T>> {
    return this.request<T>('post', url, { ...config, data });
  }

  /**
   * PUT 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   * @returns 响应数据
   */
  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & { requestKey?: RequestKey; retry?: RetryConfig },
  ): Promise<ApiResponse<T>> {
    return this.request<T>('put', url, { ...config, data });
  }

  /**
   * DELETE 请求
   * @param url 请求地址
   * @param config 请求配置
   * @returns 响应数据
   */
  public delete<T = any>(
    url: string,
    config?: AxiosRequestConfig & { requestKey?: RequestKey; retry?: RetryConfig },
  ): Promise<ApiResponse<T>> {
    return this.request<T>('delete', url, config);
  }

  /**
   * PATCH 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   * @returns 响应数据
   */
  public patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & { requestKey?: RequestKey; retry?: RetryConfig },
  ): Promise<ApiResponse<T>> {
    return this.request<T>('patch', url, { ...config, data });
  }
}
