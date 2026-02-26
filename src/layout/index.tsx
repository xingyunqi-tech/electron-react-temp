import { useEffect } from 'react';
import { useLocation, useMatches } from 'react-router-dom';
import type { RouteMeta } from '../../typings/router';
import LayoutHeader from './components/LayoutHeader/index';
import LayoutMain from './components/LayoutMain/index';
import { LayoutProvider, useLayout } from './LayoutContext';
import { useFrontendConfig } from '@/hooks/useFrontendConfig';
import { useAppSelector } from '@/store';
import { currentLocaleSelector } from '@/store/modules/global';
import { ConfigProvider, Watermark, theme as antdTheme } from 'antd';
import type { WatermarkProps } from 'antd';
import styles from './index.module.scss';

function LayoutContent() {
  const location = useLocation();
  const matches = useMatches();
  const config = useFrontendConfig();
  const currentLocale = useAppSelector(currentLocaleSelector);
  const { layoutVisible, setLayoutVisible, setHeaderVisible, setLogoConfig, setCustomMenuList, resetAll } = useLayout();

  // 前端配置的 logoImage 变化时同步到 LayoutContext
  useEffect(() => {
    if (config.basic.logoImage) {
      setLogoConfig({ icon: config.basic.logoImage });
    }
  }, [config.basic.logoImage, setLogoConfig]);

  // 监听路由变化，应用 Layout 配置
  useEffect(() => {
    resetAll();

    // 查找当前路由的 layout 配置
    const currentMatch = matches[matches.length - 1];
    const handle = currentMatch?.handle as RouteMeta | undefined;
    const layoutConfig = handle?.layout;

    if (layoutConfig) {
      if (layoutConfig.layout) setLayoutVisible(layoutConfig.layout);
      if (layoutConfig.header) setHeaderVisible(layoutConfig.header);
      if (layoutConfig.logo) setLogoConfig(layoutConfig.logo);
      if (layoutConfig.customMenu) setCustomMenuList(layoutConfig.customMenu);
    }

    // 路由重置后重新应用前端配置的 logo
    if (config.basic.logoImage && !layoutConfig?.logo?.icon) {
      setLogoConfig({ icon: config.basic.logoImage });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <div className={styles.layoutContainer}>
      {layoutVisible.header && (
        <ConfigProvider theme={{ algorithm: antdTheme.darkAlgorithm }}>
          <LayoutHeader
            logoTitle={config.basic.systemTitle[currentLocale] || Object.values(config.basic.systemTitle)[0] || ''}
            className={styles.areaHeader}
          />
        </ConfigProvider>
      )}
      <LayoutMain className={styles.areaMain} />
    </div>
  );

  if (config.watermark.enabled && config.watermark.content) {
    return (
      <Watermark
        content={config.watermark.content}
        font={{
          color: config.watermark.color,
          fontSize: config.watermark.fontSize,
          fontWeight: config.watermark.fontWeight as NonNullable<WatermarkProps['font']>['fontWeight'],
        }}
        rotate={config.watermark.rotate}
        gap={[config.watermark.gapX, config.watermark.gapY]}
        style={{ opacity: config.watermark.opacity }}
      >
        {content}
      </Watermark>
    );
  }

  return content;
}

export default function Layout() {
  return (
    <LayoutProvider>
      <LayoutContent />
    </LayoutProvider>
  );
}
