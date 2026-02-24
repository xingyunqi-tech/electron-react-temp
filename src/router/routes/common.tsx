import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

const Home = lazy(() => import('@/views/Home/index'));

/**
 * 公共路由（所有登录用户可访问）
 */
export const commonRoutes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="/home" replace />,
  },
  {
    path: 'home',
    element: <Home />,
    handle: { title: '首页' },
  },
];
