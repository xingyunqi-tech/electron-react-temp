/**
 * 安全策略
 *
 * 职责:
 * - Content-Security-Policy (通过 session response headers)
 * - 导航拦截 (阻止跳转到非预期 URL)
 * - 新窗口打开控制 (外部链接走系统浏览器)
 */

import { app, session, shell, type WebContents } from 'electron';
import log from 'electron-log';

export class SecurityPolicy {
  static apply() {
    this.setupCSP();
  }

  /**
   * Content-Security-Policy
   * 生产环境限制资源来源，开发环境宽松允许 HMR
   */
  private static setupCSP() {
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      // 生产环境: connect-src 需包含实际 API 域名，按需添加到下方数组
      let apiOrigins = '';
      if (process.env.API_BASE_URL) {
        try {
          apiOrigins = ` ${new URL(process.env.API_BASE_URL).origin}`;
        } catch {
          log.warn('[CSP] Invalid API_BASE_URL:', process.env.API_BASE_URL);
        }
      }
      const csp = app.isPackaged
        ? `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data:; font-src 'self' data: https://fonts.gstatic.com; worker-src 'self' blob:; connect-src 'self'${apiOrigins} https:`
        : "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:";

      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [csp],
        },
      });
    });
  }

  /**
   * 应用到指定 webContents 的安全策略
   * 每个新创建的窗口都应调用此方法
   */
  static applyToWebContents(webContents: WebContents) {
    // 拦截导航 — 只允许同源导航和开发服务器
    webContents.on('will-navigate', (event, url) => {
      const allowedOrigins = [
        'file://',
        ...(process.env.VITE_DEV_SERVER_URL ? [new URL(process.env.VITE_DEV_SERVER_URL).origin] : []),
      ];

      const isAllowed = allowedOrigins.some(origin => url.startsWith(origin));
      if (!isAllowed) {
        event.preventDefault();
        log.warn(`Blocked navigation to: ${url}`);
      }
    });

    // 控制新窗口打开 — 外部链接走系统浏览器，其余拒绝
    webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('https:') || url.startsWith('http:')) {
        shell.openExternal(url);
      }
      return { action: 'deny' };
    });
  }
}
