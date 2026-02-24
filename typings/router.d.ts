import type { SkeletonConfig } from '@/interface/skeleton';
import type { LayoutVisible, HeaderVisible, LogoConfig, MenuItem } from '@/layout/LayoutContext';

/**
 * Layout 配置类型
 */
export interface LayoutConfig {
  /** 布局可见性配置 */
  layout?: Partial<LayoutVisible>;
  /** 头部组件可见性配置 */
  header?: Partial<HeaderVisible>;
  /** Logo 配置 */
  logo?: Partial<LogoConfig>;
  /** 自定义菜单列表 */
  customMenu?: MenuItem[];
}

/**
 * 路由元信息
 */
export interface RouteMeta {
  /** 页面标题 */
  title?: string;
  /** 角色权限 */
  roles?: string[];
  /** 是否需要认证 */
  requiresAuth?: boolean;
  /** 骨架屏配置 */
  skeleton?: SkeletonConfig;
  /** Layout 配置 */
  layout?: LayoutConfig;
}
