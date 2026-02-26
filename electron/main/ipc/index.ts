/**
 * IPC 统一注册入口
 * 在 app.whenReady() 后、窗口创建前调用
 */

import { registerAppIPC } from './app.ipc';
import { registerWindowIPC } from './window.ipc';
import { registerDialogIPC } from './dialog.ipc';
import { registerShellIPC } from './shell.ipc';
import { registerStoreIPC } from './store.ipc';
import { registerThemeIPC } from './theme.ipc';
import { registerUpdateIPC } from './update.ipc';
import { registerClipboardIPC } from './clipboard.ipc';
import { registerNotificationIPC } from './notification.ipc';
import { registerDeepLinkIPC } from './deeplink.ipc';

export function registerAllIPC() {
  registerAppIPC();
  registerWindowIPC();
  registerDialogIPC();
  registerShellIPC();
  registerStoreIPC();
  registerThemeIPC();
  registerUpdateIPC();
  registerClipboardIPC();
  registerNotificationIPC();
  registerDeepLinkIPC();
}
