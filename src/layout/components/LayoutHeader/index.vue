<template>
  <header class="layout-header">
    <!-- 左侧Logo区域 -->
    <div class="header-left">
      <div class="logo" @click="handleLogoClick">
        <LogoIcon v-if="headerVisible.logoIcon" />
        <LogoTitle v-if="headerVisible.logoTitle" :title="logoTitle" />
      </div>
    </div>

    <!-- 中间菜单区域 -->
    <div class="header-center">
      <nav class="menu-nav">
        <slot name="menu">
          <!-- 默认菜单可以在这里添加，或者通过slot传入 -->
        </slot>
      </nav>
    </div>

    <!-- 右侧工具栏 -->
    <div class="header-right">
      <!-- 主题切换 -->
      <ThemeSwitcher v-if="headerVisible.themeSwitch" />

      <!-- 语言切换 -->
      <LanguageSwitcher v-if="headerVisible.localeSwitch" />

      <!-- 设置按钮 -->
      <SettingButton v-if="headerVisible.setting && globalStore.advanceMode" />

      <!-- 用户头像 -->
      <HeaderAvatar v-if="headerVisible.avatar" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useGlobalStore } from '@/store/modules/global';
import LogoIcon from '../LogoIcon/index.vue';
import LogoTitle from '../LogoTitle/index.vue';
import SettingButton from '../SettingButton/index.vue';
import LanguageSwitcher from '../LanguageSwitcher/index.vue';
import ThemeSwitcher from '../ThemeSwitcher/index.vue';
import HeaderAvatar from '../HeaderAvatar/index.vue';
import { useHeaderControl } from '../../useLayoutContext.ts';

const router = useRouter();
const globalStore = useGlobalStore();

// 获取布局可见性状态
const { headerVisible } = useHeaderControl();

interface Props {
  logoTitle?: string;
}

withDefaults(defineProps<Props>(), {
  logoTitle: '',
});

const handleLogoClick = () => {
  router.push('/');
  globalStore.handleLogoClick((isEnabled: boolean) => {
    if (isEnabled) {
      ElMessage.success('高级模式已开启');
    } else {
      ElMessage.info('高级模式已关闭');
    }
  });
};
</script>

<style scoped lang="scss">
.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 103px;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  transition: opacity 0.3s ease;
  cursor: pointer;
  gap: 8px;

  &:hover {
    opacity: 0.8;
  }
}

.header-center {
  display: flex;
  flex: 1;
  justify-content: center;
  padding: 0 24px;
}

.menu-nav {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
</style>
