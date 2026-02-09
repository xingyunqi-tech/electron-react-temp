// Element Plus 语言包
import zhCN from 'element-plus/es/locale/lang/zh-cn';
import enUS from 'element-plus/es/locale/lang/en';
import type { LocaleKey } from '@/interface/system';

const libraryLocales = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

/**
 * 根据语言代码获取对应的语言包
 * @param locale 语言代码
 * @returns 语言包
 */
export const getLibraryLocales = (locale: LocaleKey) => {
  return libraryLocales[locale] || libraryLocales['zh-CN'];
};
