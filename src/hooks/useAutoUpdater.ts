/**
 * 自动更新 Hook
 * 监听更新状态推送，提供手动触发检查/下载/安装的操作
 *
 * Web 环境下 status 为 null，所有操作为 noop
 */

import { useState, useCallback, useEffect } from 'react';
import { isElectron, invokeElectron } from '@/utils/electron';

export function useAutoUpdater() {
  const [status, setStatus] = useState<ElectronUpdateStatus | null>(null);

  useEffect(() => {
    if (!isElectron()) return;

    const unsubscribe = window.electronAPI!.on('update:status', newStatus => {
      setStatus(newStatus);
    });

    return unsubscribe;
  }, []);

  const checkUpdate = useCallback(async () => {
    return invokeElectron(api => api.checkUpdate());
  }, []);

  const downloadUpdate = useCallback(async () => {
    return invokeElectron(api => api.downloadUpdate());
  }, []);

  const installUpdate = useCallback(async () => {
    return invokeElectron(api => api.installUpdate());
  }, []);

  return { status, checkUpdate, downloadUpdate, installUpdate };
}
