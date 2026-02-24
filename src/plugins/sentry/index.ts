import { isSentryEnabled, getDefaultSentryConfig, type SentryConfig } from './const';

/**
 * 动态加载 Sentry
 */
export async function loadSentry() {
  if (!isSentryEnabled()) {
    return null;
  }

  try {
    const Sentry = await import('@sentry/react');
    return Sentry;
  } catch (error) {
    console.warn('Failed to load Sentry:', error);
    return null;
  }
}

/**
 * 初始化 Sentry (React 版本)
 */
export async function initSentry(config: Partial<SentryConfig> = {}) {
  if (!isSentryEnabled()) {
    return null;
  }

  const Sentry = await loadSentry();
  if (!Sentry) {
    return null;
  }

  const finalConfig = { ...getDefaultSentryConfig(), ...config };

  if (!finalConfig.dsn) {
    console.warn('Sentry DSN not configured. Sentry will not be initialized.');
    return null;
  }

  const integrations: any[] = [
    ...(finalConfig.enablePerformance
      ? [
          Sentry.browserTracingIntegration({
            enableLongTask: true,
          }),
        ]
      : []),

    ...(finalConfig.enableReplay
      ? [
          Sentry.replayIntegration({
            maskAllText: true,
            maskAllInputs: true,
            blockAllMedia: true,
          }),
        ]
      : []),

    ...(finalConfig.enableFeedback
      ? [
          Sentry.feedbackIntegration({
            buttonLabel: '反馈问题',
            submitButtonLabel: '发送反馈',
            cancelButtonLabel: '取消',
            formTitle: '问题反馈',
            emailLabel: '邮箱地址',
            emailPlaceholder: '请输入您的邮箱',
            messageLabel: '问题描述',
            messagePlaceholder: '请详细描述您遇到的问题...',
            nameLabel: '联系人',
            namePlaceholder: '请输入您的姓名',
            successMessageText: '感谢您的反馈！我们会尽快处理。',
          }),
        ]
      : []),
  ];

  Sentry.init({
    dsn: finalConfig.dsn,
    environment: finalConfig.environment,
    release: finalConfig.release,
    debug: finalConfig.debug,

    tracesSampleRate: finalConfig.tracesSampleRate,
    replaysSessionSampleRate: finalConfig.replaysSessionSampleRate,
    replaysOnErrorSampleRate: finalConfig.replaysOnErrorSampleRate,

    sendDefaultPii: finalConfig.sendDefaultPii,
    maxBreadcrumbs: finalConfig.maxBreadcrumbs,

    integrations,

    ignoreErrors: finalConfig.ignoreErrors,
    allowUrls: finalConfig.allowUrls,
    denyUrls: finalConfig.denyUrls,

    beforeSend(event, hint) {
      if (import.meta.env.DEV) {
        console.group('Sentry Error Event');
        console.error('Original error:', hint.originalException);
        console.groupEnd();
      }

      if (event.exception) {
        const error = hint.originalException;
        if (error instanceof Error) {
          if (error.message.includes('Failed to fetch') || error.message.includes('Network request failed')) {
            return null;
          }
          if (error.message.includes('Loading chunk') || error.message.includes('Loading CSS chunk')) {
            return null;
          }
        }
      }

      return event;
    },

    beforeBreadcrumb(breadcrumb) {
      if (breadcrumb.category === 'console' && breadcrumb.level === 'debug') {
        return null;
      }
      if (breadcrumb.category === 'ui.hover' || breadcrumb.category === 'ui.mousemove') {
        return null;
      }
      return breadcrumb;
    },
  });

  Sentry.setContext('app', {
    name: 'React Electron Template',
    version: finalConfig.release,
    environment: finalConfig.environment,
    buildTime: new Date().toISOString(),
  });

  Sentry.setTag('component', 'root');

  Sentry.addBreadcrumb({
    message: 'Sentry initialized',
    category: 'app.lifecycle',
    level: 'info',
    data: {
      environment: finalConfig.environment,
      debug: finalConfig.debug,
      enableReplay: finalConfig.enableReplay,
      enablePerformance: finalConfig.enablePerformance,
    },
  });

  return Sentry;
}

/**
 * 手动捕获错误的工具函数（动态加载版本）
 */
export const createSentryUtils = (Sentry: any) => ({
  captureException: (error: Error, context?: Record<string, any>) => {
    if (!Sentry) return null;
    return Sentry.withScope((scope: any) => {
      if (context) {
        scope.setContext('customContext', context);
      }
      return Sentry.captureException(error);
    });
  },

  captureMessage: (message: string, level: any = 'info', context?: Record<string, any>) => {
    if (!Sentry) return null;
    return Sentry.withScope((scope: any) => {
      scope.setLevel(level);
      if (context) {
        scope.setContext('customContext', context);
      }
      return Sentry.captureMessage(message);
    });
  },

  setUser: (user: any) => {
    if (!Sentry) return;
    Sentry.setUser(user);
  },

  setTag: (key: string, value: string) => {
    if (!Sentry) return;
    Sentry.setTag(key, value);
  },

  setContext: (key: string, context: Record<string, any>) => {
    if (!Sentry) return;
    Sentry.setContext(key, context);
  },

  addBreadcrumb: (breadcrumb: any) => {
    if (!Sentry) return;
    Sentry.addBreadcrumb(breadcrumb);
  },

  startSpan: (context: { name: string; op: string; description?: string }) => {
    if (!Sentry) return null;
    return Sentry.startSpan(context, (span: any) => span);
  },

  showFeedback: (options?: any) => {
    if (!Sentry) return;
    Sentry.showReportDialog(options);
  },

  trackStateChange: (storeName: string, action: string, before: any, after: any) => {
    if (!Sentry) return;
    Sentry.addBreadcrumb({
      message: `State change in ${storeName}: ${action}`,
      category: 'state',
      level: 'info',
      data: {
        store: storeName,
        action,
        before: typeof before === 'object' ? JSON.stringify(before) : before,
        after: typeof after === 'object' ? JSON.stringify(after) : after,
      },
    });
  },

  trackRouteChange: (from: string, to: string, params?: any) => {
    if (!Sentry) return;
    Sentry.addBreadcrumb({
      message: `Route change: ${from} → ${to}`,
      category: 'navigation',
      level: 'info',
      data: { from, to, params },
    });
  },

  setMeasurement: (name: string, value: number, unit: string) => {
    if (!Sentry) return;
    Sentry.setMeasurement(name, value, unit);
  },
});

export const emptySentryUtils = createSentryUtils(null);

export const isSentryInitialized = async (): Promise<boolean> => {
  try {
    const Sentry = await loadSentry();
    return !!Sentry?.getClient();
  } catch {
    return false;
  }
};
