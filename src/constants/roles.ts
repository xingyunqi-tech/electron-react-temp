/**
 * 角色常量定义
 */

/** 角色枚举 */
export const ROLES = {
  /** 管理员 */
  ADMIN: 'ADMIN',
  /** 普通用户 */
  USER: 'USER',
} as const;

/** 角色类型 */
export type RoleType = (typeof ROLES)[keyof typeof ROLES];

/** 角色说明 */
export const ROLE_DESCRIPTIONS: Record<RoleType, string> = {
  [ROLES.ADMIN]: '管理员',
  [ROLES.USER]: '普通用户',
};
