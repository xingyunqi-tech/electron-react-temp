<template>
  <div class="error-boundary">
    <!-- 错误边界UI -->
    <div v-if="hasError" class="error-boundary-fallback">
      <div class="error-content">
        <el-icon class="error-icon" :size="64">
          <WarningFilled />
        </el-icon>
        <h3 class="error-title">{{ props.errorTitle }}</h3>
        <p class="error-message">{{ props.errorMessage }}</p>
        <div class="error-actions">
          <el-button type="primary" @click="handleRetry">{{ props.retryText }}</el-button>
          <el-button v-if="props.showHomeButton" @click="handleGoHome">{{ props.homeText }}</el-button>
        </div>

        <!-- 开发环境显示错误详情 -->
        <div v-if="isDev && errorDetails && props.showDetails" class="error-details">
          <el-collapse>
            <el-collapse-item title="错误详情" name="details">
              <div class="error-stack-wrapper">
                <div class="error-stack-header">
                  <span>错误堆栈</span>
                  <el-button size="small" text @click="copyErrorDetails">复制</el-button>
                </div>
                <pre class="error-stack">{{ errorDetails }}</pre>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>

    <!-- 正常内容 -->
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElButton, ElIcon, ElCollapse, ElCollapseItem, ElMessage } from 'element-plus';
import { WarningFilled } from '@element-plus/icons-vue';

/**
 * 组件属性
 */
interface Props {
  /** 错误标题 */
  errorTitle?: string;
  /** 错误消息 */
  errorMessage?: string;
  /** 重试按钮文本 */
  retryText?: string;
  /** 首页按钮文本 */
  homeText?: string;
  /** 是否显示首页按钮 */
  showHomeButton?: boolean;
  /** 是否显示错误详情（仅开发环境） */
  showDetails?: boolean;
  /** 是否自动重试 */
  autoRetry?: boolean;
  /** 自动重试延迟（毫秒） */
  autoRetryDelay?: number;
  /** 自定义重试逻辑 */
  onRetry?: () => void;
  /** 自定义错误处理 */
  onError?: (error: Error, errorInfo: any) => void;
}

/**
 * 组件事件
 */
interface Emits {
  (e: 'error', error: Error, errorInfo: any): void;
  (e: 'retry'): void;
}

const props = withDefaults(defineProps<Props>(), {
  errorTitle: '页面出现错误',
  errorMessage: '抱歉，页面遇到了一些问题。请尝试刷新页面或返回首页。',
  retryText: '重试',
  homeText: '返回首页',
  showHomeButton: true,
  showDetails: true,
  autoRetry: false,
  autoRetryDelay: 3000,
  onRetry: undefined,
  onError: undefined,
});

const emit = defineEmits<Emits>();
const router = useRouter();

// 组件状态
const hasError = ref(false);
const errorDetails = ref('');
const retryTimer = ref<number | null>(null);

// 是否为开发环境
const isDev = computed(() => import.meta.env.DEV);

/**
 * 错误边界处理
 */
onErrorCaptured((error: Error, instance, errorInfo) => {
  console.error('ErrorBoundary caught error:', error);

  hasError.value = true;

  // 构建错误详情
  errorDetails.value = `${error.stack}\n\nComponent: ${instance?.$?.type?.name || 'Unknown'}\nError Info: ${errorInfo}`;

  // 调用自定义错误处理
  if (props.onError) {
    props.onError(error, errorInfo);
  }

  emit('error', error, errorInfo);

  // 自动重试
  if (props.autoRetry && props.autoRetryDelay > 0) {
    retryTimer.value = window.setTimeout(() => {
      handleRetry();
    }, props.autoRetryDelay);
  }

  return false; // 阻止错误向上传播
});

/**
 * 重试处理
 */
const handleRetry = () => {
  // 清除自动重试定时器
  if (retryTimer.value !== null) {
    clearTimeout(retryTimer.value);
    retryTimer.value = null;
  }

  hasError.value = false;
  errorDetails.value = '';

  if (props.onRetry) {
    props.onRetry();
  } else {
    // 默认重新加载页面
    window.location.reload();
  }

  emit('retry');
};

/**
 * 返回首页
 */
const handleGoHome = () => {
  hasError.value = false;
  errorDetails.value = '';
  router.push('/');
};

/**
 * 复制错误详情
 */
const copyErrorDetails = async () => {
  try {
    await navigator.clipboard.writeText(errorDetails.value);
    ElMessage.success('错误详情已复制到剪贴板');
  } catch (error) {
    ElMessage.error('复制失败');
  }
};

/**
 * 组件卸载清理
 */
onUnmounted(() => {
  // 清理自动重试定时器
  if (retryTimer.value !== null) {
    clearTimeout(retryTimer.value);
    retryTimer.value = null;
  }
});

// 暴露方法给父组件
defineExpose({
  handleRetry,
  hasError,
});
</script>

<style scoped lang="scss">
.error-boundary {
  display: contents; // 不影响布局
}

.error-boundary-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 48px 24px;
  background: var(--colorBgContainer);
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 480px;
  padding: 40px;
  border-radius: 12px;
  background: var(--colorBgElevated);
  box-shadow: 0 4px 24px rgb(0 0 0 / 0.08);
  text-align: center;
}

.error-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin-bottom: 24px;
  border-radius: 50%;
  background: var(--colorErrorBg);
  color: var(--colorError);
}

.error-title {
  margin: 0 0 12px;
  color: var(--colorTextHeading);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.error-message {
  margin: 0 0 32px;
  color: var(--colorTextSecondary);
  font-size: 15px;
  line-height: 1.7;
}

.error-actions {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;

  :deep(.el-button) {
    min-width: 100px;
    padding: 10px 24px;
    transition: all 0.2s ease;
    border-radius: 8px;
    font-weight: 500;
  }

  :deep(.el-button--primary) {
    box-shadow: 0 2px 8px rgb(0 180 180 / 0.3);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgb(0 180 180 / 0.4);
    }
  }

  :deep(.el-button--default) {
    border-color: var(--colorBorder);
    background: var(--colorBgContainer);
    color: var(--colorTextSecondary);

    &:hover {
      border-color: var(--colorPrimary);
      color: var(--colorPrimary);
    }
  }
}

.error-details {
  width: 100%;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--colorBorderSecondary);
  text-align: left;

  :deep(.el-collapse) {
    border: none;

    .el-collapse-item__header {
      padding: 0;
      border: none;
      background: transparent;
      color: var(--colorTextTertiary);
      font-size: 13px;

      &:hover {
        color: var(--colorText);
      }
    }

    .el-collapse-item__wrap {
      border: none;
      background: transparent;
    }

    .el-collapse-item__content {
      padding: 0;
    }
  }
}

.error-stack-wrapper {
  .error-stack-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    padding: 8px 0;

    span {
      color: var(--colorTextSecondary);
      font-size: 13px;
      font-weight: 500;
    }

    :deep(.el-button) {
      color: var(--colorPrimary);
      font-size: 12px;

      &:hover {
        color: var(--colorPrimaryHover);
      }
    }
  }

  .error-stack {
    max-height: 240px;
    padding: 16px;
    overflow: auto;
    border: 1px solid var(--colorBorderSecondary);
    border-radius: 8px;
    background: var(--colorFillAlter);
    color: var(--colorTextSecondary);
    font-family: 'SF Mono', Consolas, Monaco, 'Courier New', monospace;
    font-size: 12px;
    line-height: 1.8;
    word-break: break-all;
    white-space: pre-wrap;

    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      border-radius: 3px;
      background: var(--colorFillTertiary);
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background: var(--colorFillSecondary);

      &:hover {
        background: var(--colorFill);
      }
    }
  }
}

// 响应式适配
@media (width <= 640px) {
  .error-boundary-fallback {
    padding: 24px 16px;
  }

  .error-content {
    padding: 32px 24px;
  }

  .error-icon {
    width: 64px;
    height: 64px;
    margin-bottom: 20px;

    :deep(.el-icon) {
      font-size: 32px !important;
    }
  }

  .error-title {
    font-size: 18px;
  }

  .error-message {
    margin-bottom: 24px;
    font-size: 14px;
  }

  .error-actions {
    flex-direction: column;
    gap: 12px;
    width: 100%;

    :deep(.el-button) {
      width: 100%;
    }
  }

  .error-stack-wrapper {
    .error-stack {
      max-height: 180px;
      padding: 12px;
      font-size: 11px;
    }
  }
}
</style>
