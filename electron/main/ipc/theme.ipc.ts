/**
 * 主题 IPC 处理器
 * 获取系统当前深色模式状态
 */

import { ipcMain, nativeTheme } from 'electron';
import { IPC } from '../../shared/channels';

export function registerThemeIPC() {
  ipcMain.handle(IPC.THEME_GET, (): boolean => {
    return nativeTheme.shouldUseDarkColors;
  });
}
