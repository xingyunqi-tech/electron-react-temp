/**
 * Preload 暴露给渲染进程的命名 API
 *
 * 设计原则 (Electron 官方 + VS Code 最佳实践):
 * - 暴露命名函数，不暴露原始 ipcRenderer
 * - 每个 IPC 通道对应一个语义化方法名
 * - IpcRendererEvent 在此层剥离，渲染进程不接触 Electron 内部对象
 */

import { ipcRenderer } from 'electron';
import { IPC } from '../shared/channels';
import type { IpcInvokeMap, IpcOnMap } from '../shared/types';

type InvokeChannel = keyof IpcInvokeMap;
type OnChannel = keyof IpcOnMap;

function createInvoker<C extends InvokeChannel>(channel: C) {
  return (...args: IpcInvokeMap[C]['args']): Promise<IpcInvokeMap[C]['return']> => ipcRenderer.invoke(channel, ...args);
}

export const electronAPI = {
  // ---- App ----
  getAppInfo: createInvoker(IPC.APP_GET_INFO),
  quit: () => ipcRenderer.send(IPC.APP_QUIT),
  relaunch: () => ipcRenderer.send(IPC.APP_RELAUNCH),

  // ---- Window ----
  minimize: () => ipcRenderer.send(IPC.WIN_MINIMIZE),
  maximize: () => ipcRenderer.send(IPC.WIN_MAXIMIZE),
  unmaximize: () => ipcRenderer.send(IPC.WIN_UNMAXIMIZE),
  close: () => ipcRenderer.send(IPC.WIN_CLOSE),
  isMaximized: createInvoker(IPC.WIN_IS_MAXIMIZED),
  setTitle: createInvoker(IPC.WIN_SET_TITLE),
  setSize: createInvoker(IPC.WIN_SET_SIZE),

  // ---- Dialog ----
  openFile: createInvoker(IPC.DIALOG_OPEN_FILE),
  saveFile: createInvoker(IPC.DIALOG_SAVE_FILE),
  messageBox: createInvoker(IPC.DIALOG_MESSAGE_BOX),

  // ---- Shell ----
  openExternal: createInvoker(IPC.SHELL_OPEN_EXTERNAL),
  openPath: createInvoker(IPC.SHELL_OPEN_PATH),
  showInFolder: createInvoker(IPC.SHELL_SHOW_IN_FOLDER),

  // ---- Store ----
  storeGet: createInvoker(IPC.STORE_GET),
  storeSet: createInvoker(IPC.STORE_SET),
  storeDelete: createInvoker(IPC.STORE_DELETE),

  // ---- Theme ----
  getTheme: createInvoker(IPC.THEME_GET),

  // ---- Update ----
  checkUpdate: createInvoker(IPC.UPDATE_CHECK),
  downloadUpdate: createInvoker(IPC.UPDATE_DOWNLOAD),
  installUpdate: createInvoker(IPC.UPDATE_INSTALL),

  // ---- Clipboard ----
  clipboardReadText: createInvoker(IPC.CLIPBOARD_READ_TEXT),
  clipboardWriteText: createInvoker(IPC.CLIPBOARD_WRITE_TEXT),

  // ---- Notification ----
  showNotification: createInvoker(IPC.NOTIFICATION_SHOW),

  // ---- Deep Link ----
  getDeepLinkUrl: createInvoker(IPC.DEEP_LINK_GET_URL),

  // ---- 主→渲染 事件监听 ----
  on<C extends OnChannel>(channel: C, listener: (...args: IpcOnMap[C]) => void) {
    const wrapped = (_e: Electron.IpcRendererEvent, ...args: unknown[]) => listener(...(args as IpcOnMap[C]));
    ipcRenderer.on(channel, wrapped);
    return () => {
      ipcRenderer.off(channel, wrapped);
    };
  },
};

export type ElectronAPI = typeof electronAPI;
