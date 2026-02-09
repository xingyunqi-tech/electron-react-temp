<template>
  <div class="home-container">
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧列 -->
      <div class="left-column">
        <WelcomeCard :user-name="userName" :date="currentDate" />
        <LabReservationCard :stats="labStats" @manage-click="handleLabManageClick" />
        <InternshipCard :stats="internshipStats" @manage-click="handleInternshipManageClick" />
      </div>

      <!-- 右侧列 -->
      <div class="right-column">
        <CompetitionCard :stats="competitionStats" @manage-click="handleCompetitionManageClick" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import WelcomeCard from './components/WelcomeCard/index.vue';
import LabReservationCard from './components/LabReservationCard/index.vue';
import CompetitionCard from './components/CompetitionCard/index.vue';
import InternshipCard from './components/InternshipCard/index.vue';

// ==================== 响应式数据 ====================
const userName = ref('张飞同学');
const currentDate = ref('2025年9月24日(星期三)');
const labStats = ref([
  { id: '1', value: '31人', label: '当前在实验室人数' },
  { id: '2', value: '7间', label: '今日可预约实验室' },
  { id: '3', value: '18间', label: '本周可预约实验室' },
]);
const competitionStats = ref([
  { id: '1', value: '4项', label: '当前开放报名比赛' },
  { id: '2', value: '1项', label: '您已报名参加比赛' },
]);
const internshipStats = ref([
  { id: '1', value: '7家', label: '当前可报名实习企业' },
  { id: '2', value: '2家', label: '报名申请已提交' },
  { id: '3', value: '0家', label: '您已报名成功' },
]);

// ==================== 异步数据加载 ====================
/**
 * 加载首页数据
 */
const loadHomeData = async () => {
  // TODO: 替换为真实的 API 调用
};

onMounted(() => {
  loadHomeData();
});

// ==================== 方法定义 ====================
const handleLabManageClick = (): void => {
  console.log('跳转到实验室预约管理页面');
  // TODO: 路由跳转到实验室预约管理页面
};

const handleCompetitionManageClick = (): void => {
  console.log('跳转到竞赛报名管理页面');
  // TODO: 路由跳转到竞赛报名管理页面
};

const handleInternshipManageClick = (): void => {
  console.log('跳转到实习报名管理页面');
  // TODO: 路由跳转到实习报名管理页面
};
</script>

<style scoped lang="scss">
.home-container {
  box-sizing: border-box;
  min-height: 100vh;
  padding: 20px;
  background: var(--colorBgLayout);

  .main-content {
    display: flex;
    gap: 20px;
  }

  .left-column {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .right-column {
    flex: 1;
  }
}
</style>
