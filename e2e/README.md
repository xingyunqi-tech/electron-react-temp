# E2E 冒烟测试 - Playwright

> Chrome PC 端 (1920x1080) 页面冒烟测试

---

## 快速开始

### 1. 安装浏览器

```bash
npx playwright install chrome
```

### 2. 运行测试

```bash
# 无头模式运行
pnpm test:smoke

# 有界面运行（调试推荐）
npx playwright test --headed

# 查看测试报告
pnpm test:smoke:report
```

Playwright 配置了自动启动开发服务器（`pnpm start`，端口 4326）。

---

## 目录结构

```
e2e/
├── visual/              # 页面冒烟测试
│   └── auth/
│       └── login.spec.ts    # 登录页测试
├── utils/
│   └── eyes-helper.ts   # 工具函数（waitForPageLoad 等）
└── README.md
```

---

## 编写测试

### 基本结构

```typescript
import { test, expect } from '@playwright/test';
import { waitForPageLoad } from '../../utils/eyes-helper';

test.describe('页面名称', () => {
  test('测试用例', async ({ page }) => {
    await page.goto('/your-page');
    await waitForPageLoad(page);

    await expect(page.locator('.selector')).toBeVisible();
  });
});
```

### 工具函数

```typescript
// 等待页面加载（网络空闲 + 骨架屏消失 + 登录页输入框就绪）
await waitForPageLoad(page);
```

---

## 测试范围

### 应该测试

- 关键页面的元素可见性（登录、首页、核心业务页）
- 表单交互：输入、校验、提交
- 多种状态：默认、加载、错误

### 不应该测试

- 纯逻辑代码 → 用单元测试
- 第三方组件内部 → 已有测试
- 后端 API → 用 API 测试

---

## 故障排除

| 问题 | 解决方案 |
|------|---------|
| 浏览器未安装 | `npx playwright install chrome` |
| 测试超时 | 增加 `playwright.config.ts` 中的 `timeout` |
| 端口占用 | `lsof -ti:4326 \| xargs kill -9` |

---

## 常用命令

```bash
pnpm test:smoke             # 运行所有 E2E 测试
pnpm test:smoke:report      # 查看 Playwright 报告
npx playwright test --headed # 有界面运行
npx playwright test --ui     # UI 调试模式
npx playwright test --debug  # Debug 模式
```

---

## 相关资源

- [Playwright 文档](https://playwright.dev)
