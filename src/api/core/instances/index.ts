/**
 * HTTP 实例统一导出
 *
 * 本模块管理所有 HTTP 实例，不同场景使用不同配置
 */
import { defaultHttp } from './default';
import { downloadHttp } from './download';

export { defaultHttp } from './default';
export { downloadHttp } from './download';

export const instances = {
  default: defaultHttp,
  download: downloadHttp,
} as const;

export type InstanceType = keyof typeof instances;
