/**
 * 深度链接 Hook
 * 监听自定义协议 URL，支持冷启动和运行时接收
 *
 * Web 环境下 url 始终为 null
 */

import { useState, useEffect, useCallback } from 'react';
import { isElectron, invokeElectron } from '@/utils/electron';

export function useDeepLink() {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isElectron()) return;

    // 查询冷启动时的深度链接 URL
    invokeElectron(api => api.getDeepLinkUrl()).then(val => {
      if (val) setUrl(val);
    });

    // 监听运行时收到的深度链接
    const unsubscribe = window.electronAPI!.on('deeplink:received', newUrl => {
      setUrl(newUrl);
    });

    return unsubscribe;
  }, []);

  /** 消费后清除 URL */
  const clearUrl = useCallback(() => setUrl(null), []);

  return { url, clearUrl };
}
