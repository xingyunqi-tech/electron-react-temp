/**
 * 系统通知 IPC 处理器
 * 发送桌面通知
 */

import { Notification, ipcMain } from 'electron';
import { IPC } from '../../shared/channels';
import type { AppNotificationOptions } from '../../shared/types';

export function registerNotificationIPC() {
  ipcMain.handle(IPC.NOTIFICATION_SHOW, (_event, options: AppNotificationOptions) => {
    if (!Notification.isSupported()) return;

    new Notification({
      title: options.title,
      body: options.body,
      silent: options.silent,
    }).show();
  });
}
