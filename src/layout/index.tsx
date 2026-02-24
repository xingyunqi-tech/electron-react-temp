import { useEffect } from 'react';
import { useLocation, useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ConfigProvider, theme as antdTheme } from 'antd';
import LayoutHeader from './components/LayoutHeader/index';
import LayoutMenu from './components/LayoutMenu/index';
import LayoutMain from './components/LayoutMain/index';
import { LayoutProvider, useLayout } from './LayoutContext';
import styles from './index.module.scss';

function LayoutContent() {
  const { t } = useTranslation();
  const location = useLocation();
  const matches = useMatches();
  const { layoutVisible, setLayoutVisible, setHeaderVisible, setLogoConfig, setCustomMenuList, resetAll } = useLayout();

  // 监听路由变化，应用 Layout 配置
  useEffect(() => {
    resetAll();

    // 查找当前路由的 layout 配置
    const currentMatch = matches[matches.length - 1];
    const handle = currentMatch?.handle as { layout?: any } | undefined;
    const layoutConfig = handle?.layout;

    if (layoutConfig) {
      if (layoutConfig.layout) setLayoutVisible(layoutConfig.layout);
      if (layoutConfig.header) setHeaderVisible(layoutConfig.header);
      if (layoutConfig.logo) setLogoConfig(layoutConfig.logo);
      if (layoutConfig.customMenu) setCustomMenuList(layoutConfig.customMenu);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div className={styles.layoutContainer}>
      {layoutVisible.header && (
        <ConfigProvider theme={{ algorithm: antdTheme.darkAlgorithm }}>
          <LayoutHeader logoTitle={t('layout.systemTitle')} className={styles.areaHeader} />
        </ConfigProvider>
      )}
      {layoutVisible.nav && <LayoutMenu className={styles.areaNav} />}
      <LayoutMain className={styles.areaMain} />
    </div>
  );
}

export default function Layout() {
  return (
    <LayoutProvider>
      <LayoutContent />
    </LayoutProvider>
  );
}
