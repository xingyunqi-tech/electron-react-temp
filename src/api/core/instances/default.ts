/**
 * 默认 HTTP 实例
 * 用于普通的 API 请求
 */

import { HttpClient } from '../http';
import { requestInterceptor, requestErrorInterceptor } from '../interceptors/request';
import { responseSuccessInterceptor, responseErrorInterceptor } from '../interceptors/response';

// 获取 baseURL 配置
const baseURL = window.location.origin;
// const baseURL = import.meta.env.VITE_BASEURL;

/**
 * 默认实例配置
 * - 超时时间：6 秒
 * - baseURL：从环境变量读取
 * - 自动注入 Token
 * - 统一错误处理
 */
export const defaultHttp = new HttpClient(
  {
    baseURL,
    timeout: 6000,
  },
  {
    requestInterceptor,
    requestErrorInterceptor,
    responseInterceptor: responseSuccessInterceptor,
    responseErrorInterceptor,
  },
);
