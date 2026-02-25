import { createContext, useContext, useCallback, useMemo, useState } from 'react';

// 布局可见性类型
export interface LayoutVisible {
  header: boolean;
}

// 头部组件可见性类型
export interface HeaderVisible {
  logoIcon: boolean;
  logoTitle: boolean;
  nav: boolean;
  themeSwitch: boolean;
  localeSwitch: boolean;
  setting: boolean;
  avatar: boolean;
}

// Logo配置类型
export interface LogoConfig {
  icon?: string;
  title?: string | null;
}

// 菜单项类型
export interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
}

// 默认配置
const defaultLayoutConfig: LayoutVisible = { header: true };
const defaultHeaderConfig: HeaderVisible = {
  logoIcon: true,
  logoTitle: true,
  nav: true,
  themeSwitch: true,
  localeSwitch: true,
  setting: true,
  avatar: true,
};
const defaultLogoConfig: LogoConfig = { icon: undefined, title: undefined };

// 布局上下文类型
export interface LayoutContextType {
  layoutVisible: LayoutVisible;
  headerVisible: HeaderVisible;
  logoConfig: LogoConfig;
  customMenuList: MenuItem[];
  setLayoutVisible: (visible: Partial<LayoutVisible>) => void;
  setHeaderVisible: (visible: Partial<HeaderVisible>) => void;
  setLogoConfig: (config: Partial<LogoConfig>) => void;
  setCustomMenuList: (menuList: MenuItem[]) => void;
  resetAll: () => void;
}

const LayoutContext = createContext<LayoutContextType | null>(null);

/**
 * 布局上下文 Provider
 */
export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [layoutVisible, setLayoutVisibleState] = useState<LayoutVisible>({ ...defaultLayoutConfig });
  const [headerVisible, setHeaderVisibleState] = useState<HeaderVisible>({ ...defaultHeaderConfig });
  const [logoConfig, setLogoConfigState] = useState<LogoConfig>({ ...defaultLogoConfig });
  const [customMenuList, setCustomMenuList] = useState<MenuItem[]>([]);

  const setLayoutVisible = useCallback((visible: Partial<LayoutVisible>) => {
    setLayoutVisibleState(prev => ({ ...prev, ...visible }));
  }, []);

  const setHeaderVisible = useCallback((visible: Partial<HeaderVisible>) => {
    setHeaderVisibleState(prev => ({ ...prev, ...visible }));
  }, []);

  const setLogoConfig = useCallback((config: Partial<LogoConfig>) => {
    setLogoConfigState(prev => ({ ...prev, ...config }));
  }, []);

  const resetAll = useCallback(() => {
    setLayoutVisibleState({ ...defaultLayoutConfig });
    setHeaderVisibleState({ ...defaultHeaderConfig });
    setLogoConfigState({ ...defaultLogoConfig });
    setCustomMenuList([]);
  }, []);

  const value = useMemo<LayoutContextType>(
    () => ({
      layoutVisible,
      headerVisible,
      logoConfig,
      customMenuList,
      setLayoutVisible,
      setHeaderVisible,
      setLogoConfig,
      setCustomMenuList,
      resetAll,
    }),
    [
      layoutVisible,
      headerVisible,
      logoConfig,
      customMenuList,
      setLayoutVisible,
      setHeaderVisible,
      setLogoConfig,
      setCustomMenuList,
      resetAll,
    ],
  );

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

/**
 * 使用布局上下文
 */
export function useLayout(): LayoutContextType {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
