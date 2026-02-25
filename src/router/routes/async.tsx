import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import type { RouteConfig } from '@/store/modules/permission';
import type { RouteMeta } from '../../../typings/router';

const SettingLayout = lazy(() => import('@/views/Setting/index'));
const SettingFrontend = lazy(() => import('@/views/Setting/frontend'));
const SettingTheme = lazy(() => import('@/views/Setting/theme'));

/**
 * 异步路由（需要权限）
 */
export const asyncRoutes: RouteObject[] = [
  {
    path: 'setting',
    element: <SettingLayout />,
    handle: {
      title: '设置',
      layout: { header: { nav: false } },
    },
    children: [
      {
        index: true,
        element: <Navigate to="frontend" replace />,
      },
      {
        path: 'frontend',
        element: <SettingFrontend />,
        handle: { title: '前端配置', layout: { header: { nav: false } } },
      },
      {
        path: 'theme',
        element: <SettingTheme />,
        handle: { title: '主题配置', layout: { header: { nav: false } } },
      },
    ],
  },
];

function toRouteMetas(routes: RouteObject[]): RouteConfig[] {
  return routes
    .filter(route => route.path !== undefined)
    .map(({ path, handle, children }) => ({
      path: path!,
      meta: handle as RouteMeta | undefined,
      children: children ? toRouteMetas(children) : undefined,
    }));
}

export const asyncRouteMetas = toRouteMetas(asyncRoutes);
