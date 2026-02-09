<template>
  <div class="layout-skeleton">
    <!-- Header 头部骨架 -->
    <div class="layout-skeleton__header">
      <!-- 左侧 Logo 骨架 -->
      <el-skeleton-item variant="text" style="width: 120px; height: 40px" />

      <!-- 中间占位 -->
      <div class="layout-skeleton__header-center"></div>

      <!-- 右侧工具栏骨架 -->
      <div class="layout-skeleton__header-right">
        <el-skeleton-item variant="circle" style="width: 24px; height: 24px" />
        <el-skeleton-item variant="circle" style="width: 24px; height: 24px" />
        <el-skeleton-item variant="circle" style="width: 40px; height: 40px" />
      </div>
    </div>

    <!-- 左侧菜单骨架 -->
    <div class="layout-skeleton__nav">
      <el-skeleton-item
        v-for="i in menuItems"
        :key="i"
        variant="circle"
        style="width: 45px; height: 45px; margin-bottom: 4px"
      />
    </div>

    <!-- 主体内容骨架 -->
    <div class="layout-skeleton__main">
      <div class="layout-skeleton__cards">
        <el-skeleton v-for="i in cardCount" :key="i" :rows="cardRows" animated class="layout-skeleton__card">
          <template #template>
            <el-skeleton-item variant="h3" style="width: 60%" />
            <div style="margin: 16px 0">
              <el-skeleton-item
                v-for="j in cardRows"
                :key="j"
                variant="text"
                :style="{ width: j === cardRows ? '80%' : '100%', marginBottom: '8px' }"
              />
            </div>
            <el-skeleton-item variant="text" style="width: 80px" />
          </template>
        </el-skeleton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * LayoutSkeleton Layout 骨架屏组件
 * 基于 Element Plus el-skeleton-item 组件
 *
 * 用于应用初始化、Layout 组件加载时的整体加载状态
 * 完全独立的骨架屏组件，不依赖其他骨架屏组件
 *
 * Props 类型定义同步于 @/interface/skeleton.ts LayoutSkeletonProps
 */
interface Props {
  /** 左侧菜单项数量 */
  menuItems?: number;
  /** 主体内容卡片数量 */
  cardCount?: number;
  /** 每个卡片的行数 */
  cardRows?: number;
}

withDefaults(defineProps<Props>(), {
  menuItems: 6,
  cardCount: 4,
  cardRows: 3,
});
</script>

<style scoped lang="scss">
.layout-skeleton {
  /**
   * 使用与 Layout 完全相同的 Grid 布局
   * grid-template: 'header header' auto 'nav main' 1fr / auto 1fr
   */
  display: grid;
  grid-template:
    'header header' auto
    'nav main' 1fr / auto 1fr;
  height: 100vh;
  background: var(--colorBgLayout);

  /**
   * Header 区域
   * 高度必须与 LayoutHeader 一致: 103px
   */
  &__header {
    display: flex;
    grid-area: header;
    align-items: center;
    height: 103px;
    padding: 0 20px;
    border-bottom: 1px solid var(--colorBorderSecondary);
    background: var(--colorBgContainer);
    gap: 24px;
  }

  &__header-center {
    flex: 1;
  }

  &__header-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  /**
   * Nav 区域 (左侧菜单)
   * 宽度必须与 LayoutMenu 一致: 45px + padding 40px = 85px
   */
  &__nav {
    display: flex;
    grid-area: nav;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 45px;
    padding: 0 20px;
    border-right: 1px solid var(--colorBorderSecondary);
    background: var(--colorBgContainer);
  }

  /**
   * Main 区域 (主体内容)
   */
  &__main {
    grid-area: main;
    overflow: auto;
  }

  /**
   * 卡片容器
   */
  &__cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    padding: 20px;
  }

  /**
   * 单个卡片
   */
  &__card {
    padding: 20px;
    border: 1px solid var(--colorBorderSecondary);
    border-radius: 8px;
    background: var(--colorBgContainer);
  }
}
</style>
