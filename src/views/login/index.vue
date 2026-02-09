<template>
  <div class="login-container">
    <!-- Logo 头部 -->
    <div class="logo-header">
      <img src="@/assets/images/common/logo.png" alt="Logo" class="logo-image" />
      <div class="logo-text">
        <h1 class="logo-text-title">生命科学学院</h1>
        <h1 class="logo-text-title">实验教学示范中心管理平台</h1>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <div class="form-section">
        <h2 class="form-title">登录账号</h2>

        <LoginInput @login-success="handleLoginSuccess" @login-error="handleLoginError" />

        <div class="register-link">
          <a class="register-link-text" href="#" @click="handleRegister">注册账号</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store';
import LoginInput from './components/LoginInput/index.vue';

// 路由和store
const router = useRouter();
const userStore = useUserStore();

// 处理登录成功
const handleLoginSuccess = (_token: string) => {
  // 跳转到首页
  router.push('/home');
};

// 处理登录失败
const handleLoginError = (error: Error) => {
  // 显示具体的错误信息
  console.error('登录失败:', error);
};

// 处理注册
const handleRegister = (e: Event) => {
  e.preventDefault();
  router.push('/register');
};
</script>

<style scoped lang="scss">
.login-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: url('@/assets/images/login/background.png') no-repeat center;
  background-size: cover;
}

// Logo 头部
.logo-header {
  display: flex;
  position: absolute;
  z-index: 10;
  top: 20px;
  left: 20px;
  gap: 12px;

  .logo-image {
    width: 53px;
    height: 53px;
    object-fit: cover;
  }

  .logo-text {
    .logo-text-title {
      margin: 0;
      color: var(--colorTextHeading);
      font-size: 18px;
      font-weight: 500;
      line-height: 1.32;
    }
  }
}

// 主内容区域
.main-content {
  display: flex;
  position: absolute;
  z-index: 10;
  top: 50%;
  right: 100px;
  transform: translateY(-50%);
  border-radius: 20px;
  background: rgb(255 255 255 / 0.8);
  box-shadow: 0 20px 40px rgb(0 0 0 / 0.1);
  backdrop-filter: blur(16.2px);
}

// 表单区域
.form-section {
  display: flex;
  flex-direction: column;
  min-width: 440px;
  padding: 50px 60px;
}

.form-title {
  margin: 0 0 36px;
  color: var(--colorTextHeading);
  font-size: 40px;
  font-weight: 600;
  line-height: 1.25;
}

.register-link {
  margin-top: 8px;
  text-align: left;

  .register-link-text {
    transition: color 0.3s ease;
    color: var(--colorPrimary);
    font-size: 14px;
    font-weight: 400;
    line-height: 1.4;
    text-decoration: none;

    &:hover {
      color: var(--colorPrimaryHover);
      text-decoration: underline;
    }
  }
}
</style>
