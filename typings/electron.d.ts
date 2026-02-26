/**
 * Electron Preload API 全局类型声明
 *
 * 从 preload/api.ts 的实际导出派生类型 — 单一真实来源
 * 新增 IPC 方法时只需修改 preload/api.ts，此处自动同步
 */

import type { ElectronAPI as ElectronAPIType } from '../electron/preload/api';
import type { UpdateStatus, UpdateState } from '../electron/shared/types';

declare global {
  type ElectronAPI = ElectronAPIType;
  type ElectronUpdateStatus = UpdateStatus;
  type ElectronUpdateState = UpdateState;
}

export {};
