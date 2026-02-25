import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '../../LayoutContext';

interface LogoTitleProps {
  title?: string;
  className?: string;
}

function LogoTitle({ title = '', className }: LogoTitleProps) {
  const navigate = useNavigate();
  const { logoConfig } = useLayout();
  const displayTitle = logoConfig.title ?? title;

  const handleClick = () => {
    navigate('/');
  };

  return (
    <h1
      className={className}
      onClick={handleClick}
      style={{
        fontSize: 16,
        fontWeight: 600,
        lineHeight: 1.32,
        margin: 0,
        whiteSpace: 'nowrap',
        cursor: 'pointer',
      }}
    >
      {displayTitle}
    </h1>
  );
}

export default memo(LogoTitle);
