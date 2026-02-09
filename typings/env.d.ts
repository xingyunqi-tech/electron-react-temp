/// <reference types="vite/client" />

/**
 * 为 TypeScript 编译器提供环境变量相关的类型定义
 */
interface ImportMetaEnv {
  /**
   * sentry组织
   */
  readonly VITE_SENTRY_ORG: string;
  /**
   * sentry项目
   */
  readonly VITE_SENTRY_PROJECT: string;
  /**
   * sentry认证token
   */
  readonly VITE_SENTRY_AUTH_TOKEN: string;
  /**
   * api基础地址
   */
  readonly VITE_BASEURL: string;
  /**
   * 是否开启构建分析器
   */
  readonly VITE_ENABLE_ANALYZER: boolean;
  /**
   * 是否开启https
   */
  readonly VITE_ENABLE_HTTPS: boolean;
  /**
   * 是否上传到sentry
   */
  readonly VITE_UPLOAD_TO_SENTRY: boolean;
  /**
   * 是否启用 Web Vitals 性能监控
   */
  readonly VITE_ENABLE_WEB_VITALS: string;
  /**
   * 是否启用 Sentry 错误监控
   */
  readonly VITE_ENABLE_SENTRY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
