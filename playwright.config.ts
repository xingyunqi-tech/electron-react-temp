import { defineConfig } from '@playwright/test';
import { readFileSync } from 'fs';

// 读取 .env.development 并解析
function loadEnvFile(path: string) {
  try {
    const content = readFileSync(path, 'utf-8');
    const env: Record<string, string> = {};
    content.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)\s*=\s*['"]?([^'"]+)['"]?/);
      if (match) {
        env[match[1].trim()] = match[2].trim();
      }
    });
    return env;
  } catch {
    return {};
  }
}

const envVars = loadEnvFile('.env.development');
Object.assign(process.env, envVars);

/**
 * Playwright 配置 - Chrome PC 端页面 UI 还原测试
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // 测试文件目录
  testDir: './e2e',

  // 测试文件匹配模式
  testMatch: '**/*.spec.ts',

  // 单个测试超时时间 (Applitools 调用需要较长时间)
  timeout: 90 * 1000,

  // expect 超时时间
  expect: {
    timeout: 5000,
  },

  // 失败重试次数
  retries: process.env.CI ? 2 : 0,

  // 并发执行的 worker 数量
  workers: process.env.CI ? 1 : undefined,

  // 测试报告配置
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],

  // 全局配置
  use: {
    // 基础 URL
    baseURL: 'http://localhost:4326',

    // 截图配置
    screenshot: 'only-on-failure',

    // 视频录制
    video: 'retain-on-failure',

    // 追踪
    trace: 'on-first-retry',

    // 浏览器上下文选项
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',

    // 导航超时
    navigationTimeout: 30 * 1000,

    // 操作超时
    actionTimeout: 10 * 1000,

    // Chrome PC 端视口大小
    viewport: { width: 1920, height: 1080 },
  },

  // 项目配置 - 只使用 Chrome
  projects: [
    {
      name: 'chrome',
      use: {
        channel: 'chrome',
      },
    },
  ],

  // Web 服务器配置 (自动启动开发服务器)
  webServer: {
    command: 'pnpm start',
    url: 'http://localhost:4326',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
