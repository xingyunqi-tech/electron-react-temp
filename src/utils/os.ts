/**
 * 浏览器/设备检测工具
 */
export const os = (u = navigator.userAgent) => ({
  /** 高版本chrome */
  isHighChrome: (m => !!m && parseInt(m[1], 10) >= 89)(/Chrome\/(\d+)/.exec(u)),
  isMobile: /Mobile/i.test(u),
  isChrome: /Chrome/i.test(u),
  isDeskTop: !['Android', 'iPhone', 'iPad', 'iPod'].some(k => u.includes(k)),
});
