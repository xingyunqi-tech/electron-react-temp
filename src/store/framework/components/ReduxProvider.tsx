import React from 'react';
import { Provider } from 'react-redux';
import type { EnhancedStore } from '@reduxjs/toolkit';
import type { PluginManager } from '../types';

export interface ReduxProviderProps {
  children: React.ReactNode;
  context: {
    store: EnhancedStore;
    pluginManager: PluginManager;
  };
}

/**
 * ReduxProvider — 框架级 Provider
 *
 * 自动组合所有插件的 Provider（如 PersistGate），
 * 由外到内依次包裹。
 */
export function ReduxProvider({ children, context }: ReduxProviderProps) {
  const { store, pluginManager } = context;

  // 收集所有插件的 Provider，由外到内包裹
  let content = <>{children}</>;

  // 反向遍历：最后注册的插件在最内层
  const pluginsWithProvider = pluginManager.plugins.filter(p => p.Provider);
  for (let i = pluginsWithProvider.length - 1; i >= 0; i--) {
    const PluginProvider = pluginsWithProvider[i].Provider!;
    content = <PluginProvider>{content}</PluginProvider>;
  }

  return <Provider store={store}>{content}</Provider>;
}
