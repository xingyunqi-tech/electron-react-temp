<template>
  <div class="login-input-container">
    <!-- 用户类型切换 -->
    <div class="user-type-tabs">
      <div class="tab-item" :class="{ active: loginType === 'student' }" @click="loginType = 'student'">学生登录</div>
      <div class="tab-item" :class="{ active: loginType === 'teacher' }" @click="loginType = 'teacher'">教师登录</div>
    </div>

    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form" @keyup.enter="handleLogin">
      <el-form-item prop="username">
        <BaseInput
          v-model="loginForm.username"
          :label="loginType === 'student' ? '学号' : '工号'"
          :placeholder="loginType === 'student' ? '请输入学号' : '请输入工号'"
        />
      </el-form-item>

      <el-form-item prop="password">
        <BaseInput v-model="loginForm.password" label="密码" type="password" placeholder="请输入密码" />
      </el-form-item>

      <!-- 用户协议和登录按钮区域 -->
      <div class="form-actions">
        <el-checkbox v-model="agreedToTerms" class="agreement-checkbox">我已阅读并同意《用户协议》</el-checkbox>

        <el-button type="primary" class="login-btn" :loading="loading" @click="handleLogin">立即登录</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import BaseInput from '@/components/BaseInput/index.vue';
import { useUserStore } from '@/store';
import type { UserType } from '@/store/modules/user';

const userStore = useUserStore();

// emits类型
interface LoginInputEmits {
  /** 登录成功事件 */
  (e: 'login-success', token: string): void;
  /** 登录失败事件 */
  (e: 'login-error', error: Error): void;
}

// emits定义
const emit = defineEmits<LoginInputEmits>();

// 响应式数据
const loginFormRef = ref<FormInstance>();
const loading = ref(false);
const agreedToTerms = ref(false);
const loginType = ref<UserType>('student');

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
});

// 表单验证规则
const loginRules: FormRules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};

// 处理账号密码登录
const handleLogin = async () => {
  if (!loginFormRef.value) return;

  if (!agreedToTerms.value) {
    ElMessage.warning('请先阅读并同意用户协议');
    return;
  }

  try {
    await loginFormRef.value.validate();
    loading.value = true;

    let token: string;

    if (loginType.value === 'teacher') {
      token = await userStore.teacherLoginAction({
        username: loginForm.username.trim(),
        password: loginForm.password,
      });
    } else {
      token = await userStore.studentLoginAction({
        username: loginForm.username.trim(),
        password: loginForm.password,
      });
    }

    emit('login-success', token);
    ElMessage.success('登录成功！');
  } catch (error: any) {
    emit('login-error', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.login-input-container {
  width: 440px;
}

.user-type-tabs {
  display: flex;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--colorBorder);

  .tab-item {
    flex: 1;
    padding: 12px 0;
    transition: all 0.3s ease;
    border-bottom: 2px solid transparent;
    color: var(--colorTextSecondary);
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    cursor: pointer;

    &:hover {
      color: var(--colorPrimary);
    }

    &.active {
      border-bottom-color: var(--colorPrimary);
      color: var(--colorPrimary);
    }
  }
}

.login-form {
  :deep(.el-form-item) {
    margin-bottom: 36px;
  }
}

.form-actions {
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  .agreement-checkbox {
    height: 16px;

    :deep(.el-checkbox__input) {
      .el-checkbox__inner {
        width: 14px;
        height: 14px;
        border-radius: 2px;
        border-color: var(--colorPrimary);
        background: var(--colorBgContainer);

        &::after {
          border-width: 1px;
          border-color: var(--colorBgContainer);
        }
      }

      &.is-checked .el-checkbox__inner {
        border-color: var(--colorPrimary);
        background: var(--colorPrimary);
      }
    }

    :deep(.el-checkbox__label) {
      color: var(--colorTextHeading);
      font-size: 12px;
      font-weight: 500;
      line-height: 1.4;
    }
  }

  .login-btn {
    width: 100%;
    height: 48px;
    margin-top: 12px;
    transition: all 0.3s ease;
    border: none;
    border-radius: 6px;
    background: linear-gradient(92deg, var(--cyan-2) 0%, var(--blue-4) 100%);
    box-shadow: inset 0 -2px 0 0 var(--colorFillContent);
    color: var(--colorTextLight);
    font-size: 16px;
    font-weight: 500;
    line-height: 1.4;
    backdrop-filter: blur(43.4px);

    &:hover {
      transform: translateY(-1px);
      box-shadow:
        inset 0 -2px 0 0 var(--colorFillContent),
        0 4px 12px var(--colorPrimaryBorder);
    }

    &:active {
      transform: translateY(0);
    }

    &.is-loading {
      opacity: 0.8;
    }
  }
}
</style>
