<template>
  <div
    ref="containerRef"
    class="lazy-image-wrapper"
    :class="[containerClass, { 'has-overlay': $slots.overlay }]"
    :style="containerStyle"
  >
    <el-image
      ref="imageRef"
      :src="currentSrc"
      :fit="fit"
      :loading="lazy ? 'lazy' : 'eager'"
      :lazy="lazy"
      :scroll-container="scrollContainer"
      :alt="alt"
      :referrer-policy="referrerPolicy"
      :hide-on-click-modal="hideOnClickModal"
      :preview-src-list="previewSrcList"
      :initial-index="initialIndex"
      :close-on-press-escape="closeOnPressEscape"
      :preview-teleported="previewTeleported"
      :z-index="zIndex"
      :class="imageClass"
      @load="handleLoad"
      @error="handleError"
      @switch="handleSwitch"
      @close="handleClose"
      @show="handleShow"
    >
      <!-- 占位插槽 -->
      <template v-if="$slots.placeholder" #placeholder>
        <slot name="placeholder" />
      </template>
      <template v-else-if="showLoading" #placeholder>
        <div class="lazy-image-loading">
          <el-icon class="is-loading" :size="loadingSize">
            <Loading />
          </el-icon>
        </div>
      </template>

      <!-- 错误插槽 -->
      <template v-if="$slots.error" #error>
        <slot name="error" />
      </template>
      <template v-else-if="showDefaultError" #error>
        <div class="lazy-image-error">
          <el-icon :size="errorIconSize">
            <Picture />
          </el-icon>
          <p v-if="showErrorText" class="error-text">{{ errorText }}</p>
        </div>
      </template>

      <!-- 查看器插槽 -->
      <template v-if="$slots.viewer" #viewer>
        <slot name="viewer" />
      </template>
    </el-image>

    <!-- 遮罩层 -->
    <div v-if="$slots.overlay && isLoaded" class="lazy-image-overlay">
      <slot name="overlay" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import { ElImage, ElIcon } from 'element-plus';
import { Loading, Picture } from '@element-plus/icons-vue';
import type { ImageProps } from 'element-plus';

/**
 * 组件属性
 */
interface Props {
  /** 图片地址 */
  src: string;

  /** 图片描述 */
  alt?: string;

  /** 图片适应方式 */
  fit?: ImageProps['fit'];

  /** 是否懒加载 */
  lazy?: boolean;

  /** 指定懒加载的滚动容器 */
  scrollContainer?: string | HTMLElement;

  /** 原生 referrerPolicy */
  referrerPolicy?:
    | 'no-referrer'
    | 'no-referrer-when-downgrade'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'same-origin'
    | 'strict-origin'
    | 'strict-origin-when-cross-origin'
    | 'unsafe-url';

  /** 是否在点击遮罩层时关闭预览 */
  hideOnClickModal?: boolean;

  /** 预览图片列表 */
  previewSrcList?: string[];

  /** 初始预览图片索引 */
  initialIndex?: number;

  /** 是否可以通过按下 ESC 关闭预览 */
  closeOnPressEscape?: boolean;

  /** 是否将预览弹窗插入至 body 元素 */
  previewTeleported?: boolean;

  /** 设置图片预览的 z-index */
  zIndex?: number;

  /** 图片宽度 */
  width?: string | number;

  /** 图片高度 */
  height?: string | number;

  /** 自定义图片类名 */
  imageClass?: string;

  /** 自定义容器类名 */
  containerClass?: string;

  /** 是否显示加载动画 */
  showLoading?: boolean;

  /** 加载图标大小 */
  loadingSize?: number;

  /** 是否显示默认错误提示 */
  showDefaultError?: boolean;

  /** 是否显示错误文本 */
  showErrorText?: boolean;

  /** 错误文本内容 */
  errorText?: string;

  /** 错误图标大小 */
  errorIconSize?: number;

  /** 图片圆角 */
  radius?: string | number;

  /** 加载失败后是否重试 */
  retry?: boolean;

  /** 重试次数 */
  retryCount?: number;

  /** 重试延迟（毫秒） */
  retryDelay?: number;
}

/**
 * 组件事件
 */
interface Emits {
  (e: 'load', event: Event): void;
  (e: 'error', error: Event): void;
  (e: 'switch', index: number): void;
  (e: 'close'): void;
  (e: 'show'): void;
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  fit: 'cover',
  lazy: true,
  hideOnClickModal: true,
  closeOnPressEscape: true,
  previewTeleported: true,
  width: '100%',
  height: 'auto',
  imageClass: '',
  containerClass: '',
  showLoading: true,
  loadingSize: 32,
  showDefaultError: true,
  showErrorText: true,
  errorText: '图片加载失败',
  errorIconSize: 48,
  retry: true,
  retryCount: 3,
  retryDelay: 1000,
  radius: '0',
});

const emit = defineEmits<Emits>();

// ==================== State ====================
const containerRef = ref<HTMLDivElement>();
const imageRef = ref<InstanceType<typeof ElImage>>();
const currentSrc = ref(props.src);
const currentRetryCount = ref(0);
const isLoaded = ref(false);
const retryTimer = ref<number | null>(null);

// ==================== Computed ====================
/** 容器样式 */
const containerStyle = computed(() => {
  const style: Record<string, string> = {
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  };

  if (props.radius) {
    style.borderRadius = typeof props.radius === 'number' ? `${props.radius}px` : props.radius;
    style.overflow = 'hidden';
  }

  return style;
});

// ==================== Methods ====================
/**
 * 重试加载
 */
const retryLoad = () => {
  if (!props.retry || currentRetryCount.value >= props.retryCount) {
    return;
  }

  currentRetryCount.value++;

  // 清除之前的定时器
  if (retryTimer.value !== null) {
    clearTimeout(retryTimer.value);
  }

  retryTimer.value = window.setTimeout(() => {
    // 强制重新加载：先清空再恢复
    const tempSrc = currentSrc.value;
    currentSrc.value = '';
    setTimeout(() => {
      currentSrc.value = tempSrc;
    }, 50);
  }, props.retryDelay);
};

/**
 * 图片加载成功
 */
const handleLoad = (event: Event) => {
  isLoaded.value = true;
  currentRetryCount.value = 0;

  // 清除重试定时器
  if (retryTimer.value !== null) {
    clearTimeout(retryTimer.value);
    retryTimer.value = null;
  }

  emit('load', event);
};

/**
 * 图片加载失败
 */
const handleError = (error: Event) => {
  isLoaded.value = false;

  // 尝试重试
  if (props.retry && currentRetryCount.value < props.retryCount) {
    retryLoad();
    return;
  }

  emit('error', error);
};

/**
 * 切换预览图片
 */
const handleSwitch = (index: number) => {
  emit('switch', index);
};

/**
 * 关闭预览
 */
const handleClose = () => {
  emit('close');
};

/**
 * 显示预览
 */
const handleShow = () => {
  emit('show');
};

// ==================== Lifecycle ====================
onUnmounted(() => {
  // 清理重试定时器
  if (retryTimer.value !== null) {
    clearTimeout(retryTimer.value);
    retryTimer.value = null;
  }
});

// ==================== Watch ====================
// 监听 src 变化，重新加载图片
watch(
  () => props.src,
  newSrc => {
    currentRetryCount.value = 0;
    isLoaded.value = false;
    currentSrc.value = newSrc;

    // 清除重试定时器
    if (retryTimer.value !== null) {
      clearTimeout(retryTimer.value);
      retryTimer.value = null;
    }
  },
);

// ==================== Expose ====================
defineExpose({
  /** 手动重新加载图片 */
  reload: () => {
    currentRetryCount.value = 0;
    isLoaded.value = false;
    const tempSrc = currentSrc.value;
    currentSrc.value = '';
    setTimeout(() => {
      currentSrc.value = tempSrc;
    }, 50);
  },
  /** el-image 实例 */
  imageInstance: imageRef,
  /** 容器元素 */
  containerEl: containerRef,
});
</script>

<style scoped lang="scss">
.lazy-image-wrapper {
  display: inline-block;
  position: relative;

  // el-image 占满容器
  :deep(.el-image) {
    display: block;
    width: 100%;
    height: 100%;
  }

  // 遮罩层悬停效果
  &.has-overlay {
    cursor: pointer;
  }
}

// 加载中样式
.lazy-image-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: var(--colorBgContainer, #f5f5f5);
  color: var(--colorPrimary, #409eff);
}

// 错误样式
.lazy-image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: var(--colorBgContainer, #f5f5f5);
  color: var(--colorTextQuaternary, #c0c4cc);

  .el-icon {
    margin-bottom: 8px;
  }

  .error-text {
    margin: 0;
    color: var(--colorTextTertiary, #909399);
    font-size: 14px;
  }
}

// 遮罩层
.lazy-image-overlay {
  display: flex;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  transition: opacity 0.3s ease;
  opacity: 0;
  background-color: rgb(0 0 0 / 0.4);

  .lazy-image-wrapper:hover & {
    opacity: 1;
  }
}
</style>
