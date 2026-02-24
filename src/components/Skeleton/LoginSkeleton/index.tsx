import { Skeleton } from 'antd';
import styles from './index.module.scss';

export default function LoginSkeleton() {
  return (
    <div className={styles.loginSkeleton}>
      <div className={styles.header}>
        <Skeleton.Image active style={{ width: 53, height: 53 }} />
        <div className={styles.headerText}>
          <Skeleton.Input active style={{ width: 180, height: 24, marginBottom: 6 }} />
          <Skeleton.Input active style={{ width: 280, height: 24 }} />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.qr}>
          <Skeleton.Image active style={{ width: 200, height: 200 }} />
          <Skeleton.Input active style={{ width: 120, height: 16, marginTop: 16 }} />
        </div>

        <div className={styles.divider} />

        <div className={styles.form}>
          <Skeleton.Input active style={{ width: 160, height: 50, marginBottom: 36 }} />
          <div className={styles.formItems}>
            <Skeleton.Input active style={{ width: '100%', height: 48, marginBottom: 20 }} />
            <Skeleton.Input active style={{ width: '100%', height: 48, marginBottom: 20 }} />
            <Skeleton.Button active style={{ width: '100%', height: 48 }} />
          </div>
          <Skeleton.Input active style={{ width: 80, height: 20, marginTop: 8 }} />
        </div>
      </div>
    </div>
  );
}
