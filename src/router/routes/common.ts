import type { RouteRecordRaw } from 'vue-router';
import Layout from '@/layout/index.vue';

/**
 * 公共路由（所有登录用户可访问）
 */
export const commonRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          // 配置卡片型骨架屏，适用于首页卡片布局
          skeleton: {
            type: 'card',
            props: {
              count: 4,
              rows: 3,
              columns: 2,
            },
          },
        },
      },
    ],
  },
];
