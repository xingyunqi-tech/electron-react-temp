import { Skeleton } from 'antd';
import styles from './index.module.scss';

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  showSearchBar?: boolean;
  searchFields?: number;
  showToolbar?: boolean;
  showPagination?: boolean;
}

export default function TableSkeleton({
  columns = 5,
  rows = 8,
  showSearchBar = true,
  searchFields = 3,
  showToolbar = true,
  showPagination = true,
}: TableSkeletonProps) {
  const gridColumns = { gridTemplateColumns: `repeat(${columns}, 1fr)` };

  return (
    <div className={styles.tableSkeleton}>
      {showSearchBar && (
        <div className={styles.searchBar}>
          {Array.from({ length: searchFields }).map((_, i) => (
            <Skeleton.Input key={i} active style={{ flex: 1, maxWidth: 200, height: 40 }} />
          ))}
          <Skeleton.Button active style={{ width: 80, height: 40 }} />
        </div>
      )}

      {showToolbar && (
        <div className={styles.toolbar}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton.Button key={i} active style={{ width: 100, height: 36 }} />
          ))}
        </div>
      )}

      <div className={styles.table}>
        <div className={styles.header} style={gridColumns}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton.Input key={i} active size="small" style={{ height: 20 }} />
          ))}
        </div>
        <div className={styles.body}>
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className={styles.row} style={gridColumns}>
              {Array.from({ length: columns }).map((_, j) => (
                <Skeleton.Input key={j} active size="small" style={{ height: 16, width: j === 0 ? '60%' : '80%' }} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {showPagination && (
        <div className={styles.pagination}>
          <Skeleton.Input active style={{ width: 200, height: 32 }} />
        </div>
      )}
    </div>
  );
}
