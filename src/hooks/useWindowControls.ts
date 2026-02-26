/**
 * 窗口控制 Hook
 * 提供最小化/最大化/关闭窗口操作和最大化状态追踪
 *
 * 通过监听主进程推送的 win:maximized-changed 事件保持状态同步
 * (覆盖 OS 级操作: 标题栏双击、快捷键、拖拽 snap 等)
 *
 * Web 环境下所有操作为 noop
 */

import { useState, useCallback, useEffect } from 'react';
import { isElectron, callElectron, invokeElectron } from '@/utils/electron';

export function useWindowControls() {
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    if (!isElectron()) return;

    // 查询初始状态
    invokeElectron(api => api.isMaximized()).then(val => {
      if (val !== null) setMaximized(val);
    });

    // 监听主进程推送的最大化状态变化
    const unsubscribe = window.electronAPI!.on('win:maximized-changed', isMax => {
      setMaximized(isMax);
    });

    return unsubscribe;
  }, []);

  const minimize = useCallback(() => {
    callElectron(api => api.minimize());
  }, []);

  const maximize = useCallback(() => {
    if (maximized) {
      callElectron(api => api.unmaximize());
    } else {
      callElectron(api => api.maximize());
    }
    // 不手动 setMaximized — 由主进程推送事件驱动
  }, [maximized]);

  const close = useCallback(() => {
    callElectron(api => api.close());
  }, []);

  return { maximized, minimize, maximize, close, isElectron: isElectron() };
}
