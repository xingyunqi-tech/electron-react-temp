/**
 * Skeleton 骨架屏组件统一导出
 *
 * 包含：
 * 1. 骨架屏组件（CardSkeleton, TableSkeleton, LayoutSkeleton, LoginSkeleton）
 * 2. 骨架屏工具函数（getSkeletonComponent, getSkeletonProps）
 */

// 导出骨架屏组件
export { default as CardSkeleton } from './CardSkeleton/index.vue';
export { default as LayoutSkeleton } from './LayoutSkeleton/index.vue';
export { default as LoginSkeleton } from './LoginSkeleton/index.vue';
export { default as TableSkeleton } from './TableSkeleton/index.vue';

// 导出骨架屏工具函数
export { getSkeletonComponent, getSkeletonProps } from './useSkeleton';
