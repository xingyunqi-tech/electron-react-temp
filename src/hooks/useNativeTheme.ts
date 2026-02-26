/**
 * 系统深色模式同步 Hook
 * 监听 Electron 主进程推送的系统主题变化事件
 *
 * Web 环境下使用 matchMedia 监听
 */

import { useState, useEffect } from 'react';
import { isElectron, invokeElectron } from '@/utils/electron';

export function useNativeTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isElectron()) {
      // Electron: 通过 IPC 获取初始值 + 监听变化
      invokeElectron(api => api.getTheme()).then(val => {
        if (val !== null) setIsDark(val);
      });

      const unsubscribe = window.electronAPI!.on('theme:changed', shouldUseDark => {
        setIsDark(shouldUseDark);
      });

      return unsubscribe;
    } else {
      // Web: 使用 matchMedia
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDark(mq.matches);

      const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, []);

  return { isDark };
}
