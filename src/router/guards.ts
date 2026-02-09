import type { Router } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { usePermissionStore } from '@/store/modules/permission';
import { ElMessage } from 'element-plus';
import { asyncRoutes } from './routes';

/**
 * 路由白名单
 */
const WHITE_LIST = ['/register', '/login', '/404', '/403'];

/**
 * 设置路由守卫
 *
 * 守卫执行流程：
 * 1. 白名单检查 → 直接放行
 * 2. 登录状态检查 → 未登录跳转登录页
 * 3. 路由生成检查 → 已生成直接放行
 * 4. 权限路由生成 → 获取用户信息 → 过滤路由 → 动态添加 → 重新导航
 *
 * @param router - Vue Router 实例
 */
export function setupRouterGuard(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    const userStore = useUserStore();
    const permissionStore = usePermissionStore();

    // ==================== 1. 白名单检查 ====================
    // 白名单路由无需登录即可访问，直接放行
    if (WHITE_LIST.includes(to.path)) {
      next();
      return;
    }

    // ==================== 2. 登录状态检查 ====================
    // 检查用户是否已登录（token是否存在）
    if (!userStore.token) {
      // 未登录，跳转到登录页，并记录当前路径以便登录后重定向
      next({ path: '/login', query: { redirect: to.fullPath } });
      return;
    }

    // ==================== 3. 登录后访问登录页的处理 ====================
    // 已登录用户访问登录页，直接跳转到首页
    if (to.path === '/login') {
      next('/home');
      return;
    }

    // ==================== 4. 路由生成状态检查 ====================
    // 如果权限路由已经生成过，直接放行
    // 这样可以避免每次路由跳转都重新生成路由，提升性能
    if (permissionStore.isRoutesGenerated) {
      next();
      return;
    }

    // ==================== 5. 首次访问：生成权限路由 ====================
    try {
      // 5.1 获取用户信息（如果还没有）
      // 优化：只有在 role 或 id 为空时才请求，避免重复请求
      if (!userStore.role || !userStore.id) {
        await userStore.getInfoAction();
      }
      const roles = userStore.role ? [userStore.role] : [];

      // 5.2 校验角色信息
      if (!roles || roles.length === 0) {
        throw new Error('用户角色为空');
      }

      // 5.3 根据用户角色生成可访问的异步路由
      // permissionStore.generateRoutes 会递归过滤 asyncRoutes
      // 只保留用户有权限访问的路由
      const accessRoutes = permissionStore.generateRoutes(asyncRoutes, roles);

      // 5.4 动态添加异步路由到 router 实例
      // 使用 router.addRoute 将过滤后的路由注册到路由表
      accessRoutes.forEach(route => router.addRoute(route));

      // 5.5 重新导航到目标路由
      // 关键：使用 replace: true 替换当前历史记录
      // 原因：
      // - 避免用户点击浏览器后退时回到路由未生成的状态
      // - 确保路由已正确注册后再次执行守卫逻辑（此时会命中第39-42行的已生成检查）
      // - { ...to } 保留原始路由的所有参数（path, query, params 等）
      next({ ...to, replace: true });
    } catch (error) {
      // ==================== 6. 错误处理 ====================
      // 获取权限失败（如网络错误、接口异常、token过期等）
      console.error('获取权限失败:', error);
      ElMessage.error('获取权限失败，请重新登录');

      // 清理用户状态和权限状态
      await userStore.logoutAction();
      permissionStore.resetPermission();

      // 跳转到登录页
      next('/login');
    }
  });
}
