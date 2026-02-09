<template>
  <div class="login-skeleton">
    <!-- Logo 头部骨架 -->
    <div class="login-skeleton__header">
      <el-skeleton-item variant="image" style="width: 53px; height: 53px; border-radius: 4px" />
      <div class="login-skeleton__header-text">
        <el-skeleton-item variant="h1" style="width: 180px; height: 24px; margin-bottom: 6px" />
        <el-skeleton-item variant="h1" style="width: 280px; height: 24px" />
      </div>
    </div>

    <!-- 主内容骨架 -->
    <div class="login-skeleton__content">
      <!-- 左侧二维码区域骨架 -->
      <div class="login-skeleton__qr">
        <el-skeleton-item variant="image" style="width: 200px; height: 200px; border-radius: 8px" />
        <el-skeleton-item variant="text" style="width: 120px; height: 16px; margin-top: 16px" />
      </div>

      <!-- 分割线 -->
      <div class="login-skeleton__divider"></div>

      <!-- 右侧表单区域骨架 -->
      <div class="login-skeleton__form">
        <!-- 标题 -->
        <el-skeleton-item variant="h1" style="width: 160px; height: 50px; margin-bottom: 36px" />

        <!-- 表单项 -->
        <div class="login-skeleton__form-items">
          <el-skeleton-item variant="text" style="width: 100%; height: 48px; margin-bottom: 20px; border-radius: 6px" />
          <el-skeleton-item variant="text" style="width: 100%; height: 48px; margin-bottom: 20px; border-radius: 6px" />
          <el-skeleton-item variant="button" style="width: 100%; height: 48px; border-radius: 6px" />
        </div>

        <!-- 注册链接 -->
        <el-skeleton-item variant="text" style="width: 80px; height: 20px; margin-top: 8px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * LoginSkeleton 登录页骨架屏组件
 * 自定义骨架屏，完全模拟 Login 页面布局
 *
 * 用于 Login 页面加载时的占位显示
 * 与真实 Login 页面布局完全一致
 */
</script>

<style scoped lang="scss">
.login-skeleton {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: url('@/assets/images/login/background.png') no-repeat center;
  background-size: cover;

  /**
   * Logo 头部骨架
   * 位置与真实 Login 页面的 .logo-header 一致
   */
  &__header {
    display: flex;
    position: absolute;
    z-index: 10;
    top: 20px;
    left: 20px;
    gap: 12px;
  }

  &__header-text {
    display: flex;
    flex-direction: column;
  }

  /**
   * 主内容骨架
   * 位置与真实 Login 页面的 .main-content 一致
   */
  &__content {
    display: flex;
    position: absolute;
    z-index: 10;
    top: 50%;
    right: 100px;
    transform: translateY(-50%);
    border-radius: 20px;
    background: rgb(255 255 255 / 0.9);
    box-shadow: 0 20px 40px rgb(0 0 0 / 0.1);
    backdrop-filter: blur(16.2px);
  }

  /**
   * 左侧二维码区域
   * 与真实 Login 页面的 .qr-section 一致
   */
  &__qr {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 425px;
    padding: 50px 70px;
  }

  /**
   * 分割线
   * 与真实 Login 页面的 .divider 一致
   */
  &__divider {
    width: 0.5px;
    background: var(--colorSplit);
  }

  /**
   * 右侧表单区域
   * 与真实 Login 页面的 .form-section 一致
   */
  &__form {
    display: flex;
    flex-direction: column;
    min-width: 440px;
    padding: 50px 60px;
  }

  &__form-items {
    display: flex;
    flex-direction: column;
  }
}
</style>
