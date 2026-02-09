/**
 * API 核心模块统一导出
 *
 * 本模块包含所有核心基础设施：
 * - HttpClient 和多实例管理
 * - 拦截器（请求/响应）
 * - Orval mutator 适配器
 * - 请求去重管理
 */

// 导出 HttpClient 和所有实例
export { defaultHttp, downloadHttp, instances } from './instances';
export type { InstanceType } from './instances';

// 导出拦截器
export { requestInterceptor, requestErrorInterceptor } from './interceptors/request';
export { responseSuccessInterceptor, responseErrorInterceptor } from './interceptors/response';

// 导出类型
export type {
  ApiResponse,
  HttpClient,
  RequestInterceptor,
  RequestErrorInterceptor,
  ResponseInterceptor,
  ResponseErrorInterceptor,
} from './http';

// 导出 mutator 和请求去重
export { customMutator, clearPendingRequests } from './mutator';
export type { CustomAxiosRequestConfig } from './mutator';

// 导出请求键生成工具
export { generateRequestKey, generateSimpleRequestKey } from './utils/requestKey';
