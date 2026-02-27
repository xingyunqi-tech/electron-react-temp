---
name: project-structure
description: 项目结构解析，目录组织规范，文件分类指导，架构设计原则
tools: ["Read", "Grep", "Glob"]
model: sonnet
---

# Project Structure - 项目结构

## 职责
解析项目目录结构，指导文件组织规范和新文件创建位置。

---

## 项目整体架构

### 技术栈
- **前端**: React 18 + TypeScript + Vite 7
- **桌面端**: Electron 40
- **状态管理**: Redux Toolkit + Redux Saga
- **UI**: Ant Design 6 + UnoCSS
- **API**: Axios + Orval

### 架构特点
- Web + Electron 双模式部署
- 动态模块注册的 Redux 框架
- Orval 自动生成 API 层
- 三层路由权限体系

---

## 核心目录详解

### `src/api/` - API 层

```
src/api/
├── core/mutator.ts      # HTTP 客户端 (多实例、请求去重)
├── generated/            # 🚫 Orval 自动生成 (禁止修改)
├── custom/               # ✅ 自定义扩展
└── index.ts              # 统一导出
```
- **自动生成**: `pnpm api:gen` 根据 OpenAPI 规范生成
- **扩展方式**: 在 `custom/` 目录添加新文件

### `src/store/` - 状态管理

```
src/store/
├── index.ts              # Store 配置入口
├── framework/            # 自定义 Redux 框架
│   ├── factory.ts        # createReduxFramework()
│   ├── module.ts         # defineModule / destroyModule
│   ├── plugins/          # 持久化、循环任务插件
│   └── hooks.ts          # useReduxDispatch / useReduxSelector
└── modules/              # 业务模块
    ├── global.ts          # 主题、语言
    ├── user.ts            # 用户认证
    └── permission.ts      # 路由权限
```

### `src/router/` - 路由

```
src/router/
├── index.tsx             # createBrowserRouter
├── guards.tsx            # AuthGuard 鉴权
└── routes/
    ├── base.tsx           # 登录、403
    ├── common.tsx         # 首页 (登录即可)
    └── async.tsx          # 需权限的页面
```

### `src/views/` - 页面组件

```
src/views/
├── Home/                 # 首页
│   └── index.tsx
├── Login/                # 登录页
│   ├── index.tsx
│   └── components/       # 页面级组件
├── Setting/              # 设置页
│   ├── Frontend/
│   └── Theme/
├── Forbidden/            # 403
└── NotFound/             # 404
```
- **隔离规则**: 页面间禁止互相导入 (ESLint 强制)
- **页面级组件**: 放在 `views/[page]/components/`

### `src/components/` - 全局组件

```
src/components/
├── ErrorBoundary/        # 错误边界 (Class Component + Sentry)
├── LazyImage/            # 懒加载图片
├── Skeleton/             # 骨架屏
└── StaticFunction/       # 全局静态工具
```

### `src/plugins/` - 全局插件

```
src/plugins/
├── dayjs.ts              # 日期库 (RelativeTime 等)
├── locale.ts             # i18n 国际化
├── theme.ts              # Ant Design 主题配置
├── webVitals.ts          # Web 性能指标
├── logger/               # 日志工具
├── sentry/               # 错误监控 (动态加载)
└── storage/              # 存储抽象
```

### `electron/` - Electron 进程

```
electron/
├── main/index.ts         # 主进程 (窗口管理、IPC)
└── preload/index.ts      # 预加载 (安全暴露 API)
```

---

## 文件引用规范

### 路径别名

```typescript
import { ... } from '@/api';           // src/api/
import { ... } from '@/components';    // src/components/
import { ... } from '@/store';         // src/store/
import { ... } from '@/hooks';         // src/hooks/
import { ... } from '@/utils';         // src/utils/
import { ... } from '@/constants';     // src/constants/
```

### 禁止引用

```typescript
// ❌ 禁止: Views 间互相导入
// src/views/Home/index.tsx 中不能导入 src/views/Login/ 的任何内容

// ❌ 禁止: 直接导入 generated
import { ... } from '@/api/generated/auth/auth';  // 用 @/api 代替
```

---

## 目录创建指导

### 新增页面

```bash
mkdir src/views/NewPage
touch src/views/NewPage/index.tsx
touch src/views/NewPage/index.module.scss
# 可选: 页面级组件
mkdir src/views/NewPage/components
```

### 新增全局组件

```bash
mkdir src/components/NewComponent
touch src/components/NewComponent/index.tsx
```

### 新增 Store 模块

```bash
touch src/store/modules/newFeature.ts
# 在 src/store/index.ts 中注册 reducer
```

### 新增 API 自定义扩展

```bash
touch src/api/custom/newFeature.ts
# 在 src/api/index.ts 中导出
```

---

## AI 编程指导原则

1. **目录选择**: 根据功能分类放入正确目录
2. **文件命名**: 组件 PascalCase，工具 camelCase
3. **代码组织**: 导入 → 类型 → 常量 → 组件 → 导出
4. **引用关系**: 使用 @ 别名，遵守隔离规则

---

## 相关文档

- [component-development.md](component-development.md) - 组件开发
- [router-development.md](router-development.md) - 路由配置
- [store-development.md](store-development.md) - Store 设计
