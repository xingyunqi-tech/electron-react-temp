---
name: coding-standards
description: TypeScript 编码规范、React 组件规范、导入排序、命名约定、样式规范
tools: ["Read", "Grep", "Glob"]
model: sonnet
---

# Coding Standards - 编码规范

## 职责
定义项目编码规范，包括 TypeScript 编码规范、React 组件规范、命名约定、导入排序、样式规范。

---

## 编码原则

1. **类型优先**: 优先定义接口和类型，再实现逻辑
2. **函数式编程**: React 使用函数组件 + Hooks，避免 Class Component (ErrorBoundary 除外)
3. **国际化原则**: AI 生成代码使用明文英文，由脚本统一翻译
4. **全局插件原则**: Dayjs、i18n、Storage 已全局配置，禁止重复配置

---

## TypeScript 编码规范

### 接口定义

```typescript
// ✅ 正确: 使用 interface 定义对象类型
interface UserInfo {
  id: string;
  username: string;
  realName: string;
  role: RoleType;
  email?: string;
}

// ✅ 正确: 使用 type 定义联合类型/工具类型
type RoleType = 'admin' | 'user';
type Nullable<T> = T | null;

// ❌ 错误: 使用 any
const data: any = {};

// ✅ 替代: 使用 unknown + 类型守卫
const data: unknown = {};
if (isUserInfo(data)) { ... }
```

### 函数定义

```typescript
// ✅ 正确: 明确参数和返回类型
function formatDate(date: Date | string, format: string = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format);
}

// ✅ 正确: 箭头函数
const isAdmin = (role: RoleType): boolean => role === 'admin';

// ✅ 正确: 异步函数
async function fetchUser(id: string): Promise<UserInfo> {
  return await getCurrentUser();
}
```

### 枚举和常量

```typescript
// ✅ 推荐: as const 对象 (可 tree-shake)
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];

// ✅ 也可以: TypeScript enum (简单场景)
export enum Status {
  Active = 'active',
  Inactive = 'inactive',
}

// 常量命名: UPPER_SNAKE_CASE
export const MAX_RETRY_COUNT = 3;
export const API_TIMEOUT = 30000;
export const DEFAULT_PAGE_SIZE = 10;
```

### 类型守卫

```typescript
// ✅ 正确: 类型守卫函数
function isUserInfo(value: unknown): value is UserInfo {
  return typeof value === 'object' && value !== null && 'id' in value && 'username' in value;
}
```

---

## React 组件编码规范

### 代码组织顺序

```typescript
// 1. 导入声明 (按规范排序)
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useAppSelector } from '@/store';
import type { UserInfo } from '@/api';
import styles from './index.module.scss';

// 2. 类型定义
interface PageProps { ... }

// 3. 常量
const PAGE_SIZE = 10;

// 4. 组件定义
const MyPage: React.FC<PageProps> = ({ ... }) => {
  // 4a. Hooks (Redux, Router, 自定义)
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAdmin } = usePermission();

  // 4b. State
  const [data, setData] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(false);

  // 4c. Computed/Memo
  const filteredData = useMemo(() => data.filter(...), [data]);

  // 4d. Callbacks
  const handleSubmit = useCallback(async () => { ... }, []);

  // 4e. Effects
  useEffect(() => { ... }, []);

  // 4f. 渲染
  return <div>...</div>;
};

// 5. 导出
export default MyPage;
```

### Hooks 规范

```typescript
// ✅ 正确: 条件渲染放在 Hooks 之后
const MyComponent = () => {
  const [show, setShow] = useState(false);
  const data = useAppSelector(dataSelector);  // Hook 必须在顶层

  if (!show) return null;  // 条件渲染在 Hooks 之后

  return <div>{data}</div>;
};

// ❌ 错误: 条件中使用 Hook
const MyComponent = () => {
  const [show, setShow] = useState(false);
  if (!show) return null;  // 禁止! 后面的 Hook 可能被跳过
  const data = useAppSelector(dataSelector);
  return <div>{data}</div>;
};
```

---

## 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| **组件** | PascalCase | `UserCard`, `LoginForm` |
| **Hook** | camelCase + use 前缀 | `usePermission`, `useUserList` |
| **函数** | camelCase | `formatDate`, `handleSubmit` |
| **常量** | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_TIMEOUT` |
| **接口** | PascalCase | `UserInfo`, `LoginFormValues` |
| **类型** | PascalCase | `RoleType`, `ThemeMode` |
| **文件名 (组件)** | PascalCase | `UserCard.tsx`, `LoginForm.tsx` |
| **文件名 (工具)** | camelCase | `formatDate.ts`, `crypto.ts` |
| **文件名 (样式)** | 同组件 + .module | `index.module.scss` |
| **CSS 类名** | kebab-case 或 camelCase (Modules) | `.user-card` 或 `.userCard` |
| **目录名 (组件)** | PascalCase | `UserCard/`, `ErrorBoundary/` |
| **目录名 (工具)** | camelCase | `utils/`, `hooks/` |

---

## 导入规范

### 导入顺序 (强制)

```typescript
// 1. React 核心
import React, { useState } from 'react';

// 2. 第三方库
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

// 3. Store
import { useAppDispatch, useAppSelector } from '@/store';

// 4. API
import { getUserList } from '@/api';

// 5. 组件
import ErrorBoundary from '@/components/ErrorBoundary';

// 6. Hooks / Utils / Constants
import { usePermission } from '@/hooks/usePermission';
import { ROLES } from '@/constants';

// 7. 类型 (type-only)
import type { UserInfo } from '@/api';

// 8. 样式 (最后)
import styles from './index.module.scss';
```

### Type-only Import

```typescript
// ✅ 正确: 仅类型导入使用 type 关键字
import type { UserInfo, LoginResponse } from '@/api';
import type { RootState, AppDispatch } from '@/store';

// ✅ 正确: 混合导入
import { getUserList, type UserInfo } from '@/api';
```

### 路径别名

```typescript
// ✅ 使用 @ 别名 (跨目录)
import { UserCard } from '@/components/UserCard';

// ✅ 使用相对路径 (同级/子级)
import { SubComponent } from './components/SubComponent';

// ❌ 禁止: 长相对路径
import { UserCard } from '../../../components/UserCard';
```

---

## API 开发规范

```typescript
// ✅ 从 @/api 统一导入
import { loginWithPhone, getCurrentUser } from '@/api';
import type { UserInfo, LoginResponse } from '@/api';

// ❌ 禁止: 直接从 generated 导入
import { loginWithPhone } from '@/api/generated/auth/auth';

// ❌ 禁止: 修改 generated 目录
// src/api/generated/** 是自动生成的!
```

---

## 全局插件使用原则

```typescript
// ✅ Dayjs: 直接使用，已全局配置
import dayjs from 'dayjs';
const now = dayjs().format('YYYY-MM-DD');
const relative = dayjs().fromNow();  // RelativeTime 插件已配置

// ❌ 禁止重复配置
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);  // 已全局配置!

// ✅ i18n: 使用 useTranslation
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();

// ✅ Storage: 使用封装的 storage
import { storage } from '@/plugins/storage';
storage('localStorage').set('key', value);
storage('localStorage').get('key');
```

---

## 样式编码规范

### SCSS 组织

```scss
// 变量引用
.container {
  // 布局
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;

  // 视觉
  background: var(--ant-color-bg-container);
  border-radius: var(--ant-border-radius);

  // 文本
  color: var(--ant-color-text);
  font-size: var(--ant-font-size);
}
```

### CSS Modules 命名

```scss
// ✅ 推荐: camelCase (自动映射)
.userCard { ... }
.cardHeader { ... }
.actionButton { ... }

// 使用
<div className={styles.userCard}>
  <div className={styles.cardHeader}>...</div>
</div>
```

---

## 编码规范快速检查清单

- [ ] TypeScript 接口完整定义
- [ ] 无 `any` 类型 (使用 `unknown` + 类型守卫)
- [ ] 导入顺序正确
- [ ] 命名符合规范
- [ ] 组件代码按规定顺序组织
- [ ] Hooks 在顶层调用 (不在条件中)
- [ ] 全局插件未重复配置
- [ ] API 从 `@/api` 统一导入
- [ ] 类型导入使用 `import type`

---

## 相关文档

- [common-patterns.md](common-patterns.md) - Props/CSS 规范
- [component-development.md](component-development.md) - 组件开发
- [api-development.md](api-development.md) - API 规范
