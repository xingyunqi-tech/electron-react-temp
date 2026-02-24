import { createContext, useContext, useCallback, useMemo, useState } from 'react';

// 布局可见性类型
export interface LayoutVisible {
  header: boolean;
  nav: boolean;
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
const defaultLayoutConfig: LayoutVisible = { header: true, nav: true };
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
const hiddenLayoutConfig: LayoutVisible = { header: false, nav: false };
const hiddenHeaderConfig: HeaderVisible = {
  logoIcon: false,
  logoTitle: false,
  nav: false,
  themeSwitch: false,
  localeSwitch: false,
  setting: false,
  avatar: false,
};

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
  hideLayout: () => void;
  showLayout: () => void;
  hideHeader: () => void;
  showHeader: () => void;
  resetCustomMenuList: () => void;
  resetLayout: () => void;
  resetHeader: () => void;
  resetLogo: () => void;
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

  const hideLayout = useCallback(() => setLayoutVisibleState({ ...hiddenLayoutConfig }), []);
  const showLayout = useCallback(() => setLayoutVisibleState({ ...defaultLayoutConfig }), []);
  const hideHeader = useCallback(() => setHeaderVisibleState({ ...hiddenHeaderConfig }), []);
  const showHeader = useCallback(() => setHeaderVisibleState({ ...defaultHeaderConfig }), []);
  const resetCustomMenuList = useCallback(() => setCustomMenuList([]), []);
  const resetLayout = useCallback(() => setLayoutVisibleState({ ...defaultLayoutConfig }), []);
  const resetHeader = useCallback(() => setHeaderVisibleState({ ...defaultHeaderConfig }), []);
  const resetLogo = useCallback(() => setLogoConfigState({ ...defaultLogoConfig }), []);
  const resetAll = useCallback(() => {
    resetLayout();
    resetHeader();
    resetLogo();
    resetCustomMenuList();
  }, [resetLayout, resetHeader, resetLogo, resetCustomMenuList]);

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
      hideLayout,
      showLayout,
      hideHeader,
      showHeader,
      resetCustomMenuList,
      resetLayout,
      resetHeader,
      resetLogo,
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
      hideLayout,
      showLayout,
      hideHeader,
      showHeader,
      resetCustomMenuList,
      resetLayout,
      resetHeader,
      resetLogo,
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

/**
 * 控制头部组件显隐
 */
export function useHeaderControl() {
  const { headerVisible, setHeaderVisible, hideHeader, showHeader, resetHeader } = useLayout();
  return { headerVisible, setHeaderVisible, hideHeader, showHeader, reset: resetHeader };
}

/**
 * 控制布局显隐
 */
export function useLayoutControl() {
  const { layoutVisible, setLayoutVisible, hideLayout, showLayout, resetLayout } = useLayout();
  return { layoutVisible, setLayoutVisible, hideLayout, showLayout, reset: resetLayout };
}

/**
 * 控制Logo配置
 */
export function useLogoConfig() {
  const { logoConfig, setLogoConfig, resetLogo } = useLayout();
  return { logoConfig, setLogoConfig, reset: resetLogo };
}

/**
 * 控制自定义菜单列表
 */
export function useCustomMenuList() {
  const { customMenuList, setCustomMenuList, resetCustomMenuList } = useLayout();
  return { customMenuList, setCustomMenuList, reset: resetCustomMenuList };
}

/**
 * 控制导航区域显隐
 */
export function useNavControl() {
  const { layoutVisible, setLayoutVisible } = useLayout();
  const showNav = useCallback(() => setLayoutVisible({ nav: true }), [setLayoutVisible]);
  const hideNav = useCallback(() => setLayoutVisible({ nav: false }), [setLayoutVisible]);
  const reset = useCallback(() => setLayoutVisible({ nav: defaultLayoutConfig.nav }), [setLayoutVisible]);
  return { navVisible: layoutVisible.nav, showNav, hideNav, reset };
}
