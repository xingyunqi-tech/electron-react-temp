import { memo } from 'react';
import { useAppDispatch } from '@/store';
import { message } from '@/components/StaticFunction';
import { advanceModeTapAction } from '@/store/modules/global';
import { useLogoConfig } from '../../LayoutContext';
import logoImg from '@/assets/images/common/logo.png';

interface LogoIconProps {
  className?: string;
}

function LogoIcon({ className }: LogoIconProps) {
  const dispatch = useAppDispatch();
  const { logoConfig } = useLogoConfig();
  const iconSrc = logoConfig.icon || logoImg;

  const handleClick = () => {
    const result = dispatch(advanceModeTapAction());
    if (result !== null) {
      message.success(result ? '已开启高级模式' : '已关闭高级模式');
    }
  };

  return (
    <div className={className} onClick={handleClick} style={{ cursor: 'pointer' }}>
      <img src={iconSrc} alt="Logo" style={{ width: 32, height: 32, objectFit: 'cover' }} />
    </div>
  );
}

export default memo(LogoIcon);
