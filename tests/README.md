# 测试指南

## 📋 概述

本项目使用 Vitest 进行单元测试和集成测试，专注于核心逻辑层（API、Store、Utils）的测试覆盖。

## 🛠️ 测试技术栈

- **测试框架**: [Vitest](https://vitest.dev/) - 快速的 Vite 原生测试框架
- **Vue测试工具**: [@vue/test-utils](https://test-utils.vuejs.org/) - Vue 3 官方测试工具
- **测试环境**: [jsdom](https://github.com/jsdom/jsdom) - 浏览器环境模拟
- **覆盖率工具**: [@vitest/coverage-v8](https://vitest.dev/guide/coverage.html) - V8 覆盖率报告
- **UI界面**: [@vitest/ui](https://vitest.dev/guide/ui.html) - 可视化测试界面

## 🚀 快速开始

### 安装依赖
```bash
pnpm install
```

### 运行测试
```bash
# 运行所有测试
pnpm test

# 监听模式运行测试
pnpm test:watch

# 生成覆盖率报告
pnpm test:coverage

# 打开可视化测试界面
pnpm test:ui
```

## 📁 目录结构

```
tests/
├── README.md                 # 测试指南文档
├── setup.ts                  # 测试环境设置
├── api/                      # API 层测试
│   └── HttpClient.test.ts    # HTTP 客户端测试
├── store/                    # Store 状态管理测试
│   └── user.test.ts          # 用户状态测试
└── utils/                    # 工具函数测试
    └── date.test.ts          # 日期工具测试
```

## 🧪 测试类型

### 1. API 层测试
测试 HTTP 客户端、拦截器、请求取消等功能。

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AxiosInstance } from 'axios';

describe('HttpClient', () => {
  let mockAxiosInstance: Partial<AxiosInstance>;
  let HttpClient: any;

  beforeEach(async () => {
    vi.resetModules();

    // Mock axios instance
    mockAxiosInstance = {
      interceptors: {
        request: { use: vi.fn(), eject: vi.fn(), clear: vi.fn() },
        response: { use: vi.fn(), eject: vi.fn(), clear: vi.fn() },
      },
      defaults: { timeout: 5000, headers: {} as any },
    };

    vi.doMock('axios', () => ({
      default: {
        create: vi.fn(() => mockAxiosInstance),
        isCancel: vi.fn(() => false),
      },
    }));

    const module = await import('@/api/instance');
    HttpClient = module.HttpClient;
  });

  it('应该能够创建 HttpClient 实例', () => {
    const client = new HttpClient({ baseURL: 'https://api.example.com' });
    expect(client).toBeDefined();
  });
});
```

### 2. Store 状态管理测试
测试 Pinia Store 的状态变化、异步操作和持久化。

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from '@/store/modules/user';

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('应该能够成功登录', async () => {
    const store = useUserStore();
    const mockToken = 'mock-token-123';

    vi.mocked(LoginService.login).mockResolvedValue({
      code: 0,
      message: 'success',
      result: { token: mockToken },
    });

    const result = await store.loginAction({
      username: 'testuser',
      password: 'password123',
    });

    expect(store.token).toBe(mockToken);
    expect(result).toBe(mockToken);
  });
});
```

### 3. 工具函数测试
测试纯函数的输入输出和边界条件。

```typescript
import { describe, it, expect } from 'vitest';
import { formatDate } from '@/utils/datetime';

describe('formatDate', () => {
  it('应该正确格式化完整日期时间', () => {
    const date = new Date('2024-01-15 13:45:30');
    const result = formatDate(date, 'yyyy-MM-dd hh:mm:ss');
    expect(result).toBe('2024-01-15 13:45:30');
  });

  it('应该支持单字符月份格式', () => {
    const date = new Date('2024-01-05');
    const result = formatDate(date, 'yyyy-M-d');
    expect(result).toMatch(/2024-1-5/);
  });
});
```

## 📊 覆盖率配置

项目配置了覆盖率要求：

- **分支覆盖率**: >80%
- **函数覆盖率**: >80%
- **行覆盖率**: >80%
- **语句覆盖率**: >80%

覆盖率报告生成在 `./coverage` 目录下，包含：
- 文本报告（控制台输出）
- JSON报告（`coverage.json`）
- HTML报告（`coverage/index.html`）

## 🎯 测试最佳实践

### 1. 测试命名规范
```typescript
describe('模块名称', () => {
  describe('功能分组', () => {
    it('应该 + 期望行为', () => {
      // 测试实现
    });
  });
});
```

### 2. AAA模式
```typescript
it('应该正确计算总价', () => {
  // Arrange - 准备数据
  const items = [{ price: 10 }, { price: 20 }];

  // Act - 执行操作
  const total = calculateTotal(items);

  // Assert - 验证结果
  expect(total).toBe(30);
});
```

### 3. Mock策略
- **外部依赖**: 始终 Mock 外部 API、第三方库
- **内部模块**: 根据测试目标选择性 Mock
- **全局对象**: 在 setup.ts 中统一 Mock

**正确的 Mock 顺序**:
```typescript
// 1. Mock 必须在导入组件之前
vi.mock('axios', () => ({ /* mock */ }));

// 2. 导入需要测试的模块
const module = await import('@/api/instance');
```

### 4. 测试隔离
- 每个测试用例独立运行
- 使用 `beforeEach` 重置状态
- 使用 `vi.resetModules()` 清除模块缓存
- 避免测试间的相互依赖

### 5. 边界测试
- 测试正常情况
- 测试边界值（空值、零值、最大值）
- 测试异常情况

## 🚨 常见问题

### 1. 模块 Mock
```typescript
// 动态模块 mock
beforeEach(async () => {
  vi.resetModules(); // 重置模块缓存

  vi.doMock('axios', () => ({
    default: { create: vi.fn(() => mockInstance) }
  }));

  const module = await import('@/api/instance');
  HttpClient = module.HttpClient;
});
```

### 2. 异步测试
```typescript
it('应该处理异步操作', async () => {
  const store = useUserStore();

  // 触发异步操作
  await store.loginAction({ username: 'test', password: '123' });

  // 验证结果
  expect(store.token).toBeDefined();
});
```

### 3. Pinia Store 测试
```typescript
// Setup Syntax Store 不支持 $reset
// 使用手动重置
beforeEach(() => {
  setActivePinia(createPinia());
  const store = useUserStore();

  // 手动重置状态
  store.setTokenValue('');
  store.setId('');
});
```

### 4. 类型安全
```typescript
// 使用类型断言避免测试中的类型错误
const mockAxiosInstance = {
  // ...
  headers: {} as any, // 复杂类型可以使用 any
};
```

## 📈 测试统计

当前测试覆盖：

| 测试类别 | 文件数 | 测试用例 | 状态 |
|---------|-------|----------|------|
| API 层 | 1 | 15 | ✅ |
| Store | 1 | 19 | ✅ |
| Utils | 1 | 15 | ✅ |
| **总计** | **3** | **49** | **✅** |

## 🎨 UI/E2E 测试推荐

本项目专注于核心逻辑测试。对于 UI 层面的测试，推荐以下方案：

### 可视化回归测试
- **[Playwright](https://playwright.dev/)** - E2E 测试框架（推荐）
- **[Chromatic](https://www.chromatic.com/)** - Storybook 可视化测试
- **[Percy](https://percy.io/)** - 视觉差异检测

### 组件测试
- **[Storybook](https://storybook.js.org/)** - 组件开发和文档
- **[@storybook/test-runner](https://storybook.js.org/docs/react/writing-tests/test-runner)** - 组件测试运行器

### E2E 测试
```bash
# 推荐使用 Playwright
pnpm add -D @playwright/test
```

详见下方 "UI 还原和功能测试库推荐" 章节。

## 📚 参考资源

- [Vitest 官方文档](https://vitest.dev/)
- [Vue Test Utils 文档](https://test-utils.vuejs.org/)
- [Vue 3 测试指南](https://vuejs.org/guide/scaling-up/testing.html)
- [测试最佳实践](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

通过遵循这些指南和最佳实践，可以编写出高质量、可维护的测试代码，确保项目的稳定性和可靠性。
