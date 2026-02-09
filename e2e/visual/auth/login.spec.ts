/**
 * 登录页视觉测试 - Chrome PC 端
 */

import { test } from '@playwright/test';
import { EyesManager, waitForPageLoad } from '../../utils/eyes-helper';

// 选择器常量 - 集中管理
const SELECTORS = {
  // 学号/工号输入框 (默认学生登录显示"请输入学号")
  usernameInput: 'input.el-input__inner[placeholder="请输入学号"]',
  passwordInput: 'input.el-input__inner[placeholder="请输入密码"]',
  checkbox: '.el-checkbox',
  submitButton: 'button.login-btn',
} as const;

test.describe('登录页视觉测试', () => {
  let eyes: EyesManager;

  test.beforeEach(async () => {
    eyes = new EyesManager();
  });

  test.afterEach(async () => {
    await eyes.close();
  });

  test('登录页 - 默认状态', async ({ page }) => {
    await eyes.open(page, 'Vue Admin Template', '登录页 - 默认状态');

    await page.goto('/login');
    await waitForPageLoad(page);

    await eyes.checkWindow('登录页 - 初始状态');
  });

  test('登录页 - 表单交互', async ({ page }) => {
    await eyes.open(page, 'Vue Admin Template', '登录页 - 表单交互');

    await page.goto('/login');
    await waitForPageLoad(page);

    // 填写完整表单
    await page.locator(SELECTORS.usernameInput).fill('ADMIN001');
    await page.locator(SELECTORS.passwordInput).fill('123456');

    await page.waitForTimeout(300);
    await eyes.checkWindow('表单填写完成');
  });

  test('登录页 - 按钮状态', async ({ page }) => {
    await eyes.open(page, 'Vue Admin Template', '登录页 - 按钮状态');

    await page.goto('/login');
    await waitForPageLoad(page);

    // 填写表单但不勾选协议 - 按钮应为禁用状态
    await page.locator(SELECTORS.usernameInput).fill('ADMIN001');
    await page.locator(SELECTORS.passwordInput).fill('123456');

    await page.waitForTimeout(300);
    await eyes.checkWindow('按钮禁用 - 协议未勾选');

    // 勾选协议 - 按钮应激活
    await page.locator(SELECTORS.checkbox).click();

    await page.waitForTimeout(300);
    await eyes.checkWindow('按钮激活 - 协议已勾选');
  });

  test('登录页 - 表单验证错误', async ({ page }) => {
    await eyes.open(page, 'Vue Admin Template', '登录页 - 表单验证错误');

    await page.goto('/login');
    await waitForPageLoad(page);

    // 不输入任何内容，直接勾选协议并点击登录
    await page.locator(SELECTORS.checkbox).click();

    // 点击登录按钮触发验证
    await page.locator(SELECTORS.submitButton).click();

    // 等待表单验证错误提示出现
    await page.waitForSelector('.el-form-item__error', { state: 'visible', timeout: 3000 });
    await page.waitForTimeout(500);

    await eyes.checkWindowWithIgnore('表单验证错误提示', ['.timestamp', '.el-message']);
  });
});
