/**
 * API 响应状态码
 */
export const API_CODE = {
  /** 成功 */
  SUCCESS: 200,
} as const;

/**
 * 不同服务的代理前缀
 */
export const PROXY_URI = {
  LOCAL: '/localService',
} as const;

/**
 * 不同版本服务的基础 URI
 */
export const URI = {
  LOCAL_V1: `${PROXY_URI.LOCAL}/local/v1`,
};

/**
 * 默认语言
 */
export const DEFAULT_LOCALE = 'zh-CN';

/**
 * 默认主题
 */
export const DEFAULT_THEME_STYLE = 'light';
