<template>
  <div class="forbidden-page" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
    <!-- 网格背景 -->
    <div class="grid-bg"></div>

    <!-- 扫描线效果 -->
    <div class="scan-line"></div>

    <!-- 鼠标跟随粒子 -->
    <canvas ref="canvasRef" class="mouse-particles-canvas"></canvas>

    <!-- 主场景 -->
    <div ref="sceneRef" class="scene">
      <!-- 3D 锁 -->
      <div class="lock-container">
        <div class="lock-body">
          <div class="lock-face front">
            <div class="keyhole">
              <div class="keyhole-circle"></div>
              <div class="keyhole-rect"></div>
            </div>
          </div>
          <div class="lock-face back"></div>
          <div class="lock-face right"></div>
          <div class="lock-face left"></div>
          <div class="lock-face top"></div>
          <div class="lock-face bottom"></div>
        </div>
        <div class="lock-shackle">
          <div class="shackle-left"></div>
          <div class="shackle-top"></div>
          <div class="shackle-right"></div>
        </div>
      </div>

      <!-- 警告数字 -->
      <div class="warning-code">
        <span class="digit">4</span>
        <span class="digit">0</span>
        <span class="digit">3</span>
      </div>

      <!-- 警告圈 -->
      <div class="warning-rings">
        <div class="ring ring-1"></div>
        <div class="ring ring-2"></div>
        <div class="ring ring-3"></div>
      </div>

      <!-- 信息面板 -->
      <div class="info-panel">
        <div class="panel-header">
          <span class="status-dot"></span>
          <span class="status-text">ACCESS DENIED</span>
        </div>
        <h2 class="panel-title">无访问权限</h2>
        <p class="panel-desc">您没有权限访问此区域，请联系管理员获取授权</p>
        <div class="panel-actions">
          <el-button type="danger" class="action-btn danger-btn" @click="goHome">
            <span class="btn-icon">⌂</span>
            <span class="btn-text">返回首页</span>
          </el-button>
          <el-button class="action-btn outline-btn" @click="goBack">
            <span class="btn-icon">←</span>
            <span class="btn-text">返回上页</span>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 角落装饰 -->
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>

    <!-- 数据流动画 -->
    <div class="data-streams">
      <div v-for="i in 6" :key="i" class="data-stream" :style="streamStyles[i - 1]"></div>
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
const MAX_PARTICLES = 60;
const PI2 = Math.PI * 2;
const colors = ['#ff0000', '#ff4444', '#ff6666', '#cc0000', '#ff3333'];

// 粒子池 - 使用 TypedArray 优化内存
let particleData: Float32Array; // [x, y, vx, vy, size, alpha, life, maxLife] * MAX_PARTICLES
let particleColors: Uint8Array; // 颜色索引
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
      // alpha <= 0 表示未激活
      const angle = Math.random() * PI2;
      const speed = Math.random() * 3 + 1;
      particleData[offset] = x; // x
      particleData[offset + 1] = y; // y
      particleData[offset + 2] = Math.cos(angle) * speed; // vx
      particleData[offset + 3] = Math.sin(angle) * speed; // vy
      particleData[offset + 4] = Math.random() * 5 + 2; // size
      particleData[offset + 5] = 1; // alpha
      particleData[offset + 6] = 0; // life
      particleData[offset + 7] = Math.random() * 30 + 15; // maxLife
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

    // 更新
    particleData[offset + 6]++; // life++
    particleData[offset] += particleData[offset + 2]; // x += vx
    particleData[offset + 1] += particleData[offset + 3]; // y += vy

    const life = particleData[offset + 6];
    const maxLife = particleData[offset + 7];
    const newAlpha = 1 - life / maxLife;
    particleData[offset + 5] = newAlpha;

    if (newAlpha <= 0) {
      activeCount--;
      continue;
    }

    // 绘制
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

    // 创建粒子
    for (let i = 0; i < 2; i++) {
      activateParticle(e.clientX + (Math.random() - 0.5) * 12, e.clientY + (Math.random() - 0.5) * 12);
    }
  }

  // 视差效果 - 使用 CSS 变量
  if (sceneRef.value) {
    const rotateY = (e.clientX - window.innerWidth / 2) / 50;
    const rotateX = -(e.clientY - window.innerHeight / 2) / 50;
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

const goHome = () => router.push('/');
const goBack = () => router.back();

// 预计算数据流样式
const streamStyles = Array.from({ length: 6 }, (_, i) => ({
  left: `${i * 16 + Math.random() * 8}%`,
  animationDelay: `${Math.random() * 4}s`,
  animationDuration: `${Math.random() * 2 + 3}s`,
  height: `${Math.random() * 80 + 40}px`,
}));
</script>

<style scoped lang="scss">
.forbidden-page {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  overflow: hidden;
  transform: translateZ(0);
  backface-visibility: hidden;
  background: linear-gradient(135deg, #1a0a0a 0%, #2d1515 50%, #1a0a0a 100%);
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

// 网格背景 - 静态，无动画
.grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgb(255 0 0 / 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgb(255 0 0 / 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  contain: strict;
}

// 扫描线 - 使用 CSS 动画
.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  animation: scan-move 3s ease-in-out infinite;
  background: linear-gradient(90deg, transparent, rgb(255 0 0 / 0.8), transparent);
  box-shadow: 0 0 20px rgb(255 0 0 / 0.5);
  will-change: transform;
}

@keyframes scan-move {
  0% {
    transform: translateY(0);
    opacity: 0;
  }

  5% {
    opacity: 1;
  }

  95% {
    opacity: 1;
  }

  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
}

// 主场景
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
  perspective: 800px;
  transition: transform 0.4s cubic-bezier(0.33, 1, 0.68, 1);
  will-change: transform;
}

// 3D 锁 - 使用 CSS 动画悬浮
.lock-container {
  position: relative;
  width: 100px;
  height: 140px;
  margin-bottom: 30px;
  transform-style: preserve-3d;
  will-change: transform;
  animation: lock-float 3s ease-in-out infinite;
}

@keyframes lock-float {
  0%,
  100% {
    transform: translateY(0) rotateY(0deg);
  }

  50% {
    transform: translateY(-12px) rotateY(8deg);
  }
}

.lock-body {
  position: absolute;
  bottom: 0;
  width: 100px;
  height: 80px;
  transform-style: preserve-3d;
}

.lock-face {
  position: absolute;
  backface-visibility: hidden;
  border: 2px solid rgb(255 100 100 / 0.3);
  background: linear-gradient(135deg, #c41e3a 0%, #8b0000 100%);
}

.lock-face.front {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 80px;
  transform: translateZ(25px);
  box-shadow: 0 0 30px rgb(255 0 0 / 0.3);
}

.lock-face.back {
  width: 100px;
  height: 80px;
  transform: translateZ(-25px) rotateY(180deg);
}

.lock-face.right {
  left: 75px;
  width: 50px;
  height: 80px;
  transform: rotateY(90deg);
  background: linear-gradient(135deg, #8b0000 0%, #5c0000 100%);
}

.lock-face.left {
  left: -25px;
  width: 50px;
  height: 80px;
  transform: rotateY(-90deg);
  background: linear-gradient(135deg, #f44 0%, #c41e3a 100%);
}

.lock-face.top {
  top: -25px;
  width: 100px;
  height: 50px;
  transform: rotateX(90deg);
  background: linear-gradient(135deg, #f66 0%, #c41e3a 100%);
}

.lock-face.bottom {
  bottom: -25px;
  width: 100px;
  height: 50px;
  transform: rotateX(-90deg);
  background: #5c0000;
}

// 钥匙孔
.keyhole {
  position: relative;
}

.keyhole-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #1a0a0a;
  box-shadow:
    inset 0 0 10px rgb(0 0 0 / 0.5),
    0 0 10px rgb(255 0 0 / 0.3);
}

.keyhole-rect {
  width: 10px;
  height: 20px;
  margin: -5px auto 0;
  border-radius: 0 0 5px 5px;
  background: #1a0a0a;
}

// 锁扣
.lock-shackle {
  position: absolute;
  top: 0;
  left: 50%;
  width: 60px;
  height: 50px;
  transform: translateX(-50%);
}

.shackle-left,
.shackle-right {
  position: absolute;
  bottom: 0;
  width: 12px;
  height: 40px;
  border-radius: 6px 6px 0 0;
  background: linear-gradient(180deg, #ffd700, #daa520);
  box-shadow: 0 0 10px rgb(255 215 0 / 0.3);
}

.shackle-left {
  left: 0;
}

.shackle-right {
  right: 0;
}

.shackle-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 60px;
  height: 30px;
  border-radius: 30px 30px 0 0;
  background: linear-gradient(180deg, #ffd700, #daa520);
  box-shadow: 0 0 15px rgb(255 215 0 / 0.4);

  &::after {
    content: '';
    position: absolute;
    top: 12px;
    left: 12px;
    width: 36px;
    height: 20px;
    border-radius: 20px 20px 0 0;
    background: linear-gradient(135deg, #1a0a0a 0%, #2d1515 100%);
  }
}

// 警告数字 - CSS glitch 动画
.warning-code {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.digit {
  animation: digit-glitch 0.15s ease-in-out infinite alternate;
  background: linear-gradient(180deg, #f44, #c41e3a);
  background-clip: text;
  color: transparent;
  font-size: 72px;
  font-weight: bold;
  text-shadow:
    0 0 20px rgb(255 0 0 / 0.5),
    0 0 40px rgb(255 0 0 / 0.3);
  will-change: transform;

  &:nth-child(1) {
    animation-delay: 0s;
  }

  &:nth-child(2) {
    animation-delay: 0.05s;
  }

  &:nth-child(3) {
    animation-delay: 0.1s;
  }
}

@keyframes digit-glitch {
  0% {
    transform: translateX(-1px);
  }

  100% {
    transform: translateX(1px);
  }
}

// 警告圈 - 纯 CSS 动画
.warning-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  contain: strict;
}

.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  animation: ring-expand 3s ease-out infinite;
  border: 2px solid rgb(255 0 0 / 0.4);
  border-radius: 50%;
  will-change: transform, opacity;
}

.ring-1 {
  animation-delay: 0s;
}

.ring-2 {
  animation-delay: 1s;
}

.ring-3 {
  animation-delay: 2s;
}

@keyframes ring-expand {
  0% {
    width: 150px;
    height: 150px;
    margin-top: -75px;
    margin-left: -75px;
    opacity: 0.8;
  }

  100% {
    width: 500px;
    height: 500px;
    margin-top: -250px;
    margin-left: -250px;
    opacity: 0;
  }
}

// 信息面板
.info-panel {
  position: relative;
  padding: 30px 50px;
  border: 1px solid rgb(255 0 0 / 0.3);
  border-radius: 16px;
  background: linear-gradient(135deg, rgb(255 0 0 / 0.1) 0%, rgb(139 0 0 / 0.1) 100%);
  text-align: center;
  cursor: auto;
  backdrop-filter: blur(10px);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
}

// 状态点 - CSS 动画
.status-dot {
  width: 10px;
  height: 10px;
  animation: blink 1s ease-in-out infinite;
  border-radius: 50%;
  background: #f00;
  box-shadow: 0 0 10px #f00;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
    box-shadow: 0 0 10px #f00;
  }

  50% {
    opacity: 0.5;
    box-shadow: 0 0 5px #f00;
  }
}

.status-text {
  color: #f44;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 2px;
}

.panel-title {
  margin-bottom: 10px;
  color: white;
  font-size: 26px;
  font-weight: 600;
}

.panel-desc {
  margin-bottom: 25px;
  color: rgb(255 255 255 / 0.6);
  font-size: 14px;
}

.panel-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

// 按钮样式
.action-btn {
  display: flex;
  align-items: center;
  height: 42px;
  padding: 0 24px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  gap: 8px;
}

.danger-btn {
  border: none;
  background: linear-gradient(135deg, #f44 0%, #c41e3a 100%);
  box-shadow: 0 4px 15px rgb(255 0 0 / 0.3);
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgb(255 0 0 / 0.4);
  }
}

.outline-btn {
  border: 1px solid rgb(255 255 255 / 0.2);
  background: transparent;
  color: rgb(255 255 255 / 0.8);

  &:hover {
    border-color: rgb(255 255 255 / 0.4);
    background: rgb(255 255 255 / 0.05);
    color: white;
  }
}

.btn-icon {
  font-size: 16px;
}

// 角落装饰 - 入场动画
.corner {
  position: absolute;
  width: 60px;
  height: 60px;
  animation: corner-appear 0.6s ease-out both;
  border-width: 0;
  border-style: solid;
  border-color: rgb(255 0 0 / 0.3);
}

.corner-tl {
  top: 20px;
  left: 20px;
  animation-delay: 0.8s;
  border-top-width: 3px;
  border-left-width: 3px;
}

.corner-tr {
  top: 20px;
  right: 20px;
  animation-delay: 0.9s;
  border-top-width: 3px;
  border-right-width: 3px;
}

.corner-bl {
  bottom: 20px;
  left: 20px;
  animation-delay: 1s;
  border-bottom-width: 3px;
  border-left-width: 3px;
}

.corner-br {
  right: 20px;
  bottom: 20px;
  animation-delay: 1.1s;
  border-right-width: 3px;
  border-bottom-width: 3px;
}

@keyframes corner-appear {
  from {
    transform: scale(0);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

// 数据流
.data-streams {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  contain: strict;
}

.data-stream {
  position: absolute;
  top: -100px;
  width: 2px;
  animation: stream-fall linear infinite;
  background: linear-gradient(180deg, transparent, rgb(255 0 0 / 0.6), transparent);
  will-change: transform;
  contain: layout style;
}

@keyframes stream-fall {
  0% {
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(calc(100vh + 100px));
  }
}

// 响应式
@media (width <= 768px) {
  .forbidden-page {
    cursor: auto;
  }

  .lock-container {
    transform: scale(0.8);
  }

  .digit {
    font-size: 50px;
  }

  .info-panel {
    padding: 25px 35px;
  }

  .panel-title {
    font-size: 22px;
  }

  .panel-actions {
    flex-direction: column;
  }

  .corner {
    width: 40px;
    height: 40px;
  }
}

// 减少动画 - 用户偏好
@media (prefers-reduced-motion: reduce) {
  .scan-line,
  .lock-container,
  .digit,
  .ring,
  .status-dot,
  .data-stream,
  .corner {
    animation: none;
  }

  .scene {
    transition: none;
  }
}
</style>
