import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AuthGuard } from './guards';
import { baseRoutes, commonRoutes, asyncRoutes } from './routes';
import { LayoutSkeleton } from '@/components/Skeleton';

const Layout = lazy(() => import('@/layout/index'));
const NotFound = lazy(() => import('@/views/NotFound/index'));

/**
 * 路由配置
 *
 * 结构：
 * - baseRoutes: 不需要登录的独立页面（login, register, 404, 403）
 * - /: 需要登录的主布局，包含 commonRoutes + asyncRoutes
 */
const router = createBrowserRouter([
  // 基础路由（不需要权限）
  ...baseRoutes,

  // 主布局路由（需要登录）
  {
    path: '/',
    element: (
      <AuthGuard>
        <Suspense fallback={<LayoutSkeleton />}>
          <Layout />
        </Suspense>
      </AuthGuard>
    ),
    children: [...commonRoutes, ...asyncRoutes],
  },

  // 未匹配路由 → 404
  {
    path: '*',
    element: (
      <Suspense fallback={null}>
        <NotFound />
      </Suspense>
    ),
  },
]);

export default router;
