import { describe, it, expect } from 'vitest';
import { os } from '@/utils/os';

const UA = {
  chrome89:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
  chrome88:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
  chrome120:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  androidMobile:
    'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  iPhone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  iPad: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  safari:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  firefox: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
};

describe('os', () => {
  describe('isHighChrome', () => {
    it('Chrome 89 应返回 true', () => {
      expect(os(UA.chrome89).isHighChrome).toBe(true);
    });

    it('Chrome 120 应返回 true', () => {
      expect(os(UA.chrome120).isHighChrome).toBe(true);
    });

    it('Chrome 88 应返回 false', () => {
      expect(os(UA.chrome88).isHighChrome).toBe(false);
    });

    it('非 Chrome 浏览器应返回 false', () => {
      expect(os(UA.safari).isHighChrome).toBe(false);
      expect(os(UA.firefox).isHighChrome).toBe(false);
    });
  });

  describe('isChrome', () => {
    it('Chrome UA 应返回 true', () => {
      expect(os(UA.chrome120).isChrome).toBe(true);
      expect(os(UA.androidMobile).isChrome).toBe(true);
    });

    it('非 Chrome 浏览器应返回 false', () => {
      expect(os(UA.safari).isChrome).toBe(false);
      expect(os(UA.firefox).isChrome).toBe(false);
    });
  });

  describe('isMobile', () => {
    it('Android 手机 UA 应返回 true', () => {
      expect(os(UA.androidMobile).isMobile).toBe(true);
    });

    it('iPhone UA 应返回 true', () => {
      expect(os(UA.iPhone).isMobile).toBe(true);
    });

    it('iPad UA 应返回 true', () => {
      expect(os(UA.iPad).isMobile).toBe(true);
    });

    it('桌面 Chrome 应返回 false', () => {
      expect(os(UA.chrome120).isMobile).toBe(false);
    });

    it('桌面 Safari 应返回 false', () => {
      expect(os(UA.safari).isMobile).toBe(false);
    });
  });

  describe('isDeskTop', () => {
    it('桌面 Chrome 应返回 true', () => {
      expect(os(UA.chrome120).isDeskTop).toBe(true);
    });

    it('桌面 Safari 应返回 true', () => {
      expect(os(UA.safari).isDeskTop).toBe(true);
    });

    it('Android 手机应返回 false', () => {
      expect(os(UA.androidMobile).isDeskTop).toBe(false);
    });

    it('iPhone 应返回 false', () => {
      expect(os(UA.iPhone).isDeskTop).toBe(false);
    });

    it('iPad 应返回 false', () => {
      expect(os(UA.iPad).isDeskTop).toBe(false);
    });
  });
});
