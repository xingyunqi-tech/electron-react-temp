import { ANNOUNCEMENT_TEXT } from '@/constants/site';

import styles from './index.module.scss';

interface AnnouncementBarProps {
  className?: string;
}

export default function AnnouncementBar({ className }: AnnouncementBarProps) {
  return (
    <div className={`${styles.announcement}${className ? ` ${className}` : ''}`}>
      <span>{ANNOUNCEMENT_TEXT}</span>
    </div>
  );
}
