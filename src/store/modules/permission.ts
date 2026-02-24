import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RouteMeta } from '../../../typings/router';
import { createSelector } from 'reselect';

export const NAMESPACE = 'permission' as const;

/**
 * 路由配置类型
 */
export interface RouteConfig {
  path: string;
  meta?: RouteMeta;
  children?: RouteConfig[];
}

interface PermissionState {
  routes: RouteConfig[];
  isRoutesGenerated: boolean;
}

const initialState: PermissionState = {
  routes: [],
  isRoutesGenerated: false,
};

/**
 * 检查是否有路由访问权限
 */
const hasRoutePermission = (userRoles: string[], route: RouteConfig): boolean => {
  const routeRoles = route.meta?.roles;
  if (!routeRoles || routeRoles.length === 0) {
    return true;
  }
  return userRoles.some(role => routeRoles.includes(role));
};

/**
 * 根据角色过滤路由
 */
const filterRoutesByRoles = (routes: RouteConfig[], roles: string[]): RouteConfig[] => {
  const result: RouteConfig[] = [];

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

const permissionSlice = createSlice({
  name: NAMESPACE,
  initialState,
  reducers: {
    /** 生成权限路由 */
    generateRoutesAction(state, action: PayloadAction<{ asyncRoutes: RouteConfig[]; roles: string[] }>) {
      const { asyncRoutes, roles } = action.payload;
      state.routes = filterRoutesByRoles(asyncRoutes, roles);
      state.isRoutesGenerated = true;
    },
    /** 重置权限路由 */
    resetPermissionAction() {
      return { ...initialState };
    },
  },
});

// ==================== Actions ====================

export const { generateRoutesAction, resetPermissionAction } = permissionSlice.actions;

// ==================== Selectors ====================

/** permission状态 */
export const permissionRootSelector = (state: { [NAMESPACE]: PermissionState }) => state[NAMESPACE];

/** 路由权限 */
export const permissionRoutesSelector = createSelector(permissionRootSelector, state => {
  return state.routes;
});
/** 权限路由是否生成 */
export const isRoutesGeneratedSelector = createSelector(permissionRootSelector, state => {
  return state.isRoutesGenerated;
});

// ==================== Reducer ====================

export default permissionSlice.reducer;
