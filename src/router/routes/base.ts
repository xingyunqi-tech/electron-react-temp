import type { RouteRecordRaw } from 'vue-router';
import { LoginSkeleton } from '@/components/Skeleton';

/**
 * 基础路由（不需要权限）
 */
export const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      // 配置自定义骨架屏组件
      skeleton: {
        component: LoginSkeleton,
      },
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/register/index.vue'),
    meta: {
      title: '注册',
      // 注册页面使用与登录页相同的骨架屏
      skeleton: {
        component: LoginSkeleton,
      },
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404.vue'),
    meta: { title: '404' },
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/403.vue'),
    meta: { title: '无权限' },
  },
];
