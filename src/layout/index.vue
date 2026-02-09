<template>
  <div class="layout-container">
    <!-- Header 头部 -->
    <LayoutHeader v-if="layoutVisible.header" :logo-title="$t('layout.systemTitle')" class="layout-header">
      <template #menu>
        <!-- 这里可以添加菜单项 -->
      </template>
    </LayoutHeader>

    <!-- 左侧菜单 -->
    <LayoutMenu v-if="layoutVisible.nav" class="layout-nav" />

    <!-- Main 主体内容 -->
    <LayoutMain class="layout-main" />
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import LayoutHeader from './components/LayoutHeader/index.vue';
import LayoutMenu from './components/LayoutMenu/index.vue';
import LayoutMain from './components/LayoutMain/index.vue';
import { useLayout } from './useLayoutContext';

const route = useRoute();
const { layoutVisible, setLayoutVisible, setHeaderVisible, setLogoConfig, setCustomMenuList, resetAll } = useLayout();

// 监听路由变化，应用 Layout 配置
watch(
  () => route.meta.layout,
  layoutConfig => {
    // 先重置到默认配置
    resetAll();

    // 如果路由配置了 layout，则应用配置
    if (layoutConfig) {
      if (layoutConfig.layout) {
        setLayoutVisible(layoutConfig.layout);
      }
      if (layoutConfig.header) {
        setHeaderVisible(layoutConfig.header);
      }
      if (layoutConfig.logo) {
        setLogoConfig(layoutConfig.logo);
      }
      if (layoutConfig.customMenu) {
        setCustomMenuList(layoutConfig.customMenu);
      }
    }
  },
  { immediate: true }, // 立即执行一次
);
</script>

<style scoped lang="scss">
.layout-container {
  display: grid;
  grid-template: 'header header' auto 'nav main' 1fr / auto 1fr;
  height: 100vh;
}

.layout-header {
  grid-area: header;
}

.layout-nav {
  grid-area: nav;
}

.layout-main {
  grid-area: main;
  overflow: auto;
}
</style>
