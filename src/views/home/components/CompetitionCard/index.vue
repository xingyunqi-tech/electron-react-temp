<template>
  <div class="competition-card">
    <LazyImage :src="backgroundImage" alt="竞赛背景" width="1668px" height="938px" fit="cover" :show-loading="false" :show-default-error="false" class="background-image" />

    <h2 class="card-title">{{ title }}</h2>

    <div class="gradient-overlay"></div>

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
  </div>
</template>

<script setup lang="ts">
import backgroundImage from '@/assets/images/home/competition-bg.png';
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
  title: 'AI 赋能未来\n全国生命科学大赛',
  noticeText: '您报名了xxx竞赛，当前老师已审核请认真备赛，期待您的表现!',
  stats: () => [
    { id: '1', value: '4项', label: '当前开放报名比赛' },
    { id: '2', value: '1项', label: '您已报名参加比赛' },
  ],
  buttonText: '报名管理',
});

const emit = defineEmits<Emits>();

// ==================== 方法定义 ====================
const handleManageClick = (): void => {
  emit('manage-click');
};
</script>

<style scoped lang="scss">
.competition-card {
  position: relative;
  box-sizing: border-box;
  width: 1155px;
  height: 804px;
  overflow: hidden;
  border-radius: 12px;
  background: linear-gradient(180deg, rgb(255 255 255 / 1) 0%, rgb(247 250 254 / 1) 100%);

  .background-image {
    position: absolute;
    top: -47px;
    left: -228px;
    width: 1668px;
    height: 938px;
    pointer-events: none;
    object-fit: cover;
  }

  .card-title {
    position: relative;
    z-index: 1;
    margin: 29px 0 0 48px;
    color: var(--colorTextHeading);
    font-family: 'Dotted Songti Circle', 'PingFang SC', sans-serif;
    font-size: 93px;
    font-weight: 500;
    line-height: 1.215;
    white-space: pre-line;
  }

  .gradient-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 1153px;
    height: 252px;
    background: linear-gradient(180deg, rgb(255 255 255 / 0) 6%, rgb(255 255 255 / 1) 42%);
    pointer-events: none;
  }

  .notice-text {
    position: absolute;
    z-index: 1;
    bottom: 46px;
    left: 35px;
    margin: 0;
    color: rgb(0 0 0 / 0.5);
    font-family: 'PingFang SC', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
  }

  .stats-container {
    display: flex;
    position: absolute;
    z-index: 1;
    bottom: 143px;
    left: 35px;
    gap: 20px;
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
    position: absolute;
    z-index: 1;
    right: 133px;
    bottom: 52px;
    align-items: center;
    justify-content: center;
    width: 100px;
    padding: 6px 16px;
    transition: all 0.3s ease;
    border: 1px solid #ff6e71;
    border-radius: 35px;
    background: #ffede9;
    color: var(--colorTextHeading);
    font-family: 'PingFang SC', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    cursor: pointer;

    &:hover {
      transform: translateY(-1px);
      background: rgb(255 237 233 / 0.8);
    }

    &:active {
      transform: translateY(0);
    }
  }
}
</style>
