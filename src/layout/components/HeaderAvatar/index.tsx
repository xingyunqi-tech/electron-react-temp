import { Dropdown, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/store';
import { logoutAction } from '@/store/modules/user';
import { resetPermissionAction } from '@/store/modules/permission';
import { message, modal } from '@/components/StaticFunction';
import type { MenuProps } from 'antd';
import styles from './index.module.scss';

export default function HeaderAvatar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    modal.confirm({
      title: t('layout.tip'),
      content: t('layout.logoutConfirm'),
      onOk: async () => {
        await dispatch(logoutAction()).unwrap();
        dispatch(resetPermissionAction());
        message.success(t('layout.logoutSuccess'));
        navigate('/login');
      },
    });
  };

  const items: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('layout.logout'),
    },
  ];

  const handleClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') handleLogout();
  };

  return (
    <Dropdown menu={{ items, onClick: handleClick }}>
      <div className={styles.userInfo}>
        <Avatar size={32} icon={<UserOutlined />} />
      </div>
    </Dropdown>
  );
}
