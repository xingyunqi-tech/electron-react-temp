import { useEffect, useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import { StyleProvider, legacyLogicalPropertiesTransformer } from '@ant-design/cssinjs';
import { useAppSelector, useAppDispatch } from '@/store';
import { stopAllLoopsAction } from '@/store/framework';
import { currentLocaleSelector, currentThemeSelector } from '@/store/modules/global';
import i18n, { getAntdLocales, loadLocaleMessages } from '@/plugins/locale';
import { getAntdTheme } from '@/plugins/theme';
import { os } from '@/utils/os';
import dayjs, { dayjsLocaleMap } from '@/plugins/dayjs';
import router from '@/router';
import StaticFunction from '@/components/StaticFunction';

const isHighChrome = os().isHighChrome;

/**
 * 根组件
 */
export default function App() {
  const dispatch = useAppDispatch();
  const currentLocale = useAppSelector(currentLocaleSelector);
  const currentTheme = useAppSelector(currentThemeSelector);

  // 应用卸载时清理副作用
  useEffect(() => {
    return () => {
      dispatch(stopAllLoopsAction());
    };
  }, [dispatch]);

  // 监听语言变化：先加载语言包，再切换语言
  useEffect(() => {
    // 设置网站语言
    document.documentElement.setAttribute('lang', currentLocale);
    // 设置dayjs语言
    dayjs.locale(dayjsLocaleMap[currentLocale]);
    // 动态加载语音包
    loadLocaleMessages(currentLocale).then(() => {
      i18n.changeLanguage(currentLocale);
    });
  }, [currentLocale]);

  // 监听主题变化
  useEffect(() => {
    // 设置网站主题
    const html = document.documentElement;
    html.setAttribute('theme', currentTheme);
    html.classList.remove('light', 'dark');
    html.classList.add(currentTheme);
  }, [currentTheme]);

  // Antd主题和国际化
  const antdLocale = useMemo(() => getAntdLocales(currentLocale), [currentLocale]);
  const antdTheme = useMemo(() => getAntdTheme(currentTheme), [currentTheme]);

  return (
    <ConfigProvider locale={antdLocale} theme={antdTheme}>
      <AntdApp>
        <StaticFunction />
        {isHighChrome ? (
          <RouterProvider router={router} />
        ) : (
          <StyleProvider hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
            <RouterProvider router={router} />
          </StyleProvider>
        )}
      </AntdApp>
    </ConfigProvider>
  );
}
