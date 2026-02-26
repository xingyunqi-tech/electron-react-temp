/**
 * 主进程 KV 存储 IPC 处理器
 * 基于 electron-store，用于需要主进程持久化的场景
 * (渲染进程自身的持久化仍使用 redux-persist + localforage)
 */

import { ipcMain } from 'electron';
import Store from 'electron-store';
import { IPC } from '../../shared/channels';

const store = new Store({
  name: 'app-data',
});

export function registerStoreIPC() {
  ipcMain.handle(IPC.STORE_GET, (_event, key: string) => {
    return store.get(key);
  });

  ipcMain.handle(IPC.STORE_SET, (_event, key: string, value: unknown) => {
    store.set(key, value);
  });

  ipcMain.handle(IPC.STORE_DELETE, (_event, key: string) => {
    store.delete(key);
  });
}
