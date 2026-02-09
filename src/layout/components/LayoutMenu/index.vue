<template>
  <div class="layout-menu">
    <div class="side-menu">
      <div
        v-for="item in menuItems"
        :key="item.key"
        class="menu-item"
        :class="{ active: activeMenu === item.key, disabled: item.disabled }"
        :title="item.title"
        @click="handleMenuClick(item)"
      >
        <el-icon>
          <component :is="item.icon" />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { PieChart, Calendar, UserFilled, Medal, FirstAidKit, Document } from '@element-plus/icons-vue';
import { useUserStore } from '@/store/modules/user';
import { ROLES } from '@/constants/roles';

interface MenuItem {
  key: string;
  title: string;
  icon: Component;
  path: string;
  disabled?: boolean;
  roles?: string[]; // 允许访问的角色，不填则所有角色可见
}

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// 教师/管理员菜单
const teacherMenuItems: MenuItem[] = [
  {
    key: 'home',
    title: '首页',
    icon: PieChart,
    path: '/home',
    disabled: false,
  },
];

// 学生菜单
const studentMenuItems: MenuItem[] = [
  {
    key: 'home',
    title: '首页',
    icon: PieChart,
    path: '/home',
    disabled: false,
  },
];

// 根据用户角色获取菜单（过滤掉禁用的菜单项）
const menuItems = computed(() => {
  const role = userStore.userInfo?.role;
  const items = role === ROLES.STUDENT ? studentMenuItems : teacherMenuItems;
  // 隐藏禁用的菜单项
  return items.filter(item => !item.disabled);
});

// 根据当前路由自动设置激活菜单
const activeMenu = computed(() => {
  const currentPath = route.path;
  const activeItem = menuItems.value.find(item => currentPath.startsWith(item.path));
  return activeItem?.key || 'home';
});

const handleMenuClick = (item: MenuItem) => {
  if (item.disabled) {
    return;
  }
  router.push(item.path);
};
</script>

<style scoped lang="scss">
.layout-menu {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.side-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 45px;
  padding: 4px;
  border-radius: 100px;
  gap: 4px;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  transition: all 0.3s ease;
  border-radius: 50%;
  cursor: pointer;

  .el-icon {
    color: #000;
    font-size: 18px;
  }

  &:hover:not(.disabled) {
    background-color: #f5f7fa;
  }

  &.active {
    background-color: #3dd7e3;

    .el-icon {
      color: #fff;
    }
  }

  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;

    .el-icon {
      color: #999;
    }
  }
}
</style>
