<template>
  <el-config-provider :locale="elementPlusLocale">
    <ErrorBoundary @error="handleError">
      <SentryProvider ref="sentryProviderRef">
        <!-- 根路由级 Suspense - 处理独立页面（如 Login）的加载状态 -->
        <Suspense :key="currentRoute.fullPath">
          <template #default>
            <router-view v-slot="{ Component: RouteComponent, route }">
              <!-- 添加内容淡入动画 -->
              <Transition name="content-fade" mode="out-in">
                <component :is="RouteComponent" :key="route.fullPath" />
              </Transition>
            </router-view>
          </template>

          <!-- 骨架屏 fallback - 只有配置了 meta.skeleton 的路由才显示 -->
          <template #fallback>
            <Transition name="skeleton-fade" mode="out-in">
              <component :is="skeletonComponent" v-if="skeletonComponent" v-bind="getSkeletonProps(currentRoute)" />
            </Transition>
          </template>
        </Suspense>
      </SentryProvider>
    </ErrorBoundary>
  </el-config-provider>
</template>
<script setup lang="ts">
import { computed, watchEffect, onMounted, toRefs, ref } from 'vue';
import { ElConfigProvider } from 'element-plus';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '@/store';
import { getLibraryLocales } from '@/utils/locale';
import { loadLocaleMessages } from '@/plugins/locale';
import ErrorBoundary from '@/components/ErrorBoundary/index.vue';
import SentryProvider from '@/components/SentryProvider/index.vue';
import dayjs from '@/plugins/dayjs';
import { provideLayoutContext } from '@/layout/useLayoutContext';
import { getSkeletonComponent, getSkeletonProps } from '@/components/Skeleton';

const router = useRouter();
const globalStore = useGlobalStore();
const { currentLocale, currentTheme } = toRefs(globalStore);
const { initLocale, initTheme } = globalStore;

// SentryProvider 引用
const sentryProviderRef = ref<InstanceType<typeof SentryProvider>>();

// 提供布局上下文给整个应用
provideLayoutContext();

/**
 * 骨架屏逻辑
 *
 * App.vue 的 Suspense 处理独立页面（不在 Layout 内的页面）：
 * - Layout 组件使用手动 loading，不会触发此 Suspense
 * - Login 等独立页面通过 meta.skeleton 配置骨架屏
 * - 如果路由没有配置 meta.skeleton，则不显示骨架屏
 */
const currentRoute = computed(() => router.currentRoute.value);
const skeletonComponent = computed(() => getSkeletonComponent(currentRoute.value));

// 处理 ErrorBoundary 捕获的错误
const handleError = (error: Error, errorInfo: any) => {
  // 将错误上报到 Sentry
  if (sentryProviderRef.value) {
    sentryProviderRef.value.captureError(error, {
      errorInfo,
      component: 'App',
    });
  }
};

onMounted(() => {
  initLocale();
  initTheme();
});

// 根据当前语言自动获取 Element Plus 语言包
const elementPlusLocale = computed(() => {
  return getLibraryLocales(globalStore.currentLocale);
});

// 监听语言变化并重新加载语言包
watchEffect(async () => {
  const locale = currentLocale.value;
  await loadLocaleMessages(locale);
  // 设置网站语言
  document.documentElement.setAttribute('lang', currentLocale.value);
  // 设置日期国际化
  dayjs.locale(currentLocale.value);
});

// 监听主题变化
watchEffect(() => {
  const html = document.documentElement;
  const theme = currentTheme.value;
  // 切换主题
  html.setAttribute('theme', theme);
  html.classList.remove('light', 'dark');
  html.classList.add(theme);
});
</script>
<style lang="scss">
@use './index';

html,
body,
#main-app {
  min-width: 1280px;
  background-color: var(--colorBgLayout);
  color: var(--colorTextBase);
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;
}
</style>
