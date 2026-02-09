import { type Component } from 'vue';
import { type RouteLocationNormalizedLoaded } from 'vue-router';
import type { SkeletonType } from '@/interface';
import CardSkeleton from './CardSkeleton/index.vue';
import TableSkeleton from './TableSkeleton/index.vue';

/**
 * 页面级骨架屏组件映射表
 *
 * 🎯 单一真实来源：所有页面级骨架屏组件在此统一注册
 * 新增骨架屏类型时只需修改此处
 *
 * 注意：LoginSkeleton 等自定义骨架屏通过 meta.skeleton.component 直接指定
 */
const PAGE_SKELETON_COMPONENTS: Record<SkeletonType, Component> = {
  card: CardSkeleton,
  table: TableSkeleton,
};

/**
 * 获取骨架屏组件
 *
 * @param route - 当前路由对象
 * @returns 骨架屏组件，如果没有配置则返回 null
 */
export function getSkeletonComponent(route: RouteLocationNormalizedLoaded): Component | null {
  const skeletonConfig = route.meta.skeleton;

  // 没有配置骨架屏
  if (!skeletonConfig) {
    return null;
  }

  // 优先使用自定义组件
  if ('component' in skeletonConfig && skeletonConfig.component) {
    return skeletonConfig.component;
  }

  // 使用类型映射的组件
  if ('type' in skeletonConfig) {
    const { type } = skeletonConfig;
    if (type in PAGE_SKELETON_COMPONENTS) {
      return PAGE_SKELETON_COMPONENTS[type];
    }
    console.warn(`[useSkeleton] 未知的骨架屏类型: ${type}，跳过骨架屏显示`);
  }

  return null;
}

/**
 * 获取骨架屏组件的 props
 *
 * @param route - 当前路由对象
 * @returns 骨架屏组件的 props
 */
export function getSkeletonProps(route: RouteLocationNormalizedLoaded): Record<string, any> {
  return route.meta.skeleton?.props || {};
}
