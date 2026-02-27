import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import { LoginSkeleton } from '@/components/Skeleton';

const Login = lazy(() => import('@/views/Login/index'));
const Forbidden = lazy(() => import('@/views/Forbidden/index'));

/**
 * 基础路由（不需要权限）
 */
export const baseRoutes: RouteObject[] = [
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoginSkeleton />}>
        <Login />
      </Suspense>
    ),
    handle: { title: '登录' },
  },
  {
    path: '/403',
    element: (
      <Suspense fallback={null}>
        <Forbidden />
      </Suspense>
    ),
    handle: { title: '无权限' },
  },
];
