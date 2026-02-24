import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import styles from './index.module.scss';
import classNames from 'classnames';

export default function LayoutMain({ className }: { className?: string }) {
  return (
    <main className={classNames(styles.layoutMain, className)}>
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </main>
  );
}
