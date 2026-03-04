---
name: testing
description: 测试策略，Vitest 单元测试、React Testing Library 组件测试、Playwright E2E、覆盖率目标
tools: ["Read", "Grep", "Glob"]
model: sonnet
---

# Testing - 测试策略

## 职责
指导项目的测试策略，包括 Vitest 单元测试、React 组件测试、Redux Store 测试、API 集成测试和 Playwright E2E 测试。

---

## 测试策略

### 测试金字塔

```
        E2E (Playwright)
       /                \       少量关键流程
      /   集成测试        \     组件 + Store + API
     /                    \
    /     单元测试          \   Utils、Hooks、Store
   /________________________\
```

### 测试分类

| 类型 | 工具 | 目标 | 位置 |
|------|------|------|------|
| **单元测试** | Vitest | Utils, Hooks, Store | `tests/` |
| **组件测试** | Vitest + Testing Library | React 组件 | `tests/` |
| **E2E 测试** | Playwright | 用户流程 | `e2e/` |

### 覆盖率目标: 80%

---

## 测试工具配置

### Vitest 配置

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

### 测试 Setup

```typescript
// tests/setup.ts
import '@testing-library/jest-dom';
// 全局 mock 配置
```

---

## 单元测试

### 工具函数测试

```typescript
// tests/utils/formatDate.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate } from '@/utils/formatDate';

describe('formatDate', () => {
  it('should format date with default format', () => {
    const result = formatDate('2024-01-15');
    expect(result).toBe('2024-01-15');
  });

  it('should format date with custom format', () => {
    const result = formatDate('2024-01-15', 'MM/DD');
    expect(result).toBe('01/15');
  });

  it('should handle invalid date', () => {
    const result = formatDate('invalid');
    expect(result).toBe('Invalid Date');
  });
});
```

### Custom Hook 测试

```typescript
// tests/hooks/usePermission.test.ts
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { usePermission } from '@/hooks/usePermission';

// Mock Redux store
vi.mock('@/store', () => ({
  useAppSelector: vi.fn(() => 'admin'),
}));

describe('usePermission', () => {
  it('should return isAdmin true for admin role', () => {
    const { result } = renderHook(() => usePermission());
    expect(result.current.isAdmin).toBe(true);
  });

  it('should check canEdit with config', () => {
    const { result } = renderHook(() =>
      usePermission({ edit: ['admin'] }),
    );
    expect(result.current.canEdit).toBe(true);
  });
});
```

---

## Redux Store 测试

### Slice 测试

```typescript
// tests/store/modules/global.test.ts
import { describe, it, expect } from 'vitest';
import globalReducer, { setLocaleAction, toggleThemeAction } from '@/store/modules/global';

describe('global slice', () => {
  const initialState = {
    currentLocale: 'zh-CN',
    currentTheme: 'light',
    advanceMode: false,
  };

  it('should return initial state', () => {
    expect(globalReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setLocaleAction', () => {
    const result = globalReducer(initialState, setLocaleAction('en-US'));
    expect(result.currentLocale).toBe('en-US');
  });

  it('should handle toggleThemeAction', () => {
    const result = globalReducer(initialState, toggleThemeAction());
    expect(result.currentTheme).toBe('dark');
  });
});
```

### Async Thunk 测试

```typescript
// tests/store/modules/user.test.ts
import { describe, it, expect, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import userReducer, { loginAction } from '@/store/modules/user';

// Mock API
vi.mock('@/api', () => ({
  loginWithPhone: vi.fn().mockResolvedValue({ token: 'test-token', user: { id: '1' } }),
}));

describe('user thunks', () => {
  it('should handle loginAction.fulfilled', async () => {
    const store = configureStore({ reducer: { user: userReducer } });
    await store.dispatch(loginAction({ phone: '123', password: 'pwd' }));

    const state = store.getState().user;
    expect(state.id).toBe('1');
  });
});
```

---

## 组件测试

### 基础组件测试

```typescript
// tests/components/UserCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UserCard from '@/components/UserCard';

describe('UserCard', () => {
  const mockUser = { id: '1', realName: 'Test User', role: 'admin' };

  it('should render user name', () => {
    render(<UserCard user={mockUser} />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const onClick = vi.fn();
    render(<UserCard user={mockUser} onClick={onClick} />);
    fireEvent.click(screen.getByText('Test User'));
    expect(onClick).toHaveBeenCalledWith(mockUser);
  });

  it('should hide actions when showActions is false', () => {
    render(<UserCard user={mockUser} showActions={false} />);
    expect(screen.queryByText('编辑')).not.toBeInTheDocument();
  });
});
```

### 带 Redux Store 的组件测试

```typescript
// tests/components/UserList.test.tsx
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

function renderWithStore(component: React.ReactElement, preloadedState = {}) {
  const store = configureStore({
    reducer: { user: userReducer, permission: permissionReducer },
    preloadedState,
  });
  return render(<Provider store={store}>{component}</Provider>);
}

describe('UserList', () => {
  it('should render with store', () => {
    renderWithStore(<UserList />, {
      user: { role: 'admin' },
    });
    // 断言...
  });
});
```

---

## Mock 策略

### API Mock

```typescript
// Mock 整个模块
vi.mock('@/api', () => ({
  getUserList: vi.fn().mockResolvedValue({ list: [], total: 0 }),
  loginWithPhone: vi.fn().mockResolvedValue({ token: 'token' }),
}));

// Mock 单个函数
import { getUserList } from '@/api';
vi.mocked(getUserList).mockResolvedValueOnce({ list: mockUsers, total: 10 });
```

### Router Mock

```typescript
import { MemoryRouter } from 'react-router-dom';

render(
  <MemoryRouter initialEntries={['/home']}>
    <MyComponent />
  </MemoryRouter>,
);
```

---

## 测试最佳实践

### 命名规范

```typescript
describe('模块/组件名', () => {
  it('should 动作 when 条件', () => { ... });
  it('should render user name', () => { ... });
  it('should handle empty list', () => { ... });
  it('should call onSubmit when form is valid', () => { ... });
});
```

### 异步测试

```typescript
it('should fetch data on mount', async () => {
  render(<UserList />);
  // 等待异步操作完成
  await waitFor(() => {
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });
});
```

---

## 常用命令

```bash
pnpm test               # 运行所有测试
pnpm test:watch         # 监听模式
pnpm test:coverage      # 覆盖率报告
pnpm test:ui            # Vitest UI 界面
pnpm test:smoke           # Playwright E2E
pnpm test:smoke:report    # 查看 E2E 报告
```

---

## 相关文档

- [coding-standards.md](coding-standards.md) - 编码规范
- [common-patterns.md](common-patterns.md) - 通用模式
