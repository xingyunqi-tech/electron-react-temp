<template>
  <div class="register-container">
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
      <!-- 注册表单区域 -->
      <div class="form-section">
        <h2 class="form-title">注册账号</h2>

        <RegisterInput @register-success="handleRegisterSuccess" @register-error="handleRegisterError" />

        <div class="login-link">
          <span class="login-link-text">已有账号？</span>
          <a class="login-link-anchor" href="#" @click="handleGoToLogin">立即登录</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import RegisterInput from './components/RegisterInput/index.vue';

// 路由
const router = useRouter();

// 处理注册成功
const handleRegisterSuccess = () => {
  ElMessage.success('注册成功！请登录');
  // 跳转到登录页
  router.push('/login');
};

// 处理注册失败
const handleRegisterError = (error: Error) => {
  console.error('注册失败:', error);
};

// 跳转到登录页
const handleGoToLogin = (e: Event) => {
  e.preventDefault();
  router.push('/login');
};
</script>

<style scoped lang="scss">
.register-container {
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
  right: 230px;
  transform: translateY(-50%);
  border-radius: 20px;
  background: rgb(255 255 255 / 0.8);
  box-shadow: 0 20px 40px rgb(0 0 0 / 0.1);
  backdrop-filter: blur(12.4px);
}

// 表单区域
.form-section {
  display: flex;
  flex-direction: column;
  width: 500px;
  padding: 30px 40px;
}

.form-title {
  margin: 0 0 20px;
  color: var(--colorTextHeading);
  font-size: 32px;
  font-weight: 600;
  line-height: 1.25;
}

.login-link {
  margin-top: 8px;
  text-align: left;

  .login-link-text {
    margin-right: 8px;
    color: var(--colorTextSecondary);
    font-size: 13px;
    font-weight: 400;
    line-height: 1.4;
  }

  .login-link-anchor {
    transition: color 0.3s ease;
    color: var(--colorPrimary);
    font-size: 13px;
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
