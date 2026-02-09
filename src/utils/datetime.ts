/**
 * 日期处理相关工具函数
 * 提供日期格式化和字符串转日期等功能
 */

import dayjs from 'dayjs';

/**
 * 格式化日期为指定格式的字符串
 * @param date - 要格式化的日期对象
 * @param fmt - 格式化模板字符串，如'yyyy-MM-dd hh:mm:ss'
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date, fmt: string): string {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length));
  }
  const o: { [key: string]: number } = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  };
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str: string = `${o[k]}`;
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
    }
  }
  return fmt;
}

/**
 * 左侧补零工具函数
 * @param str - 要补零的字符串
 * @returns 补零后的字符串
 * @private
 */
function padLeftZero(str: string): string {
  return `00${str}`.substr(str.length);
}

/**
 * 格式化日期字符串为 YYYY-MM-DD 格式
 * @param dateString - 日期字符串
 * @returns 格式化后的日期字符串,如果输入为空则返回 '-'
 * @example
 * formatDateShort('2025-01-15T10:30:00') // '2025-01-15'
 * formatDateShort(undefined) // '-'
 */
export function formatDateShort(dateString?: string): string {
  if (!dateString) return '-';
  return dayjs(dateString).format('YYYY-MM-DD');
}

/**
 * 格式化日期字符串为 YYYY-MM-DD HH:mm 格式
 * @param dateString - 日期字符串
 * @returns 格式化后的日期时间字符串,如果输入为空则返回 '-'
 * @example
 * formatDateTime('2025-01-15T10:30:00') // '2025-01-15 10:30'
 * formatDateTime(undefined) // '-'
 */
export function formatDateTime(dateString?: string): string {
  if (!dateString) return '-';
  return dayjs(dateString).format('YYYY-MM-DD HH:mm');
}

/**
 * 格式化日期字符串为 YYYY-MM-DD HH:mm:ss 格式
 * @param dateString - 日期字符串
 * @returns 格式化后的日期时间字符串,如果输入为空则返回 '-'
 * @example
 * formatDateTimeFull('2025-01-15T10:30:45') // '2025-01-15 10:30:45'
 * formatDateTimeFull(undefined) // '-'
 */
export function formatDateTimeFull(dateString?: string): string {
  if (!dateString) return '-';
  return dayjs(dateString).format('YYYY-MM-DD HH:mm:ss');
}

/**
 * 格式化日期字符串为相对时间
 * @param dateString - 日期字符串
 * @returns 相对时间字符串,如 '2小时前'、'3天前'
 * @example
 * formatRelativeTime('2025-01-15T10:00:00') // '2小时前'
 */
export function formatRelativeTime(dateString?: string): string {
  if (!dateString) return '-';
  return dayjs(dateString).fromNow();
}

/**
 * 格式化日期范围
 * @param startTime - 开始时间
 * @param endTime - 结束时间
 * @param format - 格式化模式，'short' 使用 YYYY-MM-DD，'datetime' 使用 YYYY-MM-DD HH:mm
 * @returns 格式化后的日期范围字符串
 * @example
 * formatDateRange('2025-01-15', '2025-01-20') // '2025-01-15 ~ 2025-01-20'
 * formatDateRange('2025-01-15T10:00:00', '2025-01-20T18:00:00', 'datetime') // '2025-01-15 10:00 ~ 2025-01-20 18:00'
 * formatDateRange(undefined, '2025-01-20') // '-'
 */
export function formatDateRange(startTime?: string, endTime?: string, format: 'short' | 'datetime' = 'short'): string {
  if (!startTime || !endTime) return '-';
  const formatter = format === 'datetime' ? formatDateTime : formatDateShort;
  return `${formatter(startTime)} ~ ${formatter(endTime)}`;
}

/**
 * 格式化教师/人员列表
 * @param list - 包含 name 属性的对象数组
 * @param separator - 分隔符，默认为 '、'
 * @returns 格式化后的名字字符串
 * @example
 * formatNameList([{ name: '张三' }, { name: '李四' }]) // '张三、李四'
 * formatNameList([{ name: '张三' }], ', ') // '张三'
 * formatNameList([]) // '-'
 */
export function formatNameList(list?: { name?: string }[], separator = '、'): string {
  if (!list || list.length === 0) return '-';
  return list
    .map(item => item.name)
    .filter(Boolean)
    .join(separator);
}

/**
 * 格式化文件大小
 * @param bytes - 文件大小（字节）
 * @returns 格式化后的文件大小字符串
 * @example
 * formatFileSize(1024) // '1.0 KB'
 * formatFileSize(1048576) // '1.0 MB'
 * formatFileSize(512) // '512 B'
 */
export function formatFileSize(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
