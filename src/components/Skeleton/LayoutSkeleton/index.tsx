import { Skeleton } from 'antd';
import styles from './index.module.scss';

interface LayoutSkeletonProps {
  menuItems?: number;
  cardCount?: number;
  cardRows?: number;
}

export default function LayoutSkeleton({ menuItems = 6, cardCount = 4, cardRows = 3 }: LayoutSkeletonProps) {
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

      <div className={styles.nav}>
        {Array.from({ length: menuItems }).map((_, i) => (
          <Skeleton.Avatar key={i} active size={45} style={{ marginBottom: 4 }} />
        ))}
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
