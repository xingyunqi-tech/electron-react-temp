/**
 * 窗口管理器 (单例)
 *
 * 职责:
 * - 统一安全的 BrowserWindow 创建 (所有窗口共享安全 webPreferences)
 * - 窗口状态持久化 (size/position/isMaximized 跨重启恢复)
 * - 多窗口注册表 (命名窗口，避免重复创建)
 * - 全局广播 (sendToAll)
 */

import { BrowserWindow, type BrowserWindowConstructorOptions } from 'electron';
import path from 'node:path';
import Store from 'electron-store';
import { MAIN_DIST, RENDERER_DIST, VITE_DEV_SERVER_URL, VITE_PUBLIC } from '../env';
import { SecurityPolicy } from './SecurityPolicy';
import { IPC } from '../../shared/channels';

interface WindowBounds {
  x?: number;
  y?: number;
  width: number;
  height: number;
  isMaximized?: boolean;
}

const boundsStore = new Store<Record<string, WindowBounds>>({
  name: 'window-state',
  defaults: {},
});

export class WindowManager {
  private static instance: WindowManager;
  private windows = new Map<string, BrowserWindow>();

  /** 安全选项 — 始终覆盖在 spread 最后，不允许被 options 覆盖 */
  private static readonly SECURITY_PREFS = {
    contextIsolation: true,
    nodeIntegration: false,
    sandbox: true,
  } as const;

  static getInstance(): WindowManager {
    if (!WindowManager.instance) {
      WindowManager.instance = new WindowManager();
    }
    return WindowManager.instance;
  }

  private getSavedBounds(name: string, defaults: { width: number; height: number }): WindowBounds {
    return boundsStore.get(name, defaults);
  }

  private saveBounds(name: string, win: BrowserWindow) {
    const isMaximized = win.isMaximized();
    if (!isMaximized) {
      const bounds = win.getBounds();
      boundsStore.set(name, { ...bounds, isMaximized });
    } else {
      const saved = boundsStore.get(name);
      boundsStore.set(name, { width: 1200, height: 800, ...saved, isMaximized: true });
    }
  }

  createMainWindow(): BrowserWindow {
    return this.createWindow('main', {
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      title: 'Main window',
      icon: path.join(VITE_PUBLIC, 'favicon.ico'),
      show: false,
    });
  }

  createWindow(name: string, options: BrowserWindowConstructorOptions = {}): BrowserWindow {
    const existing = this.windows.get(name);
    if (existing && !existing.isDestroyed()) {
      existing.focus();
      return existing;
    }

    const savedBounds = this.getSavedBounds(name, {
      width: options.width ?? 1200,
      height: options.height ?? 800,
    });

    const win = new BrowserWindow({
      ...options,
      x: savedBounds.x,
      y: savedBounds.y,
      width: savedBounds.width,
      height: savedBounds.height,
      webPreferences: {
        preload: path.join(MAIN_DIST, 'preload/index.js'),
        ...options.webPreferences,
        ...WindowManager.SECURITY_PREFS,
      },
    });

    // 窗口级安全策略 (导航拦截 + 新窗口控制)
    SecurityPolicy.applyToWebContents(win.webContents);

    // 恢复最大化状态
    if (savedBounds.isMaximized) {
      win.maximize();
    }

    // 窗口就绪后显示 (避免白屏闪烁)
    win.once('ready-to-show', () => {
      win.show();
    });

    // 最大化状态变化 → 推送到渲染进程
    win.on('maximize', () => {
      win.webContents.send(IPC.WIN_MAXIMIZED_CHANGED, true);
    });
    win.on('unmaximize', () => {
      win.webContents.send(IPC.WIN_MAXIMIZED_CHANGED, false);
    });

    // 持久化窗口位置
    win.on('close', () => {
      this.saveBounds(name, win);
    });

    win.on('closed', () => {
      this.windows.delete(name);
    });

    this.windows.set(name, win);

    // 加载内容
    this.loadContent(win);

    return win;
  }

  private loadContent(win: BrowserWindow, hash?: string) {
    const indexHtml = path.join(RENDERER_DIST, 'index.html');

    if (VITE_DEV_SERVER_URL) {
      const url = hash ? `${VITE_DEV_SERVER_URL}#${hash}` : VITE_DEV_SERVER_URL;
      win.loadURL(url);
      win.webContents.openDevTools();
    } else {
      win.loadFile(indexHtml, hash ? { hash } : undefined);
    }
  }

  getWindow(name: string): BrowserWindow | undefined {
    const win = this.windows.get(name);
    if (win && !win.isDestroyed()) return win;
    return undefined;
  }

  getMainWindow(): BrowserWindow | undefined {
    return this.getWindow('main');
  }

  sendToAll(channel: string, ...args: unknown[]) {
    for (const win of this.windows.values()) {
      if (!win.isDestroyed()) {
        win.webContents.send(channel, ...args);
      }
    }
  }

  closeAll() {
    for (const win of this.windows.values()) {
      if (!win.isDestroyed()) {
        win.close();
      }
    }
  }
}
