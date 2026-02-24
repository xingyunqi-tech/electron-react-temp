/**
 * Vitest 测试环境设置文件
 * @description 配置 React 测试环境的全局设置和 Mock
 */

import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// 每个测试后自动清理 React Testing Library 渲染
afterEach(() => {
  cleanup();
});

// Mock 全局对象
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock CSS 变量
Object.defineProperty(document.documentElement, 'style', {
  value: {
    setProperty: vi.fn(),
    getPropertyValue: vi.fn(() => ''),
    removeProperty: vi.fn(),
  },
});

// Mock localStorage with actual implementation
const createStorageMock = () => {
  const store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
};

const localStorageMock = createStorageMock();
const sessionStorageMock = createStorageMock();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
});

// Mock fetch
global.fetch = vi.fn();

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = vi.fn();

// 设置测试环境变量
process.env.NODE_ENV = 'test';

// 全局测试工具函数
declare global {
  var mockFetch: typeof vi.fn;
  var mockLocalStorage: typeof localStorageMock;
}

globalThis.mockFetch = fetch as unknown as typeof vi.fn;
globalThis.mockLocalStorage = localStorageMock;

/**
 * 全局错误处理
 */
const originalUnhandledRejection = process.listeners('unhandledRejection')[0];

process.on('unhandledRejection', (reason: unknown) => {
  if (reason && typeof reason === 'object' && 'status' in reason && reason.status === 401) {
    return;
  }

  if (originalUnhandledRejection) {
    (originalUnhandledRejection as any)(reason);
  } else {
    console.error('Unhandled Rejection:', reason);
  }
});

// 每个测试后清理 localStorage
afterEach(() => {
  localStorageMock.clear();
});
