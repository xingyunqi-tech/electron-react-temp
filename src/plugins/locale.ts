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
 * 便捷翻译函数
 */
export const t = i18n.t.bind(i18n);

/**
 * 动态加载语言包
 * @param locale 语言代码
 * @returns Promise<boolean> 加载是否成功
 */
export const loadLocaleMessages = async (locale: LocaleKey) => {
  try {
    const response = await fetch(`/locale/${locale}.json`);
    if (!response.ok) {
      console.error(`加载语言包失败: ${locale}，使用默认语言包`);
      return false;
    }

    const messages = await response.json();

    i18n.addResourceBundle(locale, 'translation', messages, true, true);
    i18n.changeLanguage(locale);

    return true;
  } catch (error) {
    console.error(`加载语言包出错: ${locale}，使用默认语言包`, error);
    return false;
  }
};
