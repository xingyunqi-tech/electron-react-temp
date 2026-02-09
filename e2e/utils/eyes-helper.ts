/**
 * Applitools Eyes 工具函数 - Chrome PC 端
 */

import type { Page } from '@playwright/test';
import { Eyes, Target, BatchInfo, Configuration, ClassicRunner, MatchLevel } from '@applitools/eyes-playwright';

/**
 * Eyes 实例管理器
 */
export class EyesManager {
  private eyes: Eyes;
  private runner: ClassicRunner;

  constructor() {
    this.runner = new ClassicRunner();
    this.eyes = new Eyes(this.runner);

    // 配置
    const configuration = new Configuration();

    // 从环境变量读取 API Key
    // 注意: 在 Playwright (Node.js) 环境中使用 process.env
    // playwright.config.ts 会将 VITE_APPLITOOLS_API_KEY 转换为 APPLITOOLS_API_KEY
    const apiKey = process.env.APPLITOOLS_API_KEY || process.env.VITE_APPLITOOLS_API_KEY;

    // 设置 API Key
    if (apiKey) {
      configuration.setApiKey(apiKey);
    }

    // 设置服务器 URL
    configuration.setServerUrl('https://eyes.applitools.com');

    // 设置批处理信息
    const batch = new BatchInfo('Vue Admin Template - Chrome PC');
    configuration.setBatch(batch);

    // 设置匹配级别
    configuration.setMatchLevel(MatchLevel.Strict);

    // 设置并发数
    configuration.setConcurrentSessions(5);

    // 设置忽略位移
    configuration.setIgnoreDisplacements(true);

    // 应用配置
    this.eyes.setConfiguration(configuration);
  }

  /**
   * 打开 Eyes (Chrome PC 端 1920x1080)
   */
  async open(page: Page, appName: string, testName: string) {
    await this.eyes.open(page, appName, testName, { width: 1920, height: 1080 });
  }

  /**
   * 检查整个页面
   */
  async checkWindow(tag: string) {
    await this.eyes.check(tag, Target.window().fully());
  }

  /**
   * 检查页面的特定区域
   */
  async checkRegion(selector: string, tag: string) {
    await this.eyes.check(tag, Target.region(selector));
  }

  /**
   * 检查页面并忽略特定区域
   */
  async checkWindowWithIgnore(tag: string, ignoreSelectors: string[]) {
    let target = Target.window().fully();
    for (const selector of ignoreSelectors) {
      target = target.ignore(selector);
    }
    await this.eyes.check(tag, target);
  }

  /**
   * 关闭 Eyes
   */
  async close() {
    await this.eyes.close();
  }

  /**
   * 中止 Eyes
   */
  async abort() {
    await this.eyes.abort();
  }
}

/**
 * 等待页面加载完成
 */
export async function waitForPageLoad(page: Page) {
  // 等待网络空闲
  await page.waitForLoadState('networkidle');

  // 等待骨架屏消失
  const skeletonSelector = '[data-testid="skeleton"]';
  const hasSkeleton = (await page.locator(skeletonSelector).count()) > 0;
  if (hasSkeleton) {
    await page.waitForSelector(skeletonSelector, { state: 'hidden', timeout: 10000 });
  }

  // 对于登录页，等待表单元素可交互
  if (page.url().includes('/login')) {
    // 等待学号输入框可见且可编辑 (默认学生登录)
    const usernameInput = page.locator('input.el-input__inner[placeholder="请输入学号"]');
    if ((await usernameInput.count()) > 0) {
      await usernameInput.waitFor({ state: 'visible', timeout: 5000 });
      // 等待输入框可编辑（通过检查是否没有 disabled 属性）
      await page.waitForFunction(
        () => {
          const input = document.querySelector<HTMLInputElement>('input.el-input__inner[placeholder="请输入学号"]');
          return input && !input.disabled && !input.readOnly;
        },
        { timeout: 5000 },
      );
    }
  }

  // 等待动画和异步操作完成
  await page.waitForTimeout(1000);
}

/**
 * 隐藏动态内容 (时间戳、随机ID等)
 */
export async function hideDynamicContent(page: Page, selectors: string[]) {
  for (const selector of selectors) {
    await page.addStyleTag({
      content: `${selector} { visibility: hidden !important; }`,
    });
  }
}
