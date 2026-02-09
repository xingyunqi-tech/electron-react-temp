import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { RouteRecordRaw } from 'vue-router';

/**
 * 权限管理 Store
 */
export const usePermissionStore = defineStore('permission', () => {
  // 状态
  const routes = ref<RouteRecordRaw[]>([]);
  const isRoutesGenerated = ref(false);

  /**
   * 根据角色过滤路由
   */
  const filterRoutesByRoles = (routes: RouteRecordRaw[], roles: string[]): RouteRecordRaw[] => {
    const result: RouteRecordRaw[] = [];

    routes.forEach(route => {
      const routeCopy = { ...route };

      if (hasRoutePermission(roles, routeCopy)) {
        if (routeCopy.children) {
          routeCopy.children = filterRoutesByRoles(routeCopy.children, roles);
        }
        result.push(routeCopy);
      }
    });

    return result;
  };

  /**
   * 检查是否有路由访问权限
   */
  const hasRoutePermission = (userRoles: string[], route: RouteRecordRaw): boolean => {
    const routeRoles = route.meta?.roles as string[] | undefined;

    // 路由未配置 roles，任何人都可访问
    if (!routeRoles || routeRoles.length === 0) {
      return true;
    }

    // 检查用户是否拥有路由要求的任一角色
    return userRoles.some(role => routeRoles.includes(role));
  };

  /**
   * 生成可访问路由
   */
  const generateRoutes = (asyncRoutes: RouteRecordRaw[], roles: string[]): RouteRecordRaw[] => {
    const accessedRoutes = filterRoutesByRoles(asyncRoutes, roles);
    routes.value = accessedRoutes;
    isRoutesGenerated.value = true;
    return accessedRoutes;
  };

  /**
   * 重置权限状态
   */
  const resetPermission = () => {
    routes.value = [];
    isRoutesGenerated.value = false;
  };

  return {
    routes,
    isRoutesGenerated,
    generateRoutes,
    resetPermission,
  };
});
