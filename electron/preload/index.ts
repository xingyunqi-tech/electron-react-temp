/**
 * Preload 入口
 *
 * 职责:
 * 1. 通过 contextBridge 暴露类型安全的命名 API (不暴露原始 ipcRenderer)
 * 2. 注入启动 Loading 动画
 */

import { contextBridge } from 'electron';
import { electronAPI } from './api';
import { setupLoading } from './loading';

// 暴露命名 API 到渲染进程 (window.electronAPI)
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// Loading 动画
setupLoading();
