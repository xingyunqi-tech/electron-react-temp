import 'virtual:uno.css';
import { createApp } from 'vue';
// 手动引入组件，会和按需引入样式冲突，所以导入全量样式
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';

import App from './App.vue';
import router from '@/router';
import { i18n } from '@/plugins/locale';
import storePromise, { preloadPersistedData } from '@/store';
import { setupDirectives } from '@/directives';
import { setupGlobalErrorHandler } from '@/utils/errorHandler';

/**
 * 初始化 Web Vitals 性能监控
 * 根据环境变量 VITE_ENABLE_WEB_VITALS 配置启用
 */
async function setupWebVitals(): Promise<void> {
  if (import.meta.env.VITE_ENABLE_WEB_VITALS !== 'true') return;

  const { reportWebVitals } = await import('@/plugins/webVitals');
  reportWebVitals(console.log);
}

/**
 * 初始化 Sentry 错误监控
 * 根据环境变量 VITE_ENABLE_SENTRY 配置启用
 */
async function setupSentry(
  app: ReturnType<typeof createApp>,
  router: typeof import('@/router').default,
): Promise<void> {
  if (import.meta.env.VITE_ENABLE_SENTRY !== 'true') return;

  const { initSentry } = await import('@/plugins/sentry');
  await initSentry(app, router);
}

/**
 * 初始化应用
 */
const initApp = async () => {
  // 设置全局错误处理器
  setupGlobalErrorHandler();

  // 预加载持久化数据
  await preloadPersistedData();

  // 等待 store 创建完成
  const store = await storePromise;

  const app = createApp(App);

  // 使用插件
  app.use(i18n);
  app.use(store);
  app.use(router);

  // 注册全局指令
  setupDirectives(app);

  // 并行初始化插件：Web Vitals + Sentry
  await Promise.all([setupWebVitals(), setupSentry(app, router)]);

  app.mount('#app');
};

// 启动应用
initApp();
