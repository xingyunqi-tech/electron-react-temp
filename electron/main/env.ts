/**
 * 主进程环境变量与路径常量
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 构建产物目录结构:
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer

export const APP_ROOT = path.join(__dirname, '../..');
export const MAIN_DIST = path.join(APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(APP_ROOT, 'dist');
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL ?? '';
export const VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(APP_ROOT, 'public') : RENDERER_DIST;

// 深度链接协议名 — SSoT，electron-builder.json5 中的 schemes 必须与此一致
export const APP_PROTOCOL = 'yourappname';

// 同步到 process.env (兼容旧代码)
process.env.APP_ROOT = APP_ROOT;
process.env.VITE_PUBLIC = VITE_PUBLIC;
