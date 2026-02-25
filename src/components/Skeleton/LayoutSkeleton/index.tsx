import { Skeleton } from 'antd';
import styles from './index.module.scss';

interface LayoutSkeletonProps {
  cardCount?: number;
  cardRows?: number;
}

export default function LayoutSkeleton({ cardCount = 4, cardRows = 3 }: LayoutSkeletonProps) {
  return (
    <div className={styles.layoutSkeleton}>
      <div className={styles.header}>
        <Skeleton.Input active style={{ width: 120, height: 40 }} />
        <div className={styles.headerCenter} />
        <div className={styles.headerRight}>
          <Skeleton.Avatar active size={24} />
          <Skeleton.Avatar active size={24} />
          <Skeleton.Avatar active size={40} />
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.cards}>
          {Array.from({ length: cardCount }).map((_, i) => (
            <div key={i} className={styles.card}>
              <Skeleton active paragraph={{ rows: cardRows }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
