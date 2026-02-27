---
name: router-development
description: React Router 路由配置、三层路由体系、AuthGuard 鉴权守卫、权限控制、动态路由
tools: ["Read", "Grep", "Glob"]
model: sonnet
---

# Router Development - 路由开发指南

## 职责
指导 React Router 路由的配置和使用，包括三层路由体系、AuthGuard 鉴权守卫、角色权限控制和路由 Meta 配置。

---

## 项目路由架构

### 目录结构

```
src/router/
├── index.tsx              # 路由实例 (createBrowserRouter)
├── guards.tsx             # AuthGuard 鉴权守卫组件
└── routes/
    ├── base.tsx           # 基础路由 (登录、403)
    ├── common.tsx         # 公共路由 (首页)
    └── async.tsx          # 异步路由 (需要权限的页面)
```

### 三层路由体系

```
┌─────────────────────────────────────────┐
│ base.tsx - 基础路由 (无需登录)            │
│  /login, /403                           │
├─────────────────────────────────────────┤
│ common.tsx - 公共路由 (登录即可访问)       │
│  /home                                   │
├─────────────────────────────────────────┤
│ async.tsx - 异步路由 (需要角色权限)        │
│  /setting/frontend, /setting/theme       │
└─────────────────────────────────────────┘
```

---

## 路由配置规范

### 基础路由

```typescript
// src/router/routes/base.tsx
import Login from '@/views/Login';
import NotFound from '@/views/NotFound';
import Forbidden from '@/views/Forbidden';

export const baseRoutes: RouteObject[] = [
  { path: '/login', element: <Login /> },
  { path: '/403', element: <Forbidden /> },
];
```

### 公共路由

```typescript
// src/router/routes/common.tsx
import { Navigate } from 'react-router-dom';
import Home from '@/views/Home';

export const commonRoutes: RouteObject[] = [
  { index: true, element: <Navigate to="/home" replace /> },
  { path: 'home', element: <Home /> },
];
```

### 异步路由 (需权限)

```typescript
// src/router/routes/async.tsx
import { ROLES } from '@/constants';
import SettingFrontend from '@/views/Setting/Frontend';
import SettingTheme from '@/views/Setting/Theme';

export const asyncRoutes: RouteObject[] = [
  {
    path: 'setting',
    children: [
      {
        path: 'frontend',
        element: <SettingFrontend />,
        handle: {
          title: '前端设置',
          roles: [ROLES.ADMIN],
        },
      },
      {
        path: 'theme',
        element: <SettingTheme />,
        handle: {
          title: '主题设置',
          roles: [ROLES.ADMIN],
        },
      },
    ],
  },
];

// 将 RouteObject[] 转换为 RouteConfig[] 用于权限过滤
export function toRouteMetas(routes: RouteObject[]): RouteConfig[] { ... }
```

---

## AuthGuard 鉴权守卫

### 执行流程

```
用户访问路由
    ↓
检查 Token (localStorage)
    ├── 无 Token → 重定向 /login
    ↓
检查权限路由是否已初始化
    ├── 未初始化 → 获取用户信息 → 生成权限路由
    ↓
检查当前路由是否在异步路由中
    ├── 在异步路由中 → 检查用户角色是否有权限
    │   ├── 无权限 → 重定向 /403
    │   └── 有权限 → 渲染页面
    └── 不在异步路由中 (公共路由) → 直接渲染
```

### 使用方式

```typescript
// src/router/index.tsx
import { AuthGuard } from './guards';

const router = createBrowserRouter([
  ...baseRoutes,
  {
    path: '/',
    element: (
      <AuthGuard>
        <Suspense fallback={null}>
          <Layout />
        </Suspense>
      </AuthGuard>
    ),
    children: [...commonRoutes, ...asyncRoutes],
  },
  { path: '*', element: <NotFound /> },
]);
```

---

## 权限控制

### 角色常量

```typescript
// src/constants/roles.ts (或 constants/index.ts)
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];
```

### 路由 Meta 配置

```typescript
// handle 对象 (React Router 的 route meta)
interface RouteHandle {
  title?: string;                // 页面标题
  roles?: RoleType[];            // 允许的角色
  layout?: {
    layout?: boolean;            // 是否显示 Layout
    header?: boolean;            // 是否显示 Header
    logo?: { title: string };    // Logo 配置
    customMenu?: MenuItem[];     // 自定义菜单
  };
}

// 使用示例
{
  path: 'admin-panel',
  element: <AdminPanel />,
  handle: {
    title: '管理面板',
    roles: [ROLES.ADMIN],        // 仅管理员可访问
    layout: {
      header: true,
      logo: { title: '管理后台' },
    },
  },
}
```

### Permission Store

```typescript
// src/store/modules/permission.ts
// generateRoutesAction: 根据用户角色过滤 asyncRoutes
// hasRoutePermission: 检查用户是否有路由权限
// filterRoutesByRoles: 按角色过滤路由树

dispatch(generateRoutesAction({ asyncRoutes: toRouteMetas(asyncRoutes), roles: userRoles }));
```

### usePermission Hook

```typescript
import { usePermission } from '@/hooks/usePermission';

const MyComponent = () => {
  const { role, isAdmin, canEdit, canDelete, hasRole } = usePermission({
    edit: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
  });

  return (
    <div>
      {canEdit && <Button onClick={handleEdit}>编辑</Button>}
      {canDelete && <Button danger onClick={handleDelete}>删除</Button>}
    </div>
  );
};
```

---

## 新增路由开发流程

### 步骤 1: 创建页面组件

```bash
mkdir src/views/NewFeature
touch src/views/NewFeature/index.tsx
touch src/views/NewFeature/index.module.scss
```

### 步骤 2: 编写页面组件

```typescript
// src/views/NewFeature/index.tsx
import React from 'react';
import styles from './index.module.scss';

const NewFeature: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2>新功能页面</h2>
    </div>
  );
};

export default NewFeature;
```

### 步骤 3: 配置路由

```typescript
// 根据页面类型选择:
// - 无需登录 → base.tsx
// - 所有用户可访问 → common.tsx
// - 需要权限 → async.tsx

// 示例: 在 async.tsx 中添加
import NewFeature from '@/views/NewFeature';

{
  path: 'new-feature',
  element: <NewFeature />,
  handle: {
    title: '新功能',
    roles: [ROLES.ADMIN, ROLES.USER],
  },
}
```

### 步骤 4: 验证

```bash
pnpm start
# 访问 http://localhost:3344/new-feature
```

---

## 常见路由场景

### 嵌套路由

```typescript
{
  path: 'user',
  children: [
    { index: true, element: <Navigate to="list" replace /> },
    { path: 'list', element: <UserList /> },
    { path: ':id', element: <UserDetail /> },
    { path: ':id/edit', element: <UserEdit /> },
  ],
}
```

### 动态参数

```typescript
// 路由配置
{ path: 'user/:id', element: <UserDetail /> }

// 组件中获取参数
import { useParams } from 'react-router-dom';
const { id } = useParams<{ id: string }>();
```

### 重定向

```typescript
// 默认重定向
{ index: true, element: <Navigate to="/home" replace /> }

// 条件重定向 (在 AuthGuard 中处理)
if (!token) return <Navigate to="/login" replace />;
```

### 路由导航

```typescript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/home');                    // 跳转
navigate('/home', { replace: true }); // 替换 (不保留历史)
navigate(-1);                         // 后退
```

---

## 快速检查清单

- [ ] 路由放在正确的文件 (base/common/async)
- [ ] handle 中配置了 title 和 roles (async 路由)
- [ ] 页面组件已创建
- [ ] 导入使用 `@/views/` 路径
- [ ] 嵌套路由有正确的 index 重定向
- [ ] 动态参数使用 TypeScript 类型

---

## 相关文档

- [common-patterns.md](common-patterns.md) - 通用模式
- [store-development.md](store-development.md) - Permission Store
- [project-structure.md](project-structure.md) - 目录结构
