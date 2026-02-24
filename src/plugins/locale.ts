import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LOCALE } from '@/constants/system';
import type { LocaleKey } from '@/interface/system';
import antdZhCN from 'antd/locale/zh_CN';
import antdEnUS from 'antd/locale/en_US';
import type { Locale } from 'antd/es/locale';

import zhCN from '@/locale/zh-CN.json';
import enUS from '@/locale/en-US.json';

/**
 * antd 语言包配置
 */
const antdLocales: Record<string, Locale> = {
  'zh-CN': antdZhCN,
  'en-US': antdEnUS,
};

/**
 * 根据语言代码获取对应的 Ant Design 语言包
 */
export const getAntdLocales = (locale: LocaleKey): Locale => {
  return antdLocales[locale] || antdLocales[DEFAULT_LOCALE];
};

/**
 * i18next 语言包配置
 */
const resources = {
  'zh-CN': { translation: zhCN },
  'en-US': { translation: enUS },
};

/**
 * 初始化 i18next
 */
i18n.use(initReactI18next).init({
  resources,
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

/**
 * 非响应式翻译函数，仅用于组件外部（工具函数、store 等）。
 * 组件内请使用 useTranslation() hook 以确保语言切换时自动更新。
 */
export const t = i18n.t.bind(i18n);

/**
 * 从 public/locale/ 加载合并后的语言包并注册到 i18next。
 */
export const loadLocaleMessages = async (locale: LocaleKey) => {
  try {
    const response = await fetch(`/locale/${locale}.json`);
    if (!response.ok) {
      console.error(`加载语言包失败: ${locale}`);
      return false;
    }

    const messages = await response.json();
    i18n.addResourceBundle(locale, 'translation', messages, true, true);
    return true;
  } catch (error) {
    console.error(`加载语言包出错: ${locale}`, error);
    return false;
  }
};
