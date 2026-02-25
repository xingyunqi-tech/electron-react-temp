import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import { userRoleSelector } from '@/store/modules/user';
import { ROLES } from '@/constants/roles';
import type { RoleType } from '@/constants/roles';

/**
 * 资源权限配置
 */
export interface ResourcePermissionConfig {
  view?: RoleType[];
  create?: RoleType[];
  edit?: RoleType[];
  delete?: RoleType[];
  export?: RoleType[];
  audit?: RoleType[];
}

const DEFAULT_RESOURCE_CONFIG: ResourcePermissionConfig = {
  view: [ROLES.ADMIN, ROLES.USER],
  create: [ROLES.ADMIN],
  edit: [ROLES.ADMIN],
  delete: [ROLES.ADMIN],
  export: [ROLES.ADMIN],
  audit: [ROLES.ADMIN],
};

/**
 * 权限判断 Hook
 *
 * @example 基础用法
 * const { hasRole, isAdmin } = usePermission();
 * const canManage = hasRole([ROLES.ADMIN]);
 *
 * @example 资源配置用法
 * const { canCreate, canEdit, canDelete } = usePermission({
 *   delete: [ROLES.ADMIN],
 * });
 */
export function usePermission(config?: ResourcePermissionConfig) {
  const role = useAppSelector(userRoleSelector);

  const isAdmin = role === ROLES.ADMIN;
  const isUser = role === ROLES.USER;

  const hasRole = (roles: RoleType | RoleType[]): boolean => {
    if (!role) return false;
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.includes(role as RoleType);
  };

  const isRole = (targetRole: RoleType): boolean => role === targetRole;

  const finalConfig = useMemo(() => ({ ...DEFAULT_RESOURCE_CONFIG, ...config }), [config]);

  const canView = finalConfig.view ? hasRole(finalConfig.view) : true;
  const canCreate = finalConfig.create ? hasRole(finalConfig.create) : false;
  const canEdit = finalConfig.edit ? hasRole(finalConfig.edit) : false;
  const canDelete = finalConfig.delete ? hasRole(finalConfig.delete) : false;
  const canExport = finalConfig.export ? hasRole(finalConfig.export) : false;
  const canAudit = finalConfig.audit ? hasRole(finalConfig.audit) : false;

  return {
    role,
    isAdmin,
    isUser,
    hasRole,
    isRole,
    canView,
    canCreate,
    canEdit,
    canDelete,
    canExport,
    canAudit,
  };
}
