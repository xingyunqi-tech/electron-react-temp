<template>
  <div class="sentry-provider">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/store';
import { isSentryEnabled } from '@/plugins/sentry/const';

/**
 * 用户信息接口
 */
interface UserInfo {
  id: string | number;
  username?: string;
  email?: string;
  avatar?: string;
  [key: string]: any;
}

/**
 * 性能指标接口
 */
interface PerformanceMetrics {
  pageLoadTime?: number;
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
}

/**
 * 自定义事件接口
 */
interface CustomEvent {
  name: string;
  data?: Record<string, any>;
  level?: 'debug' | 'info' | 'warning' | 'error' | 'fatal';
  tags?: Record<string, string>;
}

/**
 * 组件属性
 */
interface Props {
  /** 采样率 */
  sampleRate?: number;
}

/**
 * 组件事件
 */
interface Emits {
  (e: 'userSet', user: UserInfo): void;
  (e: 'eventCaptured', event: CustomEvent): void;
  (e: 'performanceMetrics', metrics: PerformanceMetrics): void;
}

const props = withDefaults(defineProps<Props>(), {
  sampleRate: 1.0,
});

const emit = defineEmits<Emits>();
const route = useRoute();
const userStore = useUserStore();

// 组件状态
const performanceObservers = ref<PerformanceObserver[]>([]);
const sentryEnabled = ref(false);

// Sentry 实例（从外部初始化）
let Sentry: any = null;

// 内置配置
const autoConfig = {
  enabled: true,
  autoPageViews: true,
  autoUserInteractions: true,
  autoPerformance: true,
  autoHttpRequests: true,
  contextTags: { component: 'app-root', level: 'global' },
};

// 获取浏览器信息的辅助函数
const getBrowserInfo = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      userAgent: '',
      language: '',
      platform: '',
      cookieEnabled: false,
    };
  }

  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
  };
};

// 内置的全局标签
const globalTags = computed(() => ({
  app: 'vite-vue3-template',
  version: '1.0.0',
  environment: import.meta.env.MODE,
  route: route?.name?.toString() || 'unknown',
}));

// 内置的全局上下文
const globalContext = computed(() => ({
  application: {
    name: 'Vite Vue3 Template',
    version: '1.0.0',
    environment: import.meta.env.MODE,
  },
  browser: getBrowserInfo(),
}));

// 内置的额外上下文
const extraContext = computed(() => ({
  route: route?.path,
  userAgent: getBrowserInfo().userAgent,
  timestamp: Date.now(),
}));

// 内置的用户信息
const currentUserInfo = computed(() => ({
  id: userStore.id || '',
  username: userStore.realName || userStore.username || '',
  email: userStore.email || '',
}));

/**
 * 获取 Sentry 实例
 */
const getSentryInstance = async () => {
  if (!isSentryEnabled()) {
    return false;
  }

  try {
    // 检查是否已经初始化
    const { loadSentry: loadSentryLib } = await import('@/plugins/sentry');
    Sentry = await loadSentryLib();

    if (Sentry && Sentry.getClient()) {
      sentryEnabled.value = true;
      return true;
    }

    console.warn('⚠️ Sentry not initialized');
    return false;
  } catch (error) {
    console.warn('⚠️ Failed to get Sentry instance:', error);
    sentryEnabled.value = false;
    return false;
  }
};

/**
 * 设置用户信息
 */
const setUser = (userInfo: UserInfo) => {
  if (!Sentry) return;

  // 过滤空值
  const filteredUserInfo: any = {};
  if (userInfo.id) filteredUserInfo.id = userInfo.id;
  if (userInfo.username) filteredUserInfo.username = userInfo.username;
  if (userInfo.email) filteredUserInfo.email = userInfo.email;
  if (userInfo.avatar) filteredUserInfo.avatar = userInfo.avatar;

  // 只有当有有效用户信息时才设置
  if (Object.keys(filteredUserInfo).length > 0) {
    Sentry.setUser(filteredUserInfo);
  }

  emit('userSet', userInfo);

  // 添加面包屑
  Sentry.addBreadcrumb({
    message: `User set: ${userInfo.username || userInfo.id}`,
    category: 'auth',
    level: 'info',
  });
};

/**
 * 设置全局标签
 */
const setGlobalTags = (tags: Record<string, string>) => {
  if (!Sentry) return;

  Object.entries(tags).forEach(([key, value]) => {
    Sentry.setTag(key, value);
  });
};

/**
 * 设置全局上下文
 */
const setGlobalContext = (context: Record<string, any>) => {
  if (!Sentry) return;

  Object.entries(context).forEach(([key, value]) => {
    Sentry.setContext(key, value);
  });
};

/**
 * 捕获自定义事件
 */
const captureEvent = (event: CustomEvent) => {
  if (!Sentry) return;

  const shouldSample = Math.random() < props.sampleRate;
  if (!shouldSample) return;

  Sentry.withScope((scope: any) => {
    if (event.level) {
      scope.setLevel(event.level);
    }

    if (event.tags) {
      Object.entries(event.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (event.data) {
      scope.setContext('eventData', event.data);
    }

    Sentry.captureMessage(event.name, event.level || 'info');
  });

  emit('eventCaptured', event);
};

/**
 * 捕获错误到Sentry
 */
const captureError = (error: Error, context?: Record<string, any>) => {
  if (!Sentry) return;

  Sentry.withScope((scope: any) => {
    // 设置上下文
    if (context) {
      scope.setContext('errorContext', context);
    }

    // 设置额外上下文
    scope.setContext('extra', extraContext.value);

    // 捕获错误
    const eventId = Sentry.captureException(error);
    return eventId;
  });
};

/**
 * 添加面包屑
 */
const addBreadcrumb = (message: string, category?: string, level?: string, data?: any) => {
  if (!Sentry) return;

  Sentry.addBreadcrumb({
    message,
    category: category || 'custom',
    level: (level as any) || 'info',
    data,
  });
};

/**
 * 采集页面访问
 */
const trackPageView = (path: string, title?: string) => {
  if (!Sentry) return;

  addBreadcrumb(`Navigate to ${path}`, 'navigation', 'info', {
    to: path,
    title: title || document.title,
  });

  // 设置页面标签
  Sentry.setTag('page.path', path);
  Sentry.setTag('page.title', title || document.title);

  // 开始页面性能跟踪
  if (autoConfig.autoPerformance) {
    Sentry.startSpan(
      {
        name: `pageload${path}`,
        op: 'pageload',
        description: `Page load: ${path}`,
      },
      () => {
        // 页面加载跟踪逻辑
      },
    );
  }
};

/**
 * 采集用户交互
 */
const trackUserInteraction = (element: HTMLElement, action: string) => {
  if (!Sentry) return;

  const elementInfo = {
    tagName: element.tagName,
    className: element.className,
    id: element.id,
    textContent: element.textContent?.slice(0, 100),
  };

  addBreadcrumb(`User ${action}`, 'ui.interaction', 'info', elementInfo);
};

/**
 * 采集性能指标
 */
const collectPerformanceMetrics = () => {
  if (!Sentry) return;

  const metrics: PerformanceMetrics = {};

  // 采集导航时间
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigation) {
    metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
  }

  // 采集Web Vitals
  try {
    // FCP (First Contentful Paint)
    const fcpEntries = performance.getEntriesByName('first-contentful-paint');
    if (fcpEntries.length > 0) {
      metrics.fcp = fcpEntries[0].startTime;
    }

    // LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        metrics.lcp = lastEntry.startTime;
        emit('performanceMetrics', metrics);
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      performanceObservers.value.push(lcpObserver);
    }
  } catch (error) {
    console.warn('Performance metrics collection failed:', error);
  }

  // 发送基础指标
  if (Object.keys(metrics).length > 0) {
    emit('performanceMetrics', metrics);

    // 发送到Sentry
    if (Sentry) {
      Sentry.setContext('performance', metrics);
    }
  }
};

/**
 * 设置HTTP请求拦截
 */
const setupHttpTracking = () => {
  if (!Sentry) return;

  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const url = args[0] as string;
    const options = args[1] || {};

    const startTime = Date.now();

    try {
      const response = await originalFetch(...args);
      const duration = Date.now() - startTime;

      addBreadcrumb(`HTTP ${options.method || 'GET'} ${url}`, 'http', response.ok ? 'info' : 'warning', {
        url,
        method: options.method || 'GET',
        status: response.status,
        duration,
      });

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;

      addBreadcrumb(`HTTP ${options.method || 'GET'} ${url} failed`, 'http', 'error', {
        url,
        method: options.method || 'GET',
        duration,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  };
};

/**
 * 监听路由变化
 */
watch(
  () => route.path,
  (newPath, oldPath) => {
    if (autoConfig.autoPageViews && newPath !== oldPath && Sentry) {
      trackPageView(newPath, route.meta?.title as string);
    }
  },
  { immediate: true },
);

/**
 * 监听用户信息变化
 */
watch(
  () => currentUserInfo.value,
  newUserInfo => {
    if (newUserInfo && Sentry) {
      setUser(newUserInfo);
    }
  },
  { immediate: true, deep: true },
);

/**
 * 监听全局标签变化
 */
watch(
  () => globalTags.value,
  newTags => {
    if (newTags && Sentry) {
      setGlobalTags(newTags);
    }
  },
  { immediate: true, deep: true },
);

/**
 * 监听全局上下文变化
 */
watch(
  () => globalContext.value,
  newContext => {
    if (newContext && Sentry) {
      setGlobalContext(newContext);
    }
  },
  { immediate: true, deep: true },
);

/**
 * 组件挂载
 */
let clickHandler: ((event: Event) => void) | null = null;

onMounted(async () => {
  // 获取 Sentry 实例
  await getSentryInstance();

  if (!sentryEnabled.value) return;

  // 设置用户交互监听
  if (autoConfig.autoUserInteractions) {
    clickHandler = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target) {
        trackUserInteraction(target, 'click');
      }
    };

    document.addEventListener('click', clickHandler, { passive: true });
  }

  // 采集性能指标
  if (autoConfig.autoPerformance) {
    setTimeout(collectPerformanceMetrics, 1000);
  }

  // 设置HTTP请求追踪
  if (autoConfig.autoHttpRequests) {
    setupHttpTracking();
  }

  // 添加组件初始化面包屑
  addBreadcrumb('SentryProvider mounted', 'ui.lifecycle');
});

/**
 * 组件卸载清理
 */
onUnmounted(() => {
  // 清理点击事件监听器
  if (clickHandler) {
    document.removeEventListener('click', clickHandler);
    clickHandler = null;
  }

  // 清理性能观察器
  performanceObservers.value.forEach(observer => {
    observer.disconnect();
  });
  performanceObservers.value = [];

  // 添加组件卸载面包屑
  addBreadcrumb('SentryProvider unmounted', 'ui.lifecycle');
});

// 暴露方法给父组件
defineExpose({
  setUser,
  setGlobalTags,
  setGlobalContext,
  captureEvent,
  captureError,
  addBreadcrumb,
  trackPageView,
  trackUserInteraction,
  sentryEnabled: sentryEnabled.value,
});
</script>

<style scoped lang="scss">
.sentry-provider {
  display: contents; // 不影响布局
}
</style>
