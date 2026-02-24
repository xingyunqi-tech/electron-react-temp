import type { SkeletonType } from '@/interface';
import CardSkeleton from './CardSkeleton/index';
import TableSkeleton from './TableSkeleton/index';

/**
 * 页面级骨架屏组件映射表
 */
const PAGE_SKELETON_COMPONENTS: Record<SkeletonType, React.ComponentType<any>> = {
  card: CardSkeleton,
  table: TableSkeleton,
};

/**
 * 获取骨架屏组件
 */
export function getSkeletonComponent(handle?: { skeleton?: any }): React.ComponentType<any> | null {
  const skeletonConfig = handle?.skeleton;

  if (!skeletonConfig) return null;

  if ('component' in skeletonConfig && skeletonConfig.component) {
    return skeletonConfig.component;
  }

  if ('type' in skeletonConfig) {
    const { type } = skeletonConfig;
    if (type in PAGE_SKELETON_COMPONENTS) {
      return PAGE_SKELETON_COMPONENTS[type as SkeletonType];
    }
    console.warn(`[useSkeleton] 未知的骨架屏类型: ${type}`);
  }

  return null;
}

/**
 * 获取骨架屏组件的 props
 */
export function getSkeletonProps(handle?: { skeleton?: any }): Record<string, any> {
  return handle?.skeleton?.props || {};
}
