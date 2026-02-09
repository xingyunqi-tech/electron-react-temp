<template>
  <div class="welcome-card">
    <p class="welcome-text">{{ welcomeMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// ==================== 接口定义 ====================
interface Props {
  /** 用户名 */
  userName?: string;
  /** 日期 */
  date?: string;
}

// ==================== Props ====================
const props = withDefaults(defineProps<Props>(), {
  userName: '张飞同学',
  date: '2025年9月24日(星期三)',
});

// ==================== 计算属性 ====================
const welcomeMessage = computed(() => {
  return `${props.userName}你好!今天是${props.date}`;
});
</script>

<style scoped lang="scss">
.welcome-card {
  display: flex;
  box-sizing: border-box;
  align-items: center;
  width: 636px;
  height: 66px;
  padding: 17px;
  border-radius: 12px;
  background: linear-gradient(180deg, rgb(225 218 249 / 1) 0%, rgb(255 255 255 / 1) 40%);

  .welcome-text {
    margin: 0;
    color: var(--colorTextHeading);
    font-family: 'PingFang SC', sans-serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.4;
  }
}
</style>
