/**
 * 自动更新 IPC 处理器
 * 配合 UpdaterService 使用，提供渲染进程主动触发更新的能力
 */

import { ipcMain } from 'electron';
import { IPC } from '../../shared/channels';
import { UpdaterService } from '../services/UpdaterService';

export function registerUpdateIPC() {
  ipcMain.handle(IPC.UPDATE_CHECK, async () => {
    return UpdaterService.getInstance().checkForUpdates();
  });

  ipcMain.handle(IPC.UPDATE_DOWNLOAD, async () => {
    return UpdaterService.getInstance().downloadUpdate();
  });

  ipcMain.handle(IPC.UPDATE_INSTALL, () => {
    UpdaterService.getInstance().installUpdate();
  });
}
