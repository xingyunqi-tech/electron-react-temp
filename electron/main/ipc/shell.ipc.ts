/**
 * Shell IPC 处理器
 * 打开外部链接、文件路径、文件夹
 */

import { ipcMain, shell } from 'electron';
import path from 'node:path';
import { IPC } from '../../shared/channels';

const ALLOWED_PROTOCOLS = ['https:', 'http:', 'mailto:'];

/** 路径安全校验: 阻止 null 字节注入并规范化路径 */
function validateFilePath(filePath: string): string {
  if (filePath.includes('\0')) {
    throw new Error('Invalid file path: contains null bytes');
  }
  return path.resolve(filePath);
}

export function registerShellIPC() {
  ipcMain.handle(IPC.SHELL_OPEN_EXTERNAL, async (_event, url: string) => {
    const parsed = new URL(url);
    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
      throw new Error(`Protocol "${parsed.protocol}" is not allowed`);
    }
    await shell.openExternal(url);
  });

  ipcMain.handle(IPC.SHELL_OPEN_PATH, async (_event, filePath: string) => {
    const resolved = validateFilePath(filePath);
    const errorMessage = await shell.openPath(resolved);
    if (errorMessage) {
      throw new Error(errorMessage);
    }
  });

  ipcMain.handle(IPC.SHELL_SHOW_IN_FOLDER, (_event, filePath: string) => {
    const resolved = validateFilePath(filePath);
    shell.showItemInFolder(resolved);
  });
}
