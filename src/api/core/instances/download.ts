/**
 * 下载专用 HTTP 实例
 * 用于文件下载
 */

import type { AxiosResponse } from 'axios';
import { HttpClient } from '../http';
import { requestInterceptor, requestErrorInterceptor } from '../interceptors/request';
import { responseErrorInterceptor } from '../interceptors/response';

// 获取 baseURL 配置
const baseURL = window.location.origin;
// const baseURL = import.meta.env.VITE_BASEURL;

/**
 * 下载专用响应拦截器
 * 直接返回 blob 数据
 */
const downloadResponseInterceptor = (response: AxiosResponse<Blob>): Blob => {
  return response.data;
};

/**
 * 下载实例配置
 * - 超时时间：120 秒（大文件下载需要更长时间）
 * - baseURL：从环境变量读取
 * - responseType: blob
 * - 自动注入 Token
 */
export const downloadHttp = new HttpClient(
  {
    baseURL,
    timeout: 120000, // 120 秒
    responseType: 'blob',
  },
  {
    requestInterceptor,
    requestErrorInterceptor,
    responseInterceptor: downloadResponseInterceptor,
    responseErrorInterceptor,
  },
);
