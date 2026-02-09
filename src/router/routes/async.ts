import type { RouteRecordRaw } from 'vue-router';
import Layout from '@/layout/index.vue';
import { ROLES } from '@/constants/roles';

/**
 * 异步路由（需要角色权限）
 */
export const asyncRoutes: RouteRecordRaw[] = [
  // ==================== 管理端路由 ====================

  // 设置页面（仅管理员）
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/frontend',
    meta: {
      title: '设置',
      layout: {
        layout: {
          nav: false,
        },
      },
    },
    children: [
      {
        path: 'frontend',
        name: 'Frontend',
        component: () => import('@/views/setting/frontend.vue'),
        meta: {
          title: '前端配置',
          roles: [ROLES.ADMIN],
        },
      },
      {
        path: 'theme',
        name: 'Theme',
        component: () => import('@/views/setting/theme.vue'),
        meta: {
          title: '主题配置',
          roles: [ROLES.ADMIN],
        },
      },
    ],
  },

  // 404 路由（必须放在最后）
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
];
