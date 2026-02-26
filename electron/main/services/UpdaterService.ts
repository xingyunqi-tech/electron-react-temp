/**
 * 自动更新服务
 *
 * 基于 electron-updater:
 * - 启动后延迟检查更新 (不阻塞应用启动)
 * - autoDownload: false (不自动下载，交给用户控制)
 * - 通过 IPC 推送更新状态到渲染进程
 * - 支持渲染进程主动触发 检查/下载/安装
 */

import { app, type BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { IPC } from '../../shared/channels';
import type { UpdateCheckResult, UpdateStatus } from '../../shared/types';

export class UpdaterService {
  private static instance: UpdaterService;
  private mainWindow: BrowserWindow | null = null;
  private initialized = false;

  static getInstance(): UpdaterService {
    if (!UpdaterService.instance) {
      UpdaterService.instance = new UpdaterService();
    }
    return UpdaterService.instance;
  }

  static setup(mainWindow: BrowserWindow) {
    const instance = UpdaterService.getInstance();
    instance.mainWindow = mainWindow;
    if (!instance.initialized) {
      instance.init();
    }
  }

  private init() {
    this.initialized = true;

    if (!app.isPackaged) {
      log.info('[Updater] Skipped: app is not packaged');
      return;
    }

    autoUpdater.logger = log;
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = true;

    autoUpdater.on('checking-for-update', () => {
      this.sendStatus({ state: 'checking' });
    });

    autoUpdater.on('update-available', info => {
      this.sendStatus({
        state: 'available',
        version: info.version,
      });
    });

    autoUpdater.on('update-not-available', () => {
      this.sendStatus({ state: 'not-available' });
    });

    autoUpdater.on('download-progress', progress => {
      this.sendStatus({
        state: 'downloading',
        progress: Math.round(progress.percent),
      });
    });

    autoUpdater.on('update-downloaded', info => {
      this.sendStatus({
        state: 'downloaded',
        version: info.version,
      });
    });

    autoUpdater.on('error', err => {
      log.error('[Updater] Error:', err);
      this.sendStatus({
        state: 'error',
        error: err.message,
      });
    });

    // 延迟 10 秒后检查更新
    setTimeout(() => {
      autoUpdater.checkForUpdates().catch(err => {
        log.error('[Updater] Check failed:', err);
      });
    }, 10_000);
  }

  async checkForUpdates(): Promise<UpdateCheckResult> {
    if (!app.isPackaged) {
      return { updateAvailable: false };
    }

    try {
      const result = await autoUpdater.checkForUpdates();
      const newVersion = result?.updateInfo?.version;
      return {
        updateAvailable: !!newVersion && newVersion !== app.getVersion(),
        version: newVersion,
        releaseNotes: typeof result?.updateInfo?.releaseNotes === 'string' ? result.updateInfo.releaseNotes : undefined,
      };
    } catch (err) {
      log.error('[Updater] Check failed:', err);
      return { updateAvailable: false };
    }
  }

  async downloadUpdate() {
    if (!app.isPackaged) return;
    await autoUpdater.downloadUpdate();
  }

  installUpdate() {
    autoUpdater.quitAndInstall(false, true);
  }

  private sendStatus(status: UpdateStatus) {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send(IPC.UPDATE_STATUS, status);
    }
  }
}
