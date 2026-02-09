<template>
  <el-dropdown @command="handleCommand">
    <div class="user-info">
      <el-avatar :size="46">
        <el-icon><User /></el-icon>
      </el-avatar>
      <div class="user-details">
        <span class="username">{{ userStore.realName || $t('layout.admin') }}</span>
        <el-icon class="arrow-icon"><ArrowDown /></el-icon>
      </div>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="logout">
          <el-icon><SwitchButton /></el-icon>
          {{ $t('layout.logout') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { User, ArrowDown, SwitchButton } from '@element-plus/icons-vue';
import { useUserStore, usePermissionStore } from '@/store';
import { useI18n } from 'vue-i18n';

// 路由和store
const router = useRouter();
const userStore = useUserStore();
const permissionStore = usePermissionStore();
const { t: $t } = useI18n();

// 处理下拉菜单命令
const handleCommand = async (command: string) => {
  switch (command) {
    case 'logout':
      await ElMessageBox.confirm($t('layout.logoutConfirm'), $t('layout.tip'), {
        confirmButtonText: $t('common.confirm'),
        cancelButtonText: $t('common.cancel'),
        type: 'warning',
      })
        .then(async () => {
          // 执行退出登录
          await userStore.logoutAction();
          // 重置权限路由
          permissionStore.resetPermission();
          ElMessage.success($t('layout.logoutSuccess'));
          router.push('/login');
        })
        .catch(() => {
          // 用户取消操作
        });
      break;
  }
};
</script>

<style scoped lang="scss">
.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;

  &:focus-visible {
    outline: none;
  }

  &:hover {
    .arrow-icon {
      transform: rotate(180deg);
    }
  }

  .user-details {
    display: flex;
    align-items: center;
    padding: 20px 12px;
    transform: translateX(-10px);
    border-radius: 100px;
    background-color: var(--colorBgContainer);
  }

  .username {
    color: var(--colorText);
    font-size: 14px;
    font-weight: 500;
  }

  .arrow-icon {
    margin-left: 4px;
    transition: transform 0.3s;
    font-size: 14px;
  }
}
</style>
