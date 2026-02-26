/**
 * 原生对话框 IPC 处理器
 * 文件打开/保存选择器、消息弹窗
 */

import { BrowserWindow, dialog, ipcMain } from 'electron';
import { IPC } from '../../shared/channels';
import type { OpenFileOptions, SaveFileOptions, MessageBoxOptions } from '../../shared/types';

export function registerDialogIPC() {
  ipcMain.handle(IPC.DIALOG_OPEN_FILE, async (event, options?: OpenFileOptions): Promise<string[] | null> => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return null;

    const properties: Electron.OpenDialogOptions['properties'] = options?.directory ? ['openDirectory'] : ['openFile'];

    if (options?.multiSelections) properties.push('multiSelections');

    const result = await dialog.showOpenDialog(win, {
      title: options?.title,
      defaultPath: options?.defaultPath,
      filters: options?.filters,
      properties,
    });

    return result.canceled ? null : result.filePaths;
  });

  ipcMain.handle(IPC.DIALOG_SAVE_FILE, async (event, options?: SaveFileOptions): Promise<string | null> => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return null;

    const result = await dialog.showSaveDialog(win, {
      title: options?.title,
      defaultPath: options?.defaultPath,
      filters: options?.filters,
    });

    return result.canceled ? null : (result.filePath ?? null);
  });

  ipcMain.handle(IPC.DIALOG_MESSAGE_BOX, async (event, options: MessageBoxOptions): Promise<number> => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return -1;

    const result = await dialog.showMessageBox(win, {
      type: options.type ?? 'info',
      title: options.title,
      message: options.message,
      detail: options.detail,
      buttons: options.buttons ?? ['OK'],
      defaultId: options.defaultId ?? 0,
    });

    return result.response;
  });
}
