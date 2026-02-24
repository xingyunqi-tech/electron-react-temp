import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { userRootSelector, getInfoAction } from '@/store/modules/user';
import {
  isRoutesGeneratedSelector,
  generateRoutesAction,
  resetPermissionAction,
  permissionRoutesSelector,
} from '@/store/modules/permission';
import type { RouteConfig } from '@/store/modules/permission';
import { asyncRouteMetas } from './routes';
import { message } from '@/components/StaticFunction';
import storage from '@/plugins/storage';

/**
 * 检查路径是否匹配路由配置树中的某条路由
 */
function isPathInRoutes(pathname: string, routes: RouteConfig[], prefix = ''): boolean {
  for (const route of routes) {
    const fullPath = prefix ? `${prefix}/${route.path}` : `/${route.path}`;
    if (pathname === fullPath) return true;
    if (route.children && isPathInRoutes(pathname, route.children, fullPath)) {
      return true;
    }
  }
  return false;
}

/**
 * 权限守卫组件
 *
 * 守卫执行流程：
 * 1. 未登录 → 跳转登录页
 * 2. 权限初始化失败 → 跳转登录页
 * 3. 权限加载中 → 等待
 * 4. 路由权限校验 → 无权限跳转 403
 * 5. 放行
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(userRootSelector);
  const isRoutesGenerated = useAppSelector(isRoutesGeneratedSelector);
  const permittedRoutes = useAppSelector(permissionRoutesSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(false);

  const isLoggedIn = !!storage('localStorage').get('token');
  const currentPath = location.pathname;

  useEffect(() => {
    // 重置错误状态（例如用户重新登录后）
    setAuthError(false);

    if (!isLoggedIn || isRoutesGenerated) {
      return;
    }

    const initPermission = async () => {
      setIsLoading(true);
      try {
        let role = userInfo.role;
        if (!role || !userInfo.id) {
          const info = await dispatch(getInfoAction()).unwrap();
          role = info.role?.name ?? '';
        }

        if (!role) {
          throw new Error('用户角色为空');
        }

        dispatch(generateRoutesAction({ asyncRoutes: asyncRouteMetas, roles: [role] }));
      } catch (error) {
        console.error('获取权限失败:', error);
        message.error('获取权限失败，请重新登录');
        dispatch(resetPermissionAction());
        setAuthError(true);
      } finally {
        setIsLoading(false);
      }
    };

    initPermission();
  }, [currentPath, isLoggedIn, isRoutesGenerated, dispatch, userInfo.role, userInfo.id]);

  // 1. 未登录跳转登录页
  if (!isLoggedIn) {
    const fullPath = currentPath + location.search + location.hash;
    return <Navigate to={`/login?redirect=${encodeURIComponent(fullPath)}`} replace />;
  }

  // 2. 权限初始化失败，跳转登录页
  if (authError) {
    return <Navigate to="/login" replace />;
  }

  // 3. 权限加载中
  if (isLoading || !isRoutesGenerated) {
    return null;
  }

  // 4. 路由级权限校验：若当前路径属于异步路由但不在已授权列表中，跳转 403
  if (isPathInRoutes(currentPath, asyncRouteMetas) && !isPathInRoutes(currentPath, permittedRoutes)) {
    return <Navigate to="/403" replace />;
  }

  // 5. 放行
  return <>{children}</>;
}
