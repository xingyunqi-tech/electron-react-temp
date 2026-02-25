---
name: test-coverage-checker
description: 测试覆盖率检查 + 自动生成测试模板，目标覆盖率 80%
---

# Test Coverage Checker - 测试覆盖率检查

## 功能概述
分析项目测试覆盖率，识别未覆盖的模块，并自动生成测试模板。

## 使用方式
```bash
/test-coverage-checker [--auto-generate] [--path <path>]

# 示例
/test-coverage-checker
/test-coverage-checker --auto-generate
/test-coverage-checker --path src/store/modules/
```

## 参数说明
| 参数 | 说明 |
|------|------|
| `--auto-generate` | 自动为未覆盖模块生成测试模板 |
| `--path` | 指定检查目录 |

## 执行流程

### Phase 1: 覆盖率分析
```bash
pnpm test:coverage
```

### Phase 2: 识别缺口
1. 扫描 `src/store/modules/` → 检查 Slice 测试
2. 扫描 `src/hooks/` → 检查 Hook 测试
3. 扫描 `src/utils/` → 检查工具函数测试
4. 扫描 `src/components/` → 检查组件测试

### Phase 3: 生成测试模板

#### Store 模块测试

```typescript
// tests/store/modules/{name}.test.ts
import { describe, it, expect, vi } from 'vitest';
import reducer, { fetchListAction, setCurrentAction } from '@/store/modules/{name}';

describe('{name} slice', () => {
  const initialState = { list: [], loading: false, currentId: null };

  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setCurrentAction', () => {
    const result = reducer(initialState, setCurrentAction('123'));
    expect(result.currentId).toBe('123');
  });

  it('should handle fetchListAction.pending', () => {
    const result = reducer(initialState, fetchListAction.pending('', {}));
    expect(result.loading).toBe(true);
  });
});
```

#### Hook 测试

```typescript
// tests/hooks/{name}.test.ts
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { use{Name} } from '@/hooks/use{Name}';

describe('use{Name}', () => {
  it('should return expected values', () => {
    const { result } = renderHook(() => use{Name}());
    expect(result.current).toBeDefined();
  });
});
```

#### 组件测试

```typescript
// tests/components/{Name}.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {Name} from '@/components/{Name}';

describe('{Name}', () => {
  it('should render correctly', () => {
    render(<{Name} />);
    // TODO: 断言
  });
});
```

## 覆盖率目标

| 指标 | 目标 |
|------|------|
| Statements | 80% |
| Branches | 80% |
| Functions | 80% |
| Lines | 80% |

## 输出格式

```markdown
## 覆盖率报告

### 当前覆盖率
- Statements: 65% (目标 80%)
- Branches: 58% (目标 80%)

### 未覆盖模块
1. src/store/modules/permission.ts (0%)
2. src/hooks/usePermission.ts (0%)
3. src/utils/crypto.ts (30%)

### 生成的测试 (--auto-generate)
- [x] tests/store/modules/permission.test.ts
- [x] tests/hooks/usePermission.test.ts
- [x] tests/utils/crypto.test.ts
```
