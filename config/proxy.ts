import { hostDict, protocol } from './host';

/**
 * 开发环境代理
 */
export const proxy = {
  '/localService': {
    target: `${protocol}//${hostDict.LOCAL_SERVICE}`,
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/localService\//, ''),
  },
  '/api': {
    target: `${protocol}//${hostDict.API_SERVICE}`,
    changeOrigin: true,
  },
};
