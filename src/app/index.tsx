import 'virtual:uno.css';
import './index.scss';

import type { ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { ReduxProvider } from '@/store/framework';
import { reduxContext } from '@/store';
import { setupGlobalErrorHandler } from '@/utils/errorHandler';
import ErrorBoundary from '@/components/ErrorBoundary';
import '@/plugins/locale';
import App from './App';

// 设置全局错误处理器
setupGlobalErrorHandler();

/**
 * 初始化应用
 */
async function initApp() {
  // 并行初始化可选插件
  const tasks: Promise<void>[] = [];

  let AppComponent: ComponentType = App;

  // Web Vitals
  if (import.meta.env.VITE_ENABLE_WEB_VITALS === 'true') {
    tasks.push(
      import('@/plugins/webVitals').then(({ reportWebVitals }) => {
        reportWebVitals(console.log);
      }),
    );
  }

  // Sentry
  if (import.meta.env.VITE_ENABLE_SENTRY === 'true') {
    tasks.push(
      import('@/plugins/sentry').then(({ initSentry }) => {
        initSentry();
      }),
      import('@sentry/react').then(({ withProfiler }) => {
        AppComponent = withProfiler(App, { name: 'App' });
      }),
    );
  }

  await Promise.all(tasks);

  // 挂载应用
  const root = createRoot(document.getElementById('root')!);
  root.render(
    <ErrorBoundary>
      <ReduxProvider context={reduxContext}>
        <AppComponent />
      </ReduxProvider>
    </ErrorBoundary>,
  );
}

initApp();
