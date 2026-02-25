import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useParticleCanvas } from '@/hooks/useParticleCanvas';
import type { ParticleCanvasOptions } from '@/hooks/useParticleCanvas';
import styles from './index.module.scss';

// Pre-compute star styles
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

// Pre-compute floating particle styles
const floatingParticleStyles = Array.from({ length: 12 }, () => {
  const size = Math.random() * 8 + 4;
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${Math.random() * 10 + 10}s`,
  };
});

const PARTICLE_OPTIONS: ParticleCanvasOptions = {
  maxParticles: 80,
  colors: ['#40e0d0', '#8a2be2', '#00ffff', '#ff00ff', '#7b68ee'],
  speedRange: [1, 2],
  sizeRange: [2, 4],
  lifeRange: [20, 40],
  spawnSpread: 8,
  rotationDivisor: 60,
};

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { canvasRef, sceneRef, handleMouseMove, handleMouseLeave } = useParticleCanvas(PARTICLE_OPTIONS);

  const handleGoMain = useCallback(() => navigate('/'), [navigate]);
  const handleGoBack = useCallback(() => navigate(-1), [navigate]);

  const cubeFace = (label?: string) => (
    <>
      <div className={classNames(styles.cubeFace, styles.front)}>{label}</div>
      <div className={classNames(styles.cubeFace, styles.back)}>{label}</div>
      <div className={classNames(styles.cubeFace, styles.right)} />
      <div className={classNames(styles.cubeFace, styles.left)} />
      <div className={classNames(styles.cubeFace, styles.top)} />
      <div className={classNames(styles.cubeFace, styles.bottom)} />
    </>
  );

  return (
    <div className={styles.errorPage} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div className={styles.bgStars}>
        {starStyles.map((style, i) => (
          <div key={i} className={styles.star} style={style} />
        ))}
      </div>

      <canvas ref={canvasRef} className={styles.mouseParticlesCanvas} />

      <div ref={sceneRef} className={styles.scene}>
        <div className={styles.cubeContainer}>
          <div className={classNames(styles.cube, styles.cube4Left)}>{cubeFace('4')}</div>
          <div className={classNames(styles.cube, styles.cube0)}>{cubeFace('0')}</div>
          <div className={classNames(styles.cube, styles.cube4Right)}>{cubeFace('4')}</div>
        </div>

        <div className={styles.glowRing} />

        <div className={styles.infoCard}>
          <h2 className={styles.infoTitle}>页面走丢了</h2>
          <p className={styles.infoDesc}>抱歉，您访问的页面已飘向宇宙深处...</p>
          <div className={styles.infoActions}>
            <button className={classNames(styles.actionBtn, styles.primaryBtn)} onClick={handleGoMain}>
              <span className={styles.btnText}>返回首页</span>
              <span className={styles.btnGlow} />
            </button>
            <button className={classNames(styles.actionBtn, styles.ghostBtn)} onClick={handleGoBack}>
              <span className={styles.btnText}>返回上页</span>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.particles}>
        {floatingParticleStyles.map((style, i) => (
          <div key={i} className={styles.particle} style={style} />
        ))}
      </div>
    </div>
  );
}
