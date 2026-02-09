/**
 * 验证工具函数
 * 提供常用的表单验证和数据校验功能
 */

/**
 * 验证邮箱格式
 * @param email - 邮箱地址
 * @returns 是否为有效邮箱格式
 * @example
 * isValidEmail('test@example.com') // true
 * isValidEmail('invalid-email') // false
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * 验证手机号格式（中国大陆）
 * @param phone - 手机号
 * @returns 是否为有效手机号格式
 * @example
 * isValidPhone('13812345678') // true
 * isValidPhone('12345678901') // false
 */
export function isValidPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone);
}

/**
 * 获取密码强度
 * @param password - 密码
 * @returns 密码强度等级
 * @example
 * getPasswordStrength('123') // 'weak'
 * getPasswordStrength('Abc123') // 'medium'
 * getPasswordStrength('Abc123!@#') // 'strong'
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length < 6) return 'weak';
  const score = [/[a-z]/, /[A-Z]/, /\d/, /[!@#$%^&*]/].filter(r => r.test(password)).length;
  return score >= 3 ? 'strong' : score >= 2 ? 'medium' : 'weak';
}

/**
 * 验证身份证号（18位）
 * @param idCard - 身份证号
 * @returns 是否为有效身份证号格式
 * @example
 * isValidIdCard('110101199001011234') // true
 */
export function isValidIdCard(idCard: string): boolean {
  return /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/.test(idCard);
}

/**
 * 验证 URL 格式
 * @param url - URL 地址
 * @returns 是否为有效 URL 格式
 * @example
 * isValidUrl('https://example.com') // true
 * isValidUrl('not-a-url') // false
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证是否为空值
 * @param value - 要检查的值
 * @returns 是否为空
 * @example
 * isEmpty('') // true
 * isEmpty(null) // true
 * isEmpty([]) // true
 * isEmpty('hello') // false
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * 验证字符串长度是否在范围内
 * @param str - 字符串
 * @param min - 最小长度
 * @param max - 最大长度
 * @returns 是否在范围内
 * @example
 * isLengthInRange('hello', 1, 10) // true
 * isLengthInRange('hi', 5, 10) // false
 */
export function isLengthInRange(str: string, min: number, max: number): boolean {
  const len = str.length;
  return len >= min && len <= max;
}
