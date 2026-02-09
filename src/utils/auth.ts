import { ROLE_DESCRIPTIONS } from '@/constants/roles';
import type { RoleType } from '@/constants/roles';

/**
 * 权限工具函数
 *
 * 注意：这些是非响应式的工具函数，适用于：
 * 1. 路由守卫中使用
 * 2. 非 Vue 组件中使用（如纯 TS 文件）
 * 3. 一次性判断（不需要响应式更新）
 *
 * 在 Vue 组件中，推荐使用 `usePermission()` Composable 以获得响应式支持
 */

/**
 * 检查角色是否匹配
 * @param userRole 用户角色
 * @param requiredRoles 需要的角色（单个或数组）
 */
export function checkRole(userRole: string, requiredRoles: RoleType | RoleType[]): boolean {
  if (!userRole) return false;
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return roles.includes(userRole as RoleType);
}

/**
 * 获取角色显示名称
 */
export function getRoleLabel(roleCode: RoleType): string {
  return ROLE_DESCRIPTIONS[roleCode] || roleCode;
}
