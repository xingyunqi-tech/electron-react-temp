import { memo, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import LogoIcon from '../LogoIcon/index';
import LogoTitle from '../LogoTitle/index';
import ThemeSwitcher from '../ThemeSwitcher/index';
import LanguageSwitcher from '../LanguageSwitcher/index';
import SettingButton from '../SettingButton/index';
import HeaderAvatar from '../HeaderAvatar/index';
import { useLayout, type MenuItem } from '../../LayoutContext';
import styles from './index.module.scss';

type AntMenuItem = Required<MenuProps>['items'][number];

function toAntMenuItems(items: MenuItem[]): AntMenuItem[] {
  return items.map(item => ({
    key: item.path || item.key,
    label: item.label,
    children: item.children ? toAntMenuItems(item.children) : undefined,
  }));
}

interface LayoutHeaderProps {
  logoTitle?: string;
  className?: string;
}

function LayoutHeader({ logoTitle = '', className }: LayoutHeaderProps) {
  const { t } = useTranslation();
  const { headerVisible, customMenuList } = useLayout();
  const navigate = useNavigate();
  const location = useLocation();

  const defaultMenuItems: AntMenuItem[] = useMemo(
    () => [{ key: '/home', icon: <HomeOutlined />, label: t('layout.home') }],
    [t],
  );

  const menuItems = useMemo(
    () => (customMenuList.length > 0 ? toAntMenuItems(customMenuList) : defaultMenuItems),
    [customMenuList, defaultMenuItems],
  );

  const selectedKeys = useMemo(() => {
    const currentPath = location.pathname;
    const matched = menuItems.find(item => {
      const key = (item as { key: string }).key;
      return currentPath === key || currentPath.startsWith(key + '/');
    });
    return matched ? [(matched as { key: string }).key] : [];
  }, [location.pathname, menuItems]);

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  return (
    <header className={classNames(styles.layoutHeader, className)}>
      <div className={styles.headerLeft}>
        {headerVisible.logoIcon && <LogoIcon />}
        {headerVisible.logoIcon && headerVisible.logoTitle && <div className={styles.divider} />}
        {headerVisible.logoTitle && <LogoTitle title={logoTitle} />}
      </div>

      <div className={styles.headerCenter}>
        {headerVisible.nav && (
          <Menu
            className={styles.headerMenu}
            mode="horizontal"
            selectedKeys={selectedKeys}
            items={menuItems}
            onClick={handleMenuClick}
          />
        )}
      </div>

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
