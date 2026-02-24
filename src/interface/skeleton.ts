/**
 * 骨架屏相关类型定义
 *
 * 基于 Ant Design Skeleton 组件的骨架屏配置
 */

import type { ComponentType } from 'react';

/**
 * 页面级骨架屏类型
 *
 * 用于路由 meta.skeleton 配置，在页面切换时显示
 *
 * 当前支持：
 * - card: 卡片型（用于卡片布局页面）
 * - table: 表格型（用于数据表格页面）
 *
 * 注意：
 * - LayoutSkeleton 用于 Layout 整体加载，不在此类型中
 * - LoginSkeleton 等自定义骨架屏通过 meta.skeleton.component 直接指定
 */
export type SkeletonType = 'card' | 'table';

/**
 * Card 骨架屏参数
 */
export interface CardSkeletonProps {
  /** 卡片数量 */
  count?: number;
  /** 每个卡片的行数 */
  rows?: number;
  /** 每行卡片列数 */
  columns?: number;
}

/**
 * Layout 骨架屏参数
 *
 * 注意：LayoutSkeleton 用于 Layout 整体加载，不通过路由 meta 配置
 */
export interface LayoutSkeletonProps {
  /** 左侧菜单项数量 */
  menuItems?: number;
  /** 主体内容卡片数量 */
  cardCount?: number;
  /** 每个卡片的行数 */
  cardRows?: number;
}

/**
 * Table 骨架屏参数
 */
export interface TableSkeletonProps {
  /** 表格列数 */
  columns?: number;
  /** 表格行数 */
  rows?: number;
  /** 是否显示搜索栏 */
  showSearchBar?: boolean;
  /** 搜索栏字段数量 */
  searchFields?: number;
  /** 是否显示工具栏 */
  showToolbar?: boolean;
  /** 是否显示分页器 */
  showPagination?: boolean;
}

/**
 * 骨架屏配置接口（使用 discriminated union 确保类型安全）
 *
 * 用于在路由 meta 中配置页面级骨架屏
 *
 * @example 基本配置
 * ```typescript
 * // 卡片型骨架屏（适用于首页卡片布局）
 * meta: { skeleton: { type: 'card', props: { count: 4, rows: 3, columns: 2 } } }
 *
 * // 表格型骨架屏（适用于数据表格页面）
 * meta: { skeleton: { type: 'table', props: { columns: 6, rows: 10 } } }
 *
 * // 自定义骨架屏组件（适用于特殊页面如 Login）
 * meta: { skeleton: { component: LoginSkeleton } }
 * ```
 */
export type SkeletonConfig =
  | { type: 'card'; props?: CardSkeletonProps }
  | { type: 'table'; props?: TableSkeletonProps }
  | { component: ComponentType<any>; props?: Record<string, any> };
