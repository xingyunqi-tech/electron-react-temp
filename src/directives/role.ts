import type { Directive, DirectiveBinding } from 'vue';
import { useUserStore } from '@/store/modules/user';

/**
 * 角色权限指令
 * @example <div v-role="'admin'">删除</div>
 * @example <div v-role="['admin', 'teacher']">编辑</div>
 */
export const role: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;

    if (!value) {
      return;
    }

    const userStore = useUserStore();
    const userRoles = userStore.role ? [userStore.role] : [];
    const requiredRoles = Array.isArray(value) ? value : [value];

    // 检查权限
    const hasRole = userRoles.some((role: string) => requiredRoles.includes(role));

    if (!hasRole) {
      el.parentNode?.removeChild(el);
    }
  },
};
