import { useState, useEffect, useRef, useCallback, CSSProperties } from 'react';
import { Image, Spin } from 'antd';
import { LoadingOutlined, PictureOutlined } from '@ant-design/icons';
import styles from './index.module.scss';
import classNames from 'classnames';

interface LazyImageProps {
  src: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  fit?: CSSProperties['objectFit'];
  lazy?: boolean;
  radius?: string | number;
  className?: string;
  previewSrcList?: string[];
  retry?: boolean;
  retryCount?: number;
  retryDelay?: number;
  showErrorText?: boolean;
  errorText?: string;
  onLoad?: () => void;
  onError?: () => void;
  overlay?: React.ReactNode;
}

export default function LazyImage({
  src,
  alt = '',
  width = '100%',
  height = 'auto',
  fit = 'cover',
  lazy = true,
  radius = 0,
  className,
  previewSrcList,
  retry = true,
  retryCount = 3,
  retryDelay = 1000,
  showErrorText = true,
  errorText = '图片加载失败',
  onLoad,
  onError,
  overlay,
}: LazyImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentSrc, setCurrentSrc] = useState(src);
  const retriesRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const innerTimerRef = useRef<number | null>(null);

  useEffect(() => {
    retriesRef.current = 0;
    setStatus('loading');
    setCurrentSrc(src);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (innerTimerRef.current) clearTimeout(innerTimerRef.current);
    };
  }, [src]);

  const handleLoad = useCallback(() => {
    setStatus('loaded');
    retriesRef.current = 0;
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    if (retry && retriesRef.current < retryCount) {
      retriesRef.current++;
      timerRef.current = window.setTimeout(() => {
        setCurrentSrc('');
        innerTimerRef.current = window.setTimeout(() => setCurrentSrc(src), 50);
      }, retryDelay);
      return;
    }
    setStatus('error');
    onError?.();
  }, [retry, retryCount, retryDelay, src, onError]);

  const containerStyle: CSSProperties = {
    width,
    height,
    borderRadius: radius,
    overflow: radius ? 'hidden' : undefined,
  };

  const preview = previewSrcList && previewSrcList.length > 0;

  return (
    <div className={classNames(styles.wrapper, className, { [styles.hasOverlay]: !!overlay })} style={containerStyle}>
      {currentSrc ? (
        <Image
          src={currentSrc}
          alt={alt}
          loading={lazy ? 'lazy' : 'eager'}
          style={{ objectFit: fit, width: '100%', height: '100%' }}
          preview={preview ? { src: previewSrcList![0] } : false}
          onLoad={handleLoad}
          onError={handleError}
          placeholder={
            <div className={styles.loading}>
              <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} />} />
            </div>
          }
          fallback=""
        />
      ) : (
        <div className={styles.loading}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} />} />
        </div>
      )}

      {status === 'error' && (
        <div className={styles.error}>
          <PictureOutlined style={{ fontSize: 48 }} />
          {showErrorText && <p className={styles.errorText}>{errorText}</p>}
        </div>
      )}

      {overlay && status === 'loaded' && <div className={styles.overlay}>{overlay}</div>}
    </div>
  );
}
