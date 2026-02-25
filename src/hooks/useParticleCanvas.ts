import { useCallback, useEffect, useRef } from 'react';

const PI2 = Math.PI * 2;

export interface ParticleCanvasOptions {
  /** 最大粒子数 */
  maxParticles: number;
  /** 粒子颜色数组 */
  colors: string[];
  /** 粒子速度范围 [基数, 随机增量] → Math.random() * 增量 + 基数 */
  speedRange: [number, number];
  /** 粒子大小范围 [基数, 随机增量] */
  sizeRange: [number, number];
  /** 粒子生命范围 [基数, 随机增量] */
  lifeRange: [number, number];
  /** 鼠标附近粒子扩散范围 */
  spawnSpread: number;
  /** 3D 场景旋转灵敏度（除数越大越不灵敏） */
  rotationDivisor: number;
  /** 每次鼠标移动生成的粒子数 @default 2 */
  spawnCount?: number;
}

export interface ParticleCanvasResult {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  sceneRef: React.RefObject<HTMLDivElement>;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseLeave: () => void;
}

/**
 * 鼠标跟随粒子画布 + 3D 场景旋转 Hook
 *
 * 提供 canvas 粒子效果和基于鼠标位置的 CSS 变量驱动 3D 旋转。
 * 将 canvasRef 绑定到 <canvas>，sceneRef 绑定到需要 3D 旋转的容器。
 */
export function useParticleCanvas(options: ParticleCanvasOptions): ParticleCanvasResult {
  // 用 ref 持有配置，避免回调依赖数组引用不稳定
  const optRef = useRef(options);
  optRef.current = options;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const particleDataRef = useRef<Float32Array>(new Float32Array(options.maxParticles * 8));
  const particleColorsRef = useRef<Uint8Array>(new Uint8Array(options.maxParticles));
  const stateRef = useRef({
    activeCount: 0,
    animationId: 0,
    ctx: null as CanvasRenderingContext2D | null,
    canvasWidth: 0,
    canvasHeight: 0,
    lastMouseX: 0,
    lastMouseY: 0,
    lastMoveTime: 0,
    resizeTimer: 0,
  });

  const activateParticle = useCallback((x: number, y: number) => {
    const opt = optRef.current;
    const state = stateRef.current;
    const data = particleDataRef.current;
    const colorsArr = particleColorsRef.current;
    if (state.activeCount >= opt.maxParticles) return;

    for (let i = 0; i < opt.maxParticles; i++) {
      const offset = i * 8;
      if (data[offset + 5] <= 0) {
        const angle = Math.random() * PI2;
        const speed = Math.random() * opt.speedRange[1] + opt.speedRange[0];
        data[offset] = x;
        data[offset + 1] = y;
        data[offset + 2] = Math.cos(angle) * speed;
        data[offset + 3] = Math.sin(angle) * speed;
        data[offset + 4] = Math.random() * opt.sizeRange[1] + opt.sizeRange[0];
        data[offset + 5] = 1;
        data[offset + 6] = 0;
        data[offset + 7] = Math.random() * opt.lifeRange[1] + opt.lifeRange[0];
        colorsArr[i] = Math.floor(Math.random() * opt.colors.length);
        state.activeCount++;
        return;
      }
    }
  }, []);

  const animate = useCallback(() => {
    const opt = optRef.current;
    const state = stateRef.current;
    const data = particleDataRef.current;
    const colorsArr = particleColorsRef.current;
    if (!state.ctx) return;

    state.ctx.clearRect(0, 0, state.canvasWidth, state.canvasHeight);

    for (let i = 0; i < opt.maxParticles; i++) {
      const offset = i * 8;
      const alpha = data[offset + 5];
      if (alpha <= 0) continue;

      data[offset + 6]++;
      data[offset] += data[offset + 2];
      data[offset + 1] += data[offset + 3];

      const life = data[offset + 6];
      const maxLife = data[offset + 7];
      const newAlpha = 1 - life / maxLife;
      data[offset + 5] = newAlpha;

      if (newAlpha <= 0) {
        data[offset + 5] = 0;
        state.activeCount--;
        continue;
      }

      state.ctx.globalAlpha = newAlpha;
      state.ctx.fillStyle = opt.colors[colorsArr[i]];
      state.ctx.beginPath();
      state.ctx.arc(data[offset], data[offset + 1], data[offset + 4], 0, PI2);
      state.ctx.fill();
    }

    state.ctx.globalAlpha = 1;
    state.animationId = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const state = stateRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    state.canvasWidth = rect.width;
    state.canvasHeight = rect.height;
    canvas.width = state.canvasWidth * dpr;
    canvas.height = state.canvasHeight * dpr;
    state.ctx = canvas.getContext('2d', { alpha: true });
    if (state.ctx) {
      state.ctx.scale(dpr, dpr);
    }
    animate();

    const handleResize = () => {
      clearTimeout(state.resizeTimer);
      state.resizeTimer = window.setTimeout(() => {
        if (!canvas || !state.ctx) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        state.canvasWidth = rect.width;
        state.canvasHeight = rect.height;
        canvas.width = state.canvasWidth * dpr;
        canvas.height = state.canvasHeight * dpr;
        state.ctx.scale(dpr, dpr);
      }, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(state.animationId);
      clearTimeout(state.resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [animate]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const opt = optRef.current;
      const state = stateRef.current;
      const now = performance.now();
      if (now - state.lastMoveTime < 16) return;
      state.lastMoveTime = now;

      const dx = e.clientX - state.lastMouseX;
      const dy = e.clientY - state.lastMouseY;

      if (dx * dx + dy * dy > 25) {
        state.lastMouseX = e.clientX;
        state.lastMouseY = e.clientY;
        const count = opt.spawnCount ?? 2;
        for (let i = 0; i < count; i++) {
          activateParticle(
            e.clientX + (Math.random() - 0.5) * opt.spawnSpread,
            e.clientY + (Math.random() - 0.5) * opt.spawnSpread,
          );
        }
      }

      if (sceneRef.current) {
        const rotateY = (e.clientX - window.innerWidth / 2) / opt.rotationDivisor;
        const rotateX = -(e.clientY - window.innerHeight / 2) / opt.rotationDivisor;
        sceneRef.current.style.setProperty('--rx', `${rotateX}deg`);
        sceneRef.current.style.setProperty('--ry', `${rotateY}deg`);
      }
    },
    [activateParticle],
  );

  const handleMouseLeave = useCallback(() => {
    if (sceneRef.current) {
      sceneRef.current.style.setProperty('--rx', '0deg');
      sceneRef.current.style.setProperty('--ry', '0deg');
    }
  }, []);

  return { canvasRef, sceneRef, handleMouseMove, handleMouseLeave };
}
