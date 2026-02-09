import { createRouter, createWebHistory } from 'vue-router';
import { setupRouterGuard } from './guards';
import { baseRoutes, commonRoutes } from './routes';

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    ...baseRoutes,
    ...commonRoutes,
    // 异步路由会在登录后根据权限动态添加
  ],
});

// 设置路由守卫
setupRouterGuard(router);

export default router;
