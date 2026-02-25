import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useParticleCanvas } from '@/hooks/useParticleCanvas';
import type { ParticleCanvasOptions } from '@/hooks/useParticleCanvas';
import styles from './index.module.scss';

// Pre-compute data stream styles
const streamStyles = Array.from({ length: 6 }, (_, i) => ({
  left: `${i * 16 + Math.random() * 8}%`,
  animationDelay: `${Math.random() * 4}s`,
  animationDuration: `${Math.random() * 2 + 3}s`,
  height: `${Math.random() * 80 + 40}px`,
}));

const PARTICLE_OPTIONS: ParticleCanvasOptions = {
  maxParticles: 60,
  colors: ['#ff0000', '#ff4444', '#ff6666', '#cc0000', '#ff3333'],
  speedRange: [1, 3],
  sizeRange: [2, 5],
  lifeRange: [15, 30],
  spawnSpread: 12,
  rotationDivisor: 50,
};

export default function ForbiddenPage() {
  const navigate = useNavigate();
  const { canvasRef, sceneRef, handleMouseMove, handleMouseLeave } = useParticleCanvas(PARTICLE_OPTIONS);

  const goHome = useCallback(() => navigate('/'), [navigate]);
  const goBack = useCallback(() => navigate(-1), [navigate]);

  return (
    <div className={styles.forbiddenPage} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div className={styles.gridBg} />
      <div className={styles.scanLine} />
      <canvas ref={canvasRef} className={styles.mouseParticlesCanvas} />

      <div ref={sceneRef} className={styles.scene}>
        {/* 3D Lock */}
        <div className={styles.lockContainer}>
          <div className={styles.lockBody}>
            <div className={classNames(styles.lockFace, styles.lockFront)}>
              <div className={styles.keyhole}>
                <div className={styles.keyholeCircle} />
                <div className={styles.keyholeRect} />
              </div>
            </div>
            <div className={classNames(styles.lockFace, styles.lockBack)} />
            <div className={classNames(styles.lockFace, styles.lockRight)} />
            <div className={classNames(styles.lockFace, styles.lockLeft)} />
            <div className={classNames(styles.lockFace, styles.lockTop)} />
            <div className={classNames(styles.lockFace, styles.lockBottom)} />
          </div>
          <div className={styles.lockShackle}>
            <div className={styles.shackleLeft} />
            <div className={styles.shackleTop} />
            <div className={styles.shackleRight} />
          </div>
        </div>

        {/* Warning code */}
        <div className={styles.warningCode}>
          <span className={styles.digit}>4</span>
          <span className={styles.digit}>0</span>
          <span className={styles.digit}>3</span>
        </div>

        {/* Warning rings */}
        <div className={styles.warningRings}>
          <div className={classNames(styles.ring, styles.ring1)} />
          <div className={classNames(styles.ring, styles.ring2)} />
          <div className={classNames(styles.ring, styles.ring3)} />
        </div>

        {/* Info panel */}
        <div className={styles.infoPanel}>
          <div className={styles.panelHeader}>
            <span className={styles.statusDot} />
            <span className={styles.statusText}>ACCESS DENIED</span>
          </div>
          <h2 className={styles.panelTitle}>无访问权限</h2>
          <p className={styles.panelDesc}>您没有权限访问此区域，请联系管理员获取授权</p>
          <div className={styles.panelActions}>
            <button className={classNames(styles.actionBtn, styles.dangerBtn)} onClick={goHome}>
              <span className={styles.btnIcon}>⌂</span>
              <span>返回首页</span>
            </button>
            <button className={classNames(styles.actionBtn, styles.outlineBtn)} onClick={goBack}>
              <span className={styles.btnIcon}>←</span>
              <span>返回上页</span>
            </button>
          </div>
        </div>
      </div>

      {/* Corners */}
      <div className={classNames(styles.corner, styles.cornerTl)} />
      <div className={classNames(styles.corner, styles.cornerTr)} />
      <div className={classNames(styles.corner, styles.cornerBl)} />
      <div className={classNames(styles.corner, styles.cornerBr)} />

      {/* Data streams */}
      <div className={styles.dataStreams}>
        {streamStyles.map((style, i) => (
          <div key={i} className={styles.dataStream} style={style} />
        ))}
      </div>
    </div>
  );
}
