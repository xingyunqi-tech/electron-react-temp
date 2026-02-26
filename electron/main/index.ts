/**
 * Electron 主进程入口 — 启动编排器
 *
 * 职责仅限于按正确顺序初始化各模块:
 * 1. 生命周期 (单实例锁、平台事件)
 * 2. 安全策略 (CSP、导航拦截)
 * 3. IPC 注册 (在窗口创建前就位)
 * 4. 创建主窗口
 * 5. 可插拔服务 (菜单、托盘、更新)
 */

import { app, BrowserWindow, nativeTheme } from 'electron';
import log from 'electron-log';
import './env';
import { AppLifecycle } from './core/AppLifecycle';
import { WindowManager } from './core/WindowManager';
import { SecurityPolicy } from './core/SecurityPolicy';
import { registerAllIPC } from './ipc';
import { MenuService } from './services/MenuService';
import { TrayService } from './services/TrayService';
import { UpdaterService } from './services/UpdaterService';
import { IPC } from '../shared/channels';

// 配置日志
log.transports.file.level = 'info';
log.transports.console.level = app.isPackaged ? 'warn' : 'info';

// ---- 1. 生命周期 (必须在 app.whenReady 之前) ----
AppLifecycle.setup();

app.whenReady().then(() => {
  // ---- 2. 安全策略 ----
  SecurityPolicy.apply();

  // ---- 3. IPC 注册 (窗口创建前) ----
  registerAllIPC();

  // ---- 4. 创建主窗口 ----
  const wm = WindowManager.getInstance();
  const mainWindow = wm.createMainWindow();

  // ---- 5. 服务层 ----
  MenuService.setup();
  TrayService.setup(mainWindow);

  // 自动更新 (仅打包后生效，延迟启动)
  UpdaterService.setup(mainWindow);

  // ---- 6. macOS: 点击 Dock 图标重新打开窗口 (含服务重建) ----
  app.on('activate', () => {
    const win = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());
    if (win) {
      win.focus();
    } else {
      const newWin = wm.createMainWindow();
      MenuService.setup();
      TrayService.setup(newWin);
      UpdaterService.setup(newWin);
    }
  });

  // ---- 7. 系统深色模式同步 ----
  nativeTheme.on('updated', () => {
    wm.sendToAll(IPC.THEME_CHANGED, nativeTheme.shouldUseDarkColors);
  });

  log.info(`App started — v${app.getVersion()} [${process.platform}/${process.arch}]`);
});
