import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/store';
import { message } from '@/components/StaticFunction';
import { advanceModeTapAction } from '@/store/modules/global';
import { useLayout } from '../../LayoutContext';
import logoImg from '@/assets/images/common/logo.png';

interface LogoIconProps {
  className?: string;
}

function LogoIcon({ className }: LogoIconProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { logoConfig } = useLayout();
  const iconSrc = logoConfig.icon || logoImg;

  const handleClick = () => {
    const result = dispatch(advanceModeTapAction());
    if (result !== null) {
      message.success(result ? t('layout.advanceModeOn') : t('layout.advanceModeOff'));
    }
  };

  return (
    <div className={className} onClick={handleClick} style={{ cursor: 'pointer' }}>
      <img src={iconSrc} alt="Logo" style={{ width: 32, height: 32, objectFit: 'cover' }} />
    </div>
  );
}

export default memo(LogoIcon);
