import { describe, it, expect } from 'vitest';
import { formatDate } from '@/utils/datetime';

describe('Date Utils', () => {
  describe('formatDate', () => {
    it('应该正确格式化完整日期时间', () => {
      const date = new Date('2024-01-15 13:45:30');
      const result = formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      expect(result).toBe('2024-01-15 13:45:30');
    });

    it('应该正确格式化日期（不含时间）', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date, 'yyyy-MM-dd');
      expect(result).toMatch(/2024-01-15/);
    });

    it('应该正确格式化时间（不含日期）', () => {
      const date = new Date('2024-01-15 13:45:30');
      const result = formatDate(date, 'hh:mm:ss');
      expect(result).toBe('13:45:30');
    });

    it('应该支持单字符月份格式', () => {
      const date = new Date('2024-01-05');
      const result = formatDate(date, 'yyyy-M-d');
      expect(result).toMatch(/2024-1-5/);
    });

    it('应该支持双字符月份格式（补零）', () => {
      const date = new Date('2024-01-05 03:05:09');
      const result = formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      expect(result).toMatch(/2024-01-05 03:05:09/);
    });

    it('应该正确处理两位数年份', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date, 'yy-MM-dd');
      expect(result).toMatch(/24-01-15/);
    });

    it('应该正确处理自定义分隔符', () => {
      const date = new Date('2024-01-15 13:45:30');
      const result = formatDate(date, 'yyyy/MM/dd hh:mm:ss');
      expect(result).toBe('2024/01/15 13:45:30');
    });

    it('应该正确处理中文格式', () => {
      const date = new Date('2024-01-15 13:45:30');
      const result = formatDate(date, 'yyyy年MM月dd日 hh时mm分ss秒');
      expect(result).toBe('2024年01月15日 13时45分30秒');
    });

    it('应该处理月末日期', () => {
      const date = new Date('2024-01-31 23:59:59');
      const result = formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      expect(result).toBe('2024-01-31 23:59:59');
    });

    it('应该处理年初日期', () => {
      const date = new Date('2024-01-01 00:00:00');
      const result = formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      expect(result).toMatch(/2024-01-01 00:00:00/);
    });

    it('应该处理年末日期', () => {
      const date = new Date('2024-12-31 23:59:59');
      const result = formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      expect(result).toBe('2024-12-31 23:59:59');
    });

    it('应该处理闰年二月', () => {
      const date = new Date('2024-02-29');
      const result = formatDate(date, 'yyyy-MM-dd');
      expect(result).toMatch(/2024-02-29/);
    });

    it('应该支持混合格式', () => {
      const date = new Date('2024-01-15 13:45:30');
      const result = formatDate(date, 'yyyy年M月d日 h:m:s');
      expect(result).toMatch(/2024年1月15日 13:45:30/);
    });

    it('应该处理午夜时间', () => {
      const date = new Date('2024-01-15 00:00:00');
      const result = formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      expect(result).toMatch(/2024-01-15 00:00:00/);
    });

    it('应该处理中午时间', () => {
      const date = new Date('2024-01-15 12:00:00');
      const result = formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      expect(result).toBe('2024-01-15 12:00:00');
    });
  });
});
