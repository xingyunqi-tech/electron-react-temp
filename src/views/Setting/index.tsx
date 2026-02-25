import { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { SettingOutlined, BgColorsOutlined } from '@ant-design/icons';
import styles from './index.module.scss';

export default function SettingLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuProps['items'] = useMemo(
    () => [
      { key: '/setting/frontend', label: '前端配置', icon: <SettingOutlined /> },
      { key: '/setting/theme', label: '主题配置', icon: <BgColorsOutlined /> },
    ],
    [],
  );

  const selectedKeys = useMemo(() => {
    const currentPath = location.pathname;
    const activeItem = menuItems?.find(item => item && 'key' in item && currentPath.startsWith(item.key as string));
    return activeItem ? [activeItem.key as string] : ['/setting/frontend'];
  }, [location.pathname, menuItems]);

  const handleSelect: MenuProps['onSelect'] = ({ key }) => {
    navigate(key);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftNav}>
        <Menu className={styles.leftNavMenu} selectedKeys={selectedKeys} items={menuItems} onSelect={handleSelect} />
      </div>
      <div className={styles.rightMain}>
        <Outlet />
      </div>
    </div>
  );
}
