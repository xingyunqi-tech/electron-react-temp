<template>
  <div class="register-input-container">
    <el-form
      ref="registerFormRef"
      :model="registerForm"
      :rules="registerRules"
      class="register-form"
      @keyup.enter="handleRegister"
    >
      <!-- 姓名 -->
      <el-form-item prop="name">
        <BaseInput v-model="registerForm.name" label="姓名" placeholder="请输入真实姓名" />
      </el-form-item>

      <!-- 学号 -->
      <el-form-item prop="studentNo">
        <BaseInput v-model="registerForm.studentNo" label="学号" placeholder="请输入学号（用于登录）" />
      </el-form-item>

      <!-- 密码 -->
      <el-form-item prop="password">
        <BaseInput v-model="registerForm.password" label="密码" type="password" placeholder="6-20位密码" />
      </el-form-item>

      <!-- 确认密码 -->
      <el-form-item prop="confirmPassword">
        <BaseInput
          v-model="registerForm.confirmPassword"
          label="确认密码"
          type="password"
          placeholder="请再次输入密码"
        />
      </el-form-item>

      <!-- 专业（可选） -->
      <el-form-item prop="major">
        <BaseInput v-model="registerForm.major" label="专业（可选）" placeholder="请输入专业名称" />
      </el-form-item>

      <!-- 手机号（可选） -->
      <el-form-item prop="phone">
        <BaseInput v-model="registerForm.phone" label="手机号（可选）" placeholder="请输入手机号" />
      </el-form-item>

      <!-- 邮箱（可选） -->
      <el-form-item prop="email">
        <BaseInput v-model="registerForm.email" label="邮箱（可选）" placeholder="请输入邮箱" />
      </el-form-item>

      <!-- 用户协议和注册按钮区域 -->
      <div class="form-actions">
        <el-checkbox v-model="agreedToTerms" class="agreement-checkbox">我已阅读并同意《用户协议》</el-checkbox>

        <el-button type="primary" class="register-btn" :loading="loading" @click="handleRegister">立即注册</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import BaseInput from '@/components/BaseInput/index.vue';
import { createStudent } from '@/api';
import type { StudentCreateRequest } from '@/api';
import { StudentCreateRequestStatus } from '@/api';

// emits类型
interface RegisterInputEmits {
  /** 注册成功事件 */
  (e: 'register-success'): void;
  /** 注册失败事件 */
  (e: 'register-error', error: Error): void;
}

// emits定义
const emit = defineEmits<RegisterInputEmits>();

// 响应式数据
const registerFormRef = ref<FormInstance>();
const loading = ref(false);
const agreedToTerms = ref(false);

// 注册表单数据
const registerForm = reactive({
  name: '',
  studentNo: '',
  password: '',
  confirmPassword: '',
  major: '',
  phone: '',
  email: '',
});

// 自定义确认密码验证
const validateConfirmPassword = (_rule: any, value: string, callback: (error?: Error) => void) => {
  if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};

// 表单验证规则
const registerRules: FormRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { max: 50, message: '姓名不能超过50个字符', trigger: 'blur' },
  ],
  studentNo: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { max: 20, message: '学号不能超过20个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
  phone: [
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号格式',
      trigger: 'blur',
    },
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    { max: 100, message: '邮箱不能超过100个字符', trigger: 'blur' },
  ],
  major: [{ max: 100, message: '专业名称不能超过100个字符', trigger: 'blur' }],
};

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return;

  if (!agreedToTerms.value) {
    ElMessage.warning('请先阅读并同意用户协议');
    return;
  }

  try {
    await registerFormRef.value.validate();
    loading.value = true;

    // 构建注册请求
    const requestData: StudentCreateRequest = {
      name: registerForm.name,
      studentNo: registerForm.studentNo,
      password: registerForm.password,
      status: StudentCreateRequestStatus.NUMBER_1, // 默认启用
      major: registerForm.major || undefined,
      phone: registerForm.phone || undefined,
      email: registerForm.email || undefined,
    };

    await createStudent(requestData);

    emit('register-success');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '注册失败，请重试';
    emit('register-error', error instanceof Error ? error : new Error(errorMessage));
    ElMessage.error(errorMessage);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.register-input-container {
  width: 100%;
}

.register-form {
  :deep(.el-form-item) {
    margin-bottom: 0;

    &:last-of-type {
      margin-bottom: 0;
    }

    // 错误提示样式
    .el-form-item__error {
      position: static;
      margin-top: 2px;
      padding-top: 0;
      font-size: 11px;
      line-height: 1.3;
    }
  }

  // 缩小 BaseInput 的尺寸
  :deep(.base-input) {
    .input-label {
      margin-bottom: 4px;
      font-size: 12px;
    }

    .el-input {
      .el-input__wrapper {
        height: 32px;
      }

      .el-input__inner {
        height: 28px;
        padding: 4px 8px;
        font-size: 13px;

        &::placeholder {
          font-size: 13px;
        }
      }
    }
  }
}

.form-actions {
  display: flex;
  flex-direction: column;
  margin-top: 8px;

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

  .register-btn {
    width: 100%;
    height: 40px;
    margin-top: 8px;
    transition: all 0.3s ease;
    border: none;
    border-radius: 6px;
    background: linear-gradient(92deg, var(--cyan-2) 0%, var(--blue-4) 100%);
    box-shadow: inset 0 -2px 0 0 var(--colorFillContent);
    color: var(--colorTextLight);
    font-size: 14px;
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
