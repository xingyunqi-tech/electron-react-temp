import { memo } from 'react';
import { Button, Tooltip } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { advanceModeSelector } from '@/store/modules/global';

interface SettingButtonProps {
  className?: string;
}

function SettingButton({ className }: SettingButtonProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const advanceMode = useAppSelector(advanceModeSelector);

  if (!advanceMode) return null;

  return (
    <Tooltip title={t('layout.settings')} placement="bottom">
      <Button
        className={className}
        type="text"
        icon={<SettingOutlined style={{ fontSize: 20 }} />}
        shape="circle"
        onClick={() => navigate('/setting')}
      />
    </Tooltip>
  );
}

export default memo(SettingButton);
