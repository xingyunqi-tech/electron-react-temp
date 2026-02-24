import { memo, useCallback } from 'react';
import { Segmented } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import type { ThemeStyleKey } from '@/interface/system';
import { currentThemeSelector, setThemeAction } from '@/store/modules/global';
import { useAppSelector, useAppDispatch } from '@/store';

const themeOptions = [
  { value: 'light', icon: <SunOutlined /> },
  { value: 'dark', icon: <MoonOutlined /> },
];

interface ThemeSwitcherProps {
  className?: string;
}

function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector(currentThemeSelector);

  const handleChange = useCallback(
    (value: string) => {
      dispatch(setThemeAction(value as ThemeStyleKey));
    },
    [dispatch],
  );

  return <Segmented className={className} value={currentTheme} options={themeOptions} onChange={handleChange} />;
}

export default memo(ThemeSwitcher);
