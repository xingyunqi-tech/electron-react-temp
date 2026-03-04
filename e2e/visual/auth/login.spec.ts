/**
 * 登录页冒烟测试 - Chrome PC 端
 */

import { test, expect } from '@playwright/test';
import { waitForPageLoad } from '../../utils/eyes-helper';

// Ant Design 选择器
const SELECTORS = {
  phoneInput: 'input[placeholder="请输入手机号"]',
  passwordInput: 'input[placeholder="请输入密码"]',
  submitButton: 'button[type="submit"]',
  formError: '.ant-form-item-explain-error',
} as const;

test.describe('登录页冒烟测试', () => {
  test('登录页 - 默认状态', async ({ page }) => {
    await page.goto('/login');
    await waitForPageLoad(page);

    // 验证表单元素可见
    await expect(page.locator(SELECTORS.phoneInput)).toBeVisible();
    await expect(page.locator(SELECTORS.passwordInput)).toBeVisible();
    await expect(page.locator(SELECTORS.submitButton)).toBeVisible();
    await expect(page.locator(SELECTORS.submitButton)).toHaveText('立即登录');
  });

  test('登录页 - 表单交互', async ({ page }) => {
    await page.goto('/login');
    await waitForPageLoad(page);

    // 填写表单并验证输入值
    await page.locator(SELECTORS.phoneInput).fill('13800138000');
    await page.locator(SELECTORS.passwordInput).fill('123456');

    await expect(page.locator(SELECTORS.phoneInput)).toHaveValue('13800138000');
    await expect(page.locator(SELECTORS.passwordInput)).toHaveValue('123456');
  });

  test('登录页 - 空表单验证', async ({ page }) => {
    await page.goto('/login');
    await waitForPageLoad(page);

    // 直接点击登录触发表单验证
    await page.locator(SELECTORS.submitButton).click();

    // 验证必填错误提示出现
    await expect(page.locator(SELECTORS.formError).first()).toBeVisible({ timeout: 3000 });
  });

  test('登录页 - 手机号格式验证', async ({ page }) => {
    await page.goto('/login');
    await waitForPageLoad(page);

    // 输入格式错误的手机号
    await page.locator(SELECTORS.phoneInput).fill('123');
    // 触发 blur 验证
    await page.locator(SELECTORS.passwordInput).click();

    // 验证格式错误提示
    await expect(page.getByText('请输入正确的手机号')).toBeVisible({ timeout: 3000 });
  });
});
