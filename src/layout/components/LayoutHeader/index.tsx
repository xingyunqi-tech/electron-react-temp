import { memo } from 'react';
import classNames from 'classnames';
import LogoIcon from '../LogoIcon/index';
import LogoTitle from '../LogoTitle/index';
import ThemeSwitcher from '../ThemeSwitcher/index';
import LanguageSwitcher from '../LanguageSwitcher/index';
import SettingButton from '../SettingButton/index';
import HeaderAvatar from '../HeaderAvatar/index';
import { useHeaderControl } from '../../LayoutContext';
import styles from './index.module.scss';

interface LayoutHeaderProps {
  logoTitle?: string;
  menu?: React.ReactNode;
  className?: string;
}

function LayoutHeader({ logoTitle = '', menu, className }: LayoutHeaderProps) {
  const { headerVisible } = useHeaderControl();

  return (
    <header className={classNames(styles.layoutHeader, className)}>
      <div className={styles.headerLeft}>
        {headerVisible.logoIcon && <LogoIcon />}
        {headerVisible.logoIcon && headerVisible.logoTitle && <div className={styles.divider} />}
        {headerVisible.logoTitle && <LogoTitle title={logoTitle} />}
      </div>

      <div className={styles.headerCenter}>{headerVisible.nav && <nav className={styles.menuNav}>{menu}</nav>}</div>

      <div className={styles.headerRight}>
        {headerVisible.themeSwitch && <ThemeSwitcher />}
        {headerVisible.localeSwitch && <LanguageSwitcher />}
        {headerVisible.setting && <SettingButton />}
        {headerVisible.avatar && <HeaderAvatar />}
      </div>
    </header>
  );
}

export default memo(LayoutHeader);
