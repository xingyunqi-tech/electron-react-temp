/**
 * Window 操作 IPC 处理器
 * 最小化、最大化、关闭、设置标题/尺寸
 */

import { BrowserWindow, ipcMain } from 'electron';
import { IPC } from '../../shared/channels';

function getWinFromEvent(event: Electron.IpcMainInvokeEvent | Electron.IpcMainEvent): BrowserWindow | null {
  return BrowserWindow.fromWebContents(event.sender);
}

export function registerWindowIPC() {
  ipcMain.on(IPC.WIN_MINIMIZE, event => {
    getWinFromEvent(event)?.minimize();
  });

  ipcMain.on(IPC.WIN_MAXIMIZE, event => {
    getWinFromEvent(event)?.maximize();
  });

  ipcMain.on(IPC.WIN_UNMAXIMIZE, event => {
    getWinFromEvent(event)?.unmaximize();
  });

  ipcMain.on(IPC.WIN_CLOSE, event => {
    getWinFromEvent(event)?.close();
  });

  ipcMain.handle(IPC.WIN_IS_MAXIMIZED, (event): boolean => {
    return getWinFromEvent(event)?.isMaximized() ?? false;
  });

  ipcMain.handle(IPC.WIN_SET_TITLE, (event, title: string) => {
    getWinFromEvent(event)?.setTitle(title);
  });

  ipcMain.handle(IPC.WIN_SET_SIZE, (event, width: number, height: number) => {
    getWinFromEvent(event)?.setSize(width, height);
  });
}
