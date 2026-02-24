import { Skeleton } from 'antd';
import styles from './index.module.scss';

interface CardSkeletonProps {
  count?: number;
  rows?: number;
  columns?: number;
}

export default function CardSkeleton({ count = 4, rows = 3, columns = 2 }: CardSkeletonProps) {
  return (
    <div className={styles.cardSkeleton} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.cardSkeletonItem}>
          <Skeleton active paragraph={{ rows }} />
        </div>
      ))}
    </div>
  );
}
