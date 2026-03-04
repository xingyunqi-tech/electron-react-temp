/**
 * E2E 测试工具函数
 */

import type { Page } from '@playwright/test';

/**
 * 等待页面加载完成
 */
export async function waitForPageLoad(page: Page) {
  // 等待网络空闲
  await page.waitForLoadState('networkidle');

  // 等待骨架屏消失
  const skeleton = page.locator('[data-testid="skeleton"]');
  if ((await skeleton.count()) > 0) {
    await skeleton.waitFor({ state: 'hidden', timeout: 10000 });
  }

  // 对于登录页，等待表单元素可交互
  if (page.url().includes('/login')) {
    const phoneInput = page.locator('input[placeholder="请输入手机号"]');
    if ((await phoneInput.count()) > 0) {
      await phoneInput.waitFor({ state: 'visible', timeout: 5000 });
    }
  }

  // 等待动画和异步操作完成
  await page.waitForTimeout(1000);
}
