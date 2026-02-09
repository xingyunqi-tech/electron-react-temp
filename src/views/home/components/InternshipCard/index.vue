<template>
  <div class="internship-card">
    <h2 class="card-title">{{ title }}</h2>

    <p class="notice-text">{{ noticeText }}</p>

    <div class="stats-container">
      <div v-for="stat in stats" :key="stat.id" class="stat-card">
        <p class="stat-value">{{ stat.value }}</p>
        <p class="stat-label">{{ stat.label }}</p>
      </div>
    </div>

    <button class="action-button" @click="handleManageClick">
      {{ buttonText }}
    </button>

    <LazyImage :src="backgroundImage" alt="实习背景" width="310px" height="310px" fit="fill" :show-loading="false" :show-default-error="false" class="background-image" />
  </div>
</template>

<script setup lang="ts">
import backgroundImage from '@/assets/images/home/internship-bg-732cfd.png';
import LazyImage from '@/components/LazyImage/index.vue';

// ==================== 接口定义 ====================
interface StatData {
  /** 统计项ID */
  id: string;
  /** 统计数值 */
  value: string;
  /** 统计标签 */
  label: string;
}

interface Props {
  /** 卡片标题 */
  title?: string;
  /** 通知文本 */
  noticeText?: string;
  /** 统计数据 */
  stats?: StatData[];
  /** 按钮文本 */
  buttonText?: string;
}

interface Emits {
  /** 点击管理按钮事件 */
  (e: 'manage-click'): void;
}

// ==================== Props 和 Emits ====================
const props = withDefaults(defineProps<Props>(), {
  title: '实习报名',
  noticeText: '您还没有任何实习报名信息,在实习管理中查看所有可报名企业',
  stats: () => [
    { id: '1', value: '7家', label: '当前可报名实习企业' },
    { id: '2', value: '2家', label: '报名申请已提交' },
    { id: '3', value: '0家', label: '您已报名成功' },
  ],
  buttonText: '实习管理',
});

const emit = defineEmits<Emits>();

// ==================== 方法定义 ====================
const handleManageClick = (): void => {
  emit('manage-click');
};
</script>

<style scoped lang="scss">
.internship-card {
  position: relative;
  box-sizing: border-box;
  width: 636px;
  height: 370px;
  padding: 20px 19px;
  overflow: hidden;
  border-radius: 12px;
  background: radial-gradient(circle at 33% -46%, rgb(197 208 255 / 1) 0%, rgb(255 255 255 / 1) 100%);

  .card-title {
    margin: 0 0 10px 1px;
    color: var(--colorTextHeading);
    font-family: 'PingFang SC', sans-serif;
    font-size: 24px;
    font-weight: 600;
    line-height: 1.4;
  }

  .notice-text {
    margin: 0 0 69px 1px;
    color: rgb(0 0 0 / 0.5);
    font-family: 'PingFang SC', sans-serif;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.4;
  }

  .stats-container {
    display: flex;
    gap: 12px;
    margin-bottom: 67px;
  }

  .stat-card {
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 132px;
    padding: 8px 16px;
    border: 1px solid var(--colorBorderSecondary);
    border-radius: 4px;
    background: var(--colorBgContainer);

    .stat-value {
      width: 100%;
      margin: 0;
      color: rgb(0 0 0 / 0.6);
      font-family: 'PingFang SC', sans-serif;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;
      text-align: left;
    }

    .stat-label {
      margin: 0;
      color: rgb(0 0 0 / 0.7);
      font-family: 'PingFang SC', sans-serif;
      font-size: 12px;
      font-weight: 400;
      line-height: 1.4;
    }
  }

  .action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    padding: 6px 16px;
    transition: all 0.3s ease;
    border: 1px solid #7f8cf3;
    border-radius: 35px;
    background: #e5eaff;
    color: var(--colorTextHeading);
    font-family: 'PingFang SC', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    cursor: pointer;

    &:hover {
      transform: translateY(-1px);
      background: rgb(229 234 255 / 0.8);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .background-image {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 310px;
    height: 310px;
    pointer-events: none;
    object-fit: fill;
  }
}
</style>
