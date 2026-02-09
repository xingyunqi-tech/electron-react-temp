<template>
  <div class="error-page" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
    <!-- 动态背景 -->
    <div class="bg-stars">
      <div v-for="i in 30" :key="i" class="star" :style="starStyles[i - 1]"></div>
    </div>

    <!-- 鼠标跟随粒子 -->
    <canvas ref="canvasRef" class="mouse-particles-canvas"></canvas>

    <!-- 3D 场景容器 -->
    <div ref="sceneRef" class="scene">
      <!-- 3D 数字 -->
      <div class="cube-container">
        <div class="cube cube-4-left">
          <div class="cube-face front">4</div>
          <div class="cube-face back">4</div>
          <div class="cube-face right"></div>
          <div class="cube-face left"></div>
          <div class="cube-face top"></div>
          <div class="cube-face bottom"></div>
        </div>
        <div class="cube cube-0">
          <div class="cube-face front">0</div>
          <div class="cube-face back">0</div>
          <div class="cube-face right"></div>
          <div class="cube-face left"></div>
          <div class="cube-face top"></div>
          <div class="cube-face bottom"></div>
        </div>
        <div class="cube cube-4-right">
          <div class="cube-face front">4</div>
          <div class="cube-face back">4</div>
          <div class="cube-face right"></div>
          <div class="cube-face left"></div>
          <div class="cube-face top"></div>
          <div class="cube-face bottom"></div>
        </div>
      </div>

      <!-- 发光环 -->
      <div class="glow-ring"></div>

      <!-- 信息卡片 -->
      <div class="info-card">
        <h2 class="info-title">页面走丢了</h2>
        <p class="info-desc">抱歉，您访问的页面已飘向宇宙深处...</p>
        <div class="info-actions">
          <el-button type="primary" class="action-btn primary-btn" @click="handleGoMain">
            <span class="btn-text">返回首页</span>
            <span class="btn-glow"></span>
          </el-button>
          <el-button class="action-btn ghost-btn" @click="handleGoBack">
            <span class="btn-text">返回上页</span>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 浮动粒子 -->
    <div class="particles">
      <div v-for="i in 12" :key="i" class="particle" :style="particleStyles[i - 1]"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Refs - 只保留必要的
const canvasRef = ref<HTMLCanvasElement | null>(null);
const sceneRef = ref<HTMLElement | null>(null);

// 粒子系统常量
const MAX_PARTICLES = 80;
const PI2 = Math.PI * 2;
const colors = ['#40e0d0', '#8a2be2', '#00ffff', '#ff00ff', '#7b68ee'];

// 粒子池 - 使用 TypedArray 优化内存
let particleData: Float32Array; // [x, y, vx, vy, size, alpha, life, maxLife] * MAX_PARTICLES
let particleColors: Uint8Array;
let activeCount = 0;
let animationId = 0;
let ctx: CanvasRenderingContext2D | null = null;
let canvasWidth = 0;
let canvasHeight = 0;
let lastMouseX = 0;
let lastMouseY = 0;
let lastMoveTime = 0;

// 初始化粒子数据
const initParticles = () => {
  particleData = new Float32Array(MAX_PARTICLES * 8);
  particleColors = new Uint8Array(MAX_PARTICLES);
};

// 激活粒子
const activateParticle = (x: number, y: number) => {
  if (activeCount >= MAX_PARTICLES) return;

  for (let i = 0; i < MAX_PARTICLES; i++) {
    const offset = i * 8;
    if (particleData[offset + 5] <= 0) {
      const angle = Math.random() * PI2;
      const speed = Math.random() * 2 + 1;
      particleData[offset] = x;
      particleData[offset + 1] = y;
      particleData[offset + 2] = Math.cos(angle) * speed;
      particleData[offset + 3] = Math.sin(angle) * speed;
      particleData[offset + 4] = Math.random() * 4 + 2;
      particleData[offset + 5] = 1;
      particleData[offset + 6] = 0;
      particleData[offset + 7] = Math.random() * 40 + 20;
      particleColors[i] = Math.floor(Math.random() * colors.length);
      activeCount++;
      return;
    }
  }
};

// 动画循环
const animate = () => {
  if (!ctx) return;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  for (let i = 0; i < MAX_PARTICLES; i++) {
    const offset = i * 8;
    const alpha = particleData[offset + 5];
    if (alpha <= 0) continue;

    particleData[offset + 6]++;
    particleData[offset] += particleData[offset + 2];
    particleData[offset + 1] += particleData[offset + 3];

    const life = particleData[offset + 6];
    const maxLife = particleData[offset + 7];
    const newAlpha = 1 - life / maxLife;
    particleData[offset + 5] = newAlpha;

    if (newAlpha <= 0) {
      activeCount--;
      continue;
    }

    ctx.globalAlpha = newAlpha;
    ctx.fillStyle = colors[particleColors[i]];
    ctx.beginPath();
    ctx.arc(particleData[offset], particleData[offset + 1], particleData[offset + 4], 0, PI2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  animationId = requestAnimationFrame(animate);
};

// 鼠标移动 - 使用 CSS 变量实现视差
const handleMouseMove = (e: MouseEvent) => {
  const now = performance.now();
  if (now - lastMoveTime < 16) return;
  lastMoveTime = now;

  const dx = e.clientX - lastMouseX;
  const dy = e.clientY - lastMouseY;

  if (dx * dx + dy * dy > 25) {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    for (let i = 0; i < 2; i++) {
      activateParticle(e.clientX + (Math.random() - 0.5) * 8, e.clientY + (Math.random() - 0.5) * 8);
    }
  }

  // 视差效果 - 使用 CSS 变量
  if (sceneRef.value) {
    const rotateY = (e.clientX - window.innerWidth / 2) / 60;
    const rotateX = -(e.clientY - window.innerHeight / 2) / 60;
    sceneRef.value.style.setProperty('--rx', `${rotateX}deg`);
    sceneRef.value.style.setProperty('--ry', `${rotateY}deg`);
  }
};

const handleMouseLeave = () => {
  if (sceneRef.value) {
    sceneRef.value.style.setProperty('--rx', '0deg');
    sceneRef.value.style.setProperty('--ry', '0deg');
  }
};

// 初始化 Canvas
const initCanvas = () => {
  if (!canvasRef.value) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvasRef.value.getBoundingClientRect();
  canvasWidth = rect.width;
  canvasHeight = rect.height;
  canvasRef.value.width = canvasWidth * dpr;
  canvasRef.value.height = canvasHeight * dpr;
  ctx = canvasRef.value.getContext('2d', { alpha: true });
  if (ctx) {
    ctx.scale(dpr, dpr);
  }
  initParticles();
  animate();
};

// 窗口大小变化
let resizeTimer = 0;
const handleResize = () => {
  clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    if (!canvasRef.value || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvasRef.value.getBoundingClientRect();
    canvasWidth = rect.width;
    canvasHeight = rect.height;
    canvasRef.value.width = canvasWidth * dpr;
    canvasRef.value.height = canvasHeight * dpr;
    ctx.scale(dpr, dpr);
  }, 150);
};

onMounted(() => {
  initCanvas();
  window.addEventListener('resize', handleResize, { passive: true });
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
  clearTimeout(resizeTimer);
  window.removeEventListener('resize', handleResize);
});

const handleGoMain = () => router.push('/');
const handleGoBack = () => router.back();

// 预计算星星样式
const starStyles = Array.from({ length: 30 }, () => {
  const size = Math.random() * 3 + 1;
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${Math.random() * 2 + 1}s`,
  };
});

// 预计算浮动粒子样式
const particleStyles = Array.from({ length: 12 }, () => {
  const size = Math.random() * 8 + 4;
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${Math.random() * 10 + 10}s`,
  };
});
</script>

<style scoped lang="scss">
.error-page {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  overflow: hidden;

  // 启用 GPU 加速
  transform: translateZ(0);
  backface-visibility: hidden;
  background: linear-gradient(135deg, #0c0c1e 0%, #1a1a3e 50%, #0c0c1e 100%);
  cursor: none;
}

// 鼠标粒子画布
.mouse-particles-canvas {
  position: absolute;
  inset: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  pointer-events: none;
  will-change: contents;
}

// 星空背景
.bg-stars {
  position: absolute;
  inset: 0;
  overflow: hidden;
  contain: strict;
}

.star {
  position: absolute;
  animation: twinkle ease-in-out infinite;
  border-radius: 50%;
  background: white;
  will-change: transform, opacity;
  contain: layout style;
}

@keyframes twinkle {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.3;
  }

  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

// 3D 场景
.scene {
  --rx: 0deg;
  --ry: 0deg;

  display: flex;
  position: relative;
  z-index: 10;
  flex-direction: column;
  align-items: center;
  transform: rotateX(var(--rx)) rotateY(var(--ry));
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: transform 0.4s cubic-bezier(0.33, 1, 0.68, 1);
  will-change: transform;
}

// 3D 立方体容器
.cube-container {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  transform-style: preserve-3d;
  will-change: transform;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotateX(5deg);
  }

  50% {
    transform: translateY(-20px) rotateX(-5deg);
  }
}

// 单个立方体
.cube {
  position: relative;
  width: 120px;
  height: 120px;
  transform-style: preserve-3d;
  will-change: transform;
  animation: cube-rotate 8s ease-in-out infinite;
}

.cube-4-left {
  animation-delay: 0s;
}

.cube-0 {
  animation-delay: 0.3s;
}

.cube-4-right {
  animation-delay: 0.6s;
}

@keyframes cube-rotate {
  0%,
  100% {
    transform: rotateY(0deg) rotateX(0deg);
  }

  25% {
    transform: rotateY(10deg) rotateX(5deg);
  }

  50% {
    transform: rotateY(0deg) rotateX(0deg);
  }

  75% {
    transform: rotateY(-10deg) rotateX(-5deg);
  }
}

// 立方体面
.cube-face {
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  backface-visibility: hidden;
  border: 2px solid rgb(64 224 208 / 0.5);
  background: linear-gradient(135deg, rgb(64 224 208 / 0.2) 0%, rgb(138 43 226 / 0.2) 100%);
  color: white;
  font-size: 80px;
  font-weight: bold;
  text-shadow:
    0 0 20px rgb(64 224 208 / 0.8),
    0 0 40px rgb(64 224 208 / 0.6);

  // 移除 backdrop-filter 提升性能
  // backdrop-filter: blur(10px);
}

.front {
  transform: translateZ(60px);
}

.back {
  transform: rotateY(180deg) translateZ(60px);
}

.right {
  transform: rotateY(90deg) translateZ(60px);
  background: linear-gradient(135deg, rgb(138 43 226 / 0.3) 0%, rgb(64 224 208 / 0.1) 100%);
}

.left {
  transform: rotateY(-90deg) translateZ(60px);
  background: linear-gradient(135deg, rgb(64 224 208 / 0.1) 0%, rgb(138 43 226 / 0.3) 100%);
}

.top {
  transform: rotateX(90deg) translateZ(60px);
  background: linear-gradient(135deg, rgb(64 224 208 / 0.4) 0%, rgb(138 43 226 / 0.2) 100%);
}

.bottom {
  transform: rotateX(-90deg) translateZ(60px);
  background: rgb(0 0 0 / 0.3);
}

// 发光环
.glow-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 500px;
  transform: translate(-50%, -50%) rotateX(75deg);
  animation: ring-pulse 4s ease-in-out infinite;
  border: 3px solid transparent;
  border-radius: 50%;
  background:
    linear-gradient(135deg, rgb(64 224 208 / 0.1), rgb(138 43 226 / 0.1)) padding-box,
    linear-gradient(135deg, #40e0d0, #8a2be2) border-box;
  will-change: transform, opacity;
}

@keyframes ring-pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) rotateX(75deg) scale(1);
    opacity: 0.5;
  }

  50% {
    transform: translate(-50%, -50%) rotateX(75deg) scale(1.1);
    opacity: 1;
  }
}

// 信息卡片
.info-card {
  position: relative;
  z-index: 20;
  padding: 40px 60px;
  animation: card-appear 1s ease-out both;
  border: 1px solid rgb(255 255 255 / 0.2);
  border-radius: 20px;
  background: linear-gradient(135deg, rgb(255 255 255 / 0.1) 0%, rgb(255 255 255 / 0.05) 100%);
  text-align: center;
  cursor: auto;
  backdrop-filter: blur(20px);
}

@keyframes card-appear {
  from {
    transform: translateY(30px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.info-title {
  margin-bottom: 12px;
  color: white;
  font-size: 28px;
  font-weight: 600;
  text-shadow: 0 0 20px rgb(64 224 208 / 0.5);
}

.info-desc {
  margin-bottom: 30px;
  color: rgb(255 255 255 / 0.7);
  font-size: 16px;
}

.info-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

// 按钮样式
.action-btn {
  position: relative;
  height: 44px;
  padding: 0 28px;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  border-radius: 22px;
  font-size: 15px;
  cursor: pointer;
}

.primary-btn {
  border: none;
  background: linear-gradient(135deg, #40e0d0 0%, #8a2be2 100%);
  box-shadow: 0 4px 20px rgb(64 224 208 / 0.4);
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 30px rgb(64 224 208 / 0.6);
  }

  .btn-glow {
    position: absolute;
    animation: btn-shine 3s ease-in-out infinite;
    background: linear-gradient(45deg, transparent 40%, rgb(255 255 255 / 0.3) 50%, transparent 60%);
    inset: -50%;
    will-change: transform;
  }
}

@keyframes btn-shine {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }

  100% {
    transform: translateX(100%) rotate(45deg);
  }
}

.ghost-btn {
  border: 1px solid rgb(255 255 255 / 0.3);
  background: transparent;
  color: rgb(255 255 255 / 0.8);

  &:hover {
    border-color: rgb(255 255 255 / 0.5);
    background: rgb(255 255 255 / 0.1);
    color: white;
  }
}

.btn-text {
  position: relative;
  z-index: 1;
}

// 浮动粒子
.particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  contain: strict;
}

.particle {
  position: absolute;
  bottom: -20px;
  animation: particle-rise linear infinite;
  border-radius: 50%;
  opacity: 0.6;
  background: linear-gradient(135deg, #40e0d0, #8a2be2);
  will-change: transform, opacity;
  contain: layout style;
}

@keyframes particle-rise {
  0% {
    transform: translateY(0) scale(0);
    opacity: 0;
  }

  10% {
    transform: scale(1);
    opacity: 0.6;
  }

  90% {
    opacity: 0.6;
  }

  100% {
    transform: translateY(-100vh) scale(0.5);
    opacity: 0;
  }
}

// 响应式适配
@media (width <= 768px) {
  .error-page {
    cursor: auto;
  }

  .cube {
    width: 80px;
    height: 80px;
  }

  .cube-face {
    width: 80px;
    height: 80px;
    font-size: 50px;
  }

  .front {
    transform: translateZ(40px);
  }

  .back {
    transform: rotateY(180deg) translateZ(40px);
  }

  .right {
    transform: rotateY(90deg) translateZ(40px);
  }

  .left {
    transform: rotateY(-90deg) translateZ(40px);
  }

  .top {
    transform: rotateX(90deg) translateZ(40px);
  }

  .bottom {
    transform: rotateX(-90deg) translateZ(40px);
  }

  .glow-ring {
    width: 300px;
    height: 300px;
  }

  .info-card {
    padding: 30px 40px;
  }

  .info-title {
    font-size: 22px;
  }

  .info-actions {
    flex-direction: column;
  }
}

// 减少动画 - 用户偏好
@media (prefers-reduced-motion: reduce) {
  .star,
  .particle,
  .cube,
  .cube-container,
  .glow-ring,
  .btn-glow {
    animation: none;
  }

  .scene {
    transition: none;
  }
}
</style>
