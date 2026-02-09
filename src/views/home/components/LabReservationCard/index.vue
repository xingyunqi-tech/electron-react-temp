<template>
  <div class="lab-reservation-card">
    <h2 class="card-title">{{ title }}</h2>

    <p class="reservation-notice">{{ noticeText }}</p>

    <div class="stats-container">
      <div v-for="stat in stats" :key="stat.id" class="stat-card">
        <p class="stat-value">{{ stat.value }}</p>
        <p class="stat-label">{{ stat.label }}</p>
      </div>
    </div>

    <button class="action-button" @click="handleManageClick">
      {{ buttonText }}
    </button>

    <LazyImage :src="backgroundImage" alt="实验室预约背景" width="310px" height="314px" fit="cover" :show-loading="false" :show-default-error="false" class="background-image" />
  </div>
</template>

<script setup lang="ts">
import backgroundImage from '@/assets/images/home/lab-reservation-bg.png';
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
  /** 预约通知文本 */
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
  title: '实验室预约',
  noticeText: '您预约了今天  16:00-17:00 实验室305(三楼)请按时赴约!',
  stats: () => [
    { id: '1', value: '31人', label: '当前在实验室人数' },
    { id: '2', value: '7间', label: '今日可预约实验室' },
    { id: '3', value: '18间', label: '本周可预约实验室' },
  ],
  buttonText: '预约管理',
});

const emit = defineEmits<Emits>();

// ==================== 方法定义 ====================
const handleManageClick = (): void => {
  emit('manage-click');
};
</script>

<style scoped lang="scss">
.lab-reservation-card {
  position: relative;
  box-sizing: border-box;
  width: 636px;
  height: 328px;
  padding: 19px;
  overflow: hidden;
  border-radius: 12px;
  background: radial-gradient(circle at 30% -54%, rgb(197 251 255 / 1) 0%, rgb(255 255 255 / 1) 100%);

  .card-title {
    margin: 0 0 4px;
    color: var(--colorTextHeading);
    font-family: 'PingFang SC', sans-serif;
    font-size: 24px;
    font-weight: 600;
    line-height: 1.4;
  }

  .reservation-notice {
    margin: 0 0 58px;
    color: rgb(0 0 0 / 0.5);
    font-family: 'PingFang SC', sans-serif;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.4;
  }

  .stats-container {
    display: flex;
    gap: 12px;
    margin-bottom: 79px;
  }

  .stat-card {
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    align-items: center;
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
      text-align: center;
    }
  }

  .action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    padding: 6px 16px;
    transition: all 0.3s ease;
    border: 1px solid #3dd7e3;
    border-radius: 35px;
    background: #e2fdff;
    color: var(--colorTextHeading);
    font-family: 'PingFang SC', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    cursor: pointer;

    &:hover {
      transform: translateY(-1px);
      background: rgb(226 253 255 / 0.8);
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
    height: 314px;
    pointer-events: none;
    object-fit: cover;
  }
}
</style>
