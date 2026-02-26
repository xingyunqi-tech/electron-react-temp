/**
 * Electron 环境检测 & 安全调用工具
 *
 * 所有 Electron 原生能力调用都通过此模块中转:
 * - Web 环境自动降级 (返回 null / 不执行)
 * - 无需在每个调用点手动判断 isElectron
 */

/**
 * 当前是否运行在 Electron 环境中
 */
export const isElectron = (): boolean => typeof window !== 'undefined' && window.electronAPI !== undefined;

/**
 * 安全调用 Electron API
 * Web 环境下返回 null，不抛错
 *
 * @example
 * const info = await invokeElectron(api => api.getAppInfo());
 * // Web 环境: info === null
 * // Electron: info === { name: '...', version: '...', ... }
 */
export async function invokeElectron<T>(fn: (api: ElectronAPI) => Promise<T>): Promise<T | null> {
  if (!isElectron()) return null;
  try {
    return await fn(window.electronAPI!);
  } catch (err) {
    console.error('[Electron IPC]', err);
    return null;
  }
}

/**
 * 同步调用 Electron API (用于 send 类无返回值操作)
 *
 * @example
 * callElectron(api => api.minimize());
 */
export function callElectron(fn: (api: ElectronAPI) => void): void {
  if (isElectron()) {
    fn(window.electronAPI!);
  }
}
