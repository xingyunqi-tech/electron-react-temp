/**
 * 系统托盘服务
 *
 * 功能:
 * - 最小化到托盘 (关闭窗口时隐藏到托盘而非退出)
 * - 右键托盘菜单 (显示/隐藏窗口、退出)
 * - 单击托盘图标显示/隐藏窗口
 * - 托盘图标 (使用应用图标)
 */

import { app, Menu, Tray, nativeImage, type BrowserWindow } from 'electron';
import path from 'node:path';
import log from 'electron-log';
import { VITE_PUBLIC } from '../env';

export class TrayService {
  private static tray: Tray | null = null;
  private static forceQuit = false;
  private static mainWindow: BrowserWindow | null = null;
  private static onBeforeQuit: (() => void) | null = null;
  private static onWindowClose: ((event: Electron.Event) => void) | null = null;

  /** 标记为强制退出 (跳过最小化到托盘) */
  static setForceQuit(value: boolean) {
    this.forceQuit = value;
  }

  static setup(mainWindow: BrowserWindow) {
    // 清理旧实例 (支持 macOS 窗口重建场景)
    this.destroy();
    this.mainWindow = mainWindow;

    // 加载托盘图标
    const iconPath = path.join(VITE_PUBLIC, 'favicon.ico');
    const icon = nativeImage.createFromPath(iconPath);

    if (icon.isEmpty()) {
      log.warn('[Tray] Icon not found at:', iconPath, '— skipping tray setup');
      return;
    }

    const trayIcon = icon.resize({ width: 16, height: 16 });

    this.tray = new Tray(trayIcon);
    this.tray.setToolTip(app.getName());

    // 右键菜单
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '显示窗口',
        click: () => {
          mainWindow.show();
          mainWindow.focus();
        },
      },
      { type: 'separator' },
      {
        label: '退出',
        click: () => {
          TrayService.forceQuit = true;
          app.quit();
        },
      },
    ]);

    this.tray.setContextMenu(contextMenu);

    // 单击托盘图标: 切换窗口显示/隐藏
    this.tray.on('click', () => {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    });

    // macOS: Cmd+Q 或 Dock 退出时标记为强制退出
    this.onBeforeQuit = () => {
      TrayService.forceQuit = true;
    };
    app.on('before-quit', this.onBeforeQuit);

    // 点击关闭按钮时隐藏到托盘，而非退出
    this.onWindowClose = event => {
      if (!TrayService.forceQuit) {
        event.preventDefault();
        mainWindow.hide();
      }
    };
    mainWindow.on('close', this.onWindowClose);
  }

  static destroy() {
    if (this.onBeforeQuit) {
      app.removeListener('before-quit', this.onBeforeQuit);
      this.onBeforeQuit = null;
    }
    if (this.mainWindow && this.onWindowClose) {
      this.mainWindow.removeListener('close', this.onWindowClose);
      this.onWindowClose = null;
    }
    if (this.tray) {
      this.tray.destroy();
      this.tray = null;
    }
    this.mainWindow = null;
    this.forceQuit = false;
  }
}
