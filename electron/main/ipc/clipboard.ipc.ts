/**
 * 剪贴板 IPC 处理器
 * 读写系统剪贴板文本
 */

import { clipboard, ipcMain } from 'electron';
import { IPC } from '../../shared/channels';

export function registerClipboardIPC() {
  ipcMain.handle(IPC.CLIPBOARD_READ_TEXT, () => {
    return clipboard.readText();
  });

  ipcMain.handle(IPC.CLIPBOARD_WRITE_TEXT, (_event, text: string) => {
    clipboard.writeText(text);
  });
}
