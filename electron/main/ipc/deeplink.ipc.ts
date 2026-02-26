/**
 * 深度链接 IPC 处理器
 * 提供渲染进程查询初始深度链接 URL 的能力
 */

import { ipcMain } from 'electron';
import { IPC } from '../../shared/channels';
import { AppLifecycle } from '../core/AppLifecycle';

export function registerDeepLinkIPC() {
  ipcMain.handle(IPC.DEEP_LINK_GET_URL, () => {
    return AppLifecycle.getPendingDeepLinkUrl();
  });
}
