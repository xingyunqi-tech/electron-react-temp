/**
 * 应用生命周期管理
 *
 * 职责:
 * - 单实例锁 (second-instance 聚焦已有窗口)
 * - 平台差异处理 (Windows 7 GPU / Windows 10 通知)
 * - 渲染进程崩溃恢复
 * - 深度链接协议注册与分发
 */

import { app, BrowserWindow } from 'electron';
import os from 'node:os';
import log from 'electron-log';
import { WindowManager } from './WindowManager';
import { IPC } from '../../shared/channels';
import { APP_PROTOCOL } from '../env';

export class AppLifecycle {
  private static pendingDeepLinkUrl: string | null = null;
  private static protocol = '';

  /** 获取并消费待处理的深度链接 URL (仅返回一次) */
  static getPendingDeepLinkUrl(): string | null {
    const url = this.pendingDeepLinkUrl;
    this.pendingDeepLinkUrl = null;
    return url;
  }

  static setup() {
    // Windows 7 禁用硬件加速
    if (os.release().startsWith('6.1')) {
      app.disableHardwareAcceleration();
    }

    // Windows 10+ 通知应用名
    if (process.platform === 'win32') {
      app.setAppUserModelId(app.getName());
    }

    // 单实例锁
    if (!app.requestSingleInstanceLock()) {
      app.quit();
      return;
    }

    // ---- 深度链接协议注册 ----
    this.protocol = APP_PROTOCOL;
    if (!app.isDefaultProtocolClient(this.protocol)) {
      app.setAsDefaultProtocolClient(this.protocol);
    }

    // 启动参数中的深度链接 (Windows/Linux 冷启动)
    const launchUrl = process.argv.find(arg => arg.startsWith(`${this.protocol}://`));
    if (launchUrl) {
      this.pendingDeepLinkUrl = launchUrl;
    }

    // ---- 事件注册 ----

    // 二次启动 → 聚焦已有窗口 + 处理深度链接
    app.on('second-instance', (_event, argv) => {
      const win = WindowManager.getInstance().getMainWindow();
      if (win) {
        if (win.isMinimized()) win.restore();
        win.focus();
      }

      // Windows/Linux: 深度链接 URL 在命令行参数中
      const url = argv.find(arg => arg.startsWith(`${this.protocol}://`));
      if (url) this.handleDeepLink(url);
    });

    // macOS: 深度链接通过 open-url 事件传递
    app.on('open-url', (event, url) => {
      event.preventDefault();
      this.handleDeepLink(url);
    });

    // 所有窗口关闭
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    // 渲染进程崩溃恢复 (最多重试 3 次，避免崩溃循环)
    const crashCounts = new Map<number, number>();
    const MAX_CRASH_RETRIES = 3;

    app.on('render-process-gone', (_event, webContents, details) => {
      log.error('Render process gone:', details.reason, details.exitCode);

      if (details.reason === 'crashed' || details.reason === 'oom') {
        const win = BrowserWindow.fromWebContents(webContents);
        if (win && !win.isDestroyed()) {
          const id = win.id;
          const count = (crashCounts.get(id) ?? 0) + 1;
          crashCounts.set(id, count);

          if (count <= MAX_CRASH_RETRIES) {
            log.warn(`Reloading window ${id} (attempt ${count}/${MAX_CRASH_RETRIES})`);
            win.reload();
          } else {
            log.error(`Window ${id} crashed ${count} times, giving up reload`);
          }
        }
      }
    });

    // 子进程崩溃
    app.on('child-process-gone', (_event, details) => {
      log.error('Child process gone:', details.type, details.reason);
    });
  }

  /** 分发深度链接到渲染进程，窗口未就绪时暂存 */
  private static handleDeepLink(url: string) {
    log.info('[DeepLink] Received:', url);

    const win = WindowManager.getInstance().getMainWindow();
    if (win && !win.isDestroyed()) {
      win.webContents.send(IPC.DEEP_LINK_RECEIVED, url);
    } else {
      this.pendingDeepLinkUrl = url;
    }
  }
}
