import { theme } from 'antd';

/**
 * antd定制主题
 */
export const getAntdTheme = (themeSymbol: 'dark' | 'light') => {
  const algorithm = themeSymbol === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm;

  return {
    algorithm,
    cssVar: {
      prefix: 'ant',
    },
    hashed: false,
    components: {
      Checkbox: {
        lineWidth: 2,
      },
      Input: {
        paddingInline: 12,
      },
      Select: {
        showArrowPaddingInlineEnd: 12,
      },
      Menu: {
        activeBarHeight: 0,
      },
      Card: {
        headerPadding: 12,
        bodyPadding: 12,
      },
    },
    token: {
      borderRadius: 2,
    },
  };
};
