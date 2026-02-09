<template>
  <main class="layout-main">
    <router-view v-slot="{ Component: RouteComponent, route }">
      <!-- 页面级 Suspense：页面切换时显示骨架屏 -->
      <Suspense>
        <!-- 页面组件 - 使用 div 包裹确保单一根节点 -->
        <template #default>
          <Transition name="content-fade" mode="out-in">
            <component :is="RouteComponent" :key="route.fullPath" />
          </Transition>
        </template>

        <!-- 页面级骨架屏 fallback -->
        <template #fallback>
          <component :is="getSkeletonComponent(route)" v-bind="getSkeletonProps(route)" />
        </template>
      </Suspense>
    </router-view>
  </main>
</template>

<script setup lang="ts">
import { getSkeletonComponent, getSkeletonProps } from '@/components/Skeleton';
</script>

<style scoped lang="scss">
.layout-main {
  flex: 1;
  padding: 0;
  overflow: auto;
}
</style>
