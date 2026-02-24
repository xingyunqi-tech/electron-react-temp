import { memo, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import styles from './index.module.scss';

type AntMenuItem = Required<MenuProps>['items'][number];

const menuItems: AntMenuItem[] = [{ key: '/home', icon: <PieChartOutlined />, label: '首页' }];

function LayoutMenu({ className }: { className?: string }) {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKeys = useMemo(() => {
    const currentPath = location.pathname;
    const matched = menuItems.find(item => {
      const key = (item as { key: string }).key;
      return currentPath === key || currentPath.startsWith(key + '/');
    });
    return matched ? [(matched as { key: string }).key] : [];
  }, [location.pathname]);

  const handleClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  return (
    <div className={classNames(styles.layoutMenu, className)}>
      <Menu
        className={styles.sideMenu}
        mode="inline"
        inlineCollapsed
        selectedKeys={selectedKeys}
        items={menuItems}
        onClick={handleClick}
      />
    </div>
  );
}

export default memo(LayoutMenu);
