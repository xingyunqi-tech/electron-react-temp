/**
 * IPC 通道请求/响应类型映射
 * 确保主进程 handler 和渲染进程调用之间的类型安全
 */

import type { IPC } from './channels';

// ---- invoke 通道类型映射 (渲染→主, Promise 返回) ----

export interface IpcInvokeMap {
  [IPC.APP_GET_INFO]: {
    args: [];
    return: AppInfo;
  };
  [IPC.WIN_IS_MAXIMIZED]: {
    args: [];
    return: boolean;
  };
  [IPC.WIN_SET_TITLE]: {
    args: [title: string];
    return: void;
  };
  [IPC.WIN_SET_SIZE]: {
    args: [width: number, height: number];
    return: void;
  };
  [IPC.DIALOG_OPEN_FILE]: {
    args: [options?: OpenFileOptions];
    return: string[] | null;
  };
  [IPC.DIALOG_SAVE_FILE]: {
    args: [options?: SaveFileOptions];
    return: string | null;
  };
  [IPC.DIALOG_MESSAGE_BOX]: {
    args: [options: MessageBoxOptions];
    return: number;
  };
  [IPC.SHELL_OPEN_EXTERNAL]: {
    args: [url: string];
    return: void;
  };
  [IPC.SHELL_OPEN_PATH]: {
    args: [filePath: string];
    return: void;
  };
  [IPC.SHELL_SHOW_IN_FOLDER]: {
    args: [filePath: string];
    return: void;
  };
  [IPC.STORE_GET]: {
    args: [key: string];
    return: unknown;
  };
  [IPC.STORE_SET]: {
    args: [key: string, value: unknown];
    return: void;
  };
  [IPC.STORE_DELETE]: {
    args: [key: string];
    return: void;
  };
  [IPC.THEME_GET]: {
    args: [];
    return: boolean;
  };
  [IPC.UPDATE_CHECK]: {
    args: [];
    return: UpdateCheckResult;
  };
  [IPC.UPDATE_DOWNLOAD]: {
    args: [];
    return: void;
  };
  [IPC.UPDATE_INSTALL]: {
    args: [];
    return: void;
  };
  [IPC.CLIPBOARD_READ_TEXT]: {
    args: [];
    return: string;
  };
  [IPC.CLIPBOARD_WRITE_TEXT]: {
    args: [text: string];
    return: void;
  };
  [IPC.NOTIFICATION_SHOW]: {
    args: [options: AppNotificationOptions];
    return: void;
  };
  [IPC.DEEP_LINK_GET_URL]: {
    args: [];
    return: string | null;
  };
}

// ---- send 通道类型映射 (渲染→主, 单向无返回) ----

export interface IpcSendMap {
  [IPC.APP_QUIT]: [];
  [IPC.APP_RELAUNCH]: [];
  [IPC.WIN_MINIMIZE]: [];
  [IPC.WIN_MAXIMIZE]: [];
  [IPC.WIN_UNMAXIMIZE]: [];
  [IPC.WIN_CLOSE]: [];
}

// ---- on 通道类型映射 (主→渲染, 推送) ----

export interface IpcOnMap {
  [IPC.WIN_MAXIMIZED_CHANGED]: [isMaximized: boolean];
  [IPC.THEME_CHANGED]: [shouldUseDarkColors: boolean];
  [IPC.UPDATE_STATUS]: [status: UpdateStatus];
  [IPC.DEEP_LINK_RECEIVED]: [url: string];
}

// ---- 业务类型 ----

export interface AppInfo {
  name: string;
  version: string;
  platform: NodeJS.Platform;
  arch: string;
  electronVersion: string;
}

export interface OpenFileOptions {
  title?: string;
  defaultPath?: string;
  filters?: FileFilter[];
  multiSelections?: boolean;
  directory?: boolean;
}

export interface SaveFileOptions {
  title?: string;
  defaultPath?: string;
  filters?: FileFilter[];
}

export interface FileFilter {
  name: string;
  extensions: string[];
}

export interface MessageBoxOptions {
  type?: 'none' | 'info' | 'error' | 'question' | 'warning';
  title?: string;
  message: string;
  detail?: string;
  buttons?: string[];
  defaultId?: number;
}

export interface UpdateCheckResult {
  updateAvailable: boolean;
  version?: string;
  releaseNotes?: string;
}

export type UpdateState = 'idle' | 'checking' | 'available' | 'not-available' | 'downloading' | 'downloaded' | 'error';

export interface UpdateStatus {
  state: UpdateState;
  version?: string;
  progress?: number;
  error?: string;
}

export interface AppNotificationOptions {
  title: string;
  body?: string;
  silent?: boolean;
}
