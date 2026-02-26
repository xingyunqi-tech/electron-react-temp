/**
 * App 级 IPC 处理器
 * 应用信息、退出、重启
 */

import { app, ipcMain } from 'electron';
import { IPC } from '../../shared/channels';
import type { AppInfo } from '../../shared/types';

export function registerAppIPC() {
  ipcMain.handle(
    IPC.APP_GET_INFO,
    (): AppInfo => ({
      name: app.getName(),
      version: app.getVersion(),
      platform: process.platform,
      arch: process.arch,
      electronVersion: process.versions.electron,
    }),
  );

  ipcMain.on(IPC.APP_QUIT, () => {
    app.quit();
  });

  ipcMain.on(IPC.APP_RELAUNCH, () => {
    app.relaunch();
    app.exit(0);
  });
}
