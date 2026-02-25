---
name: component-development
description: React 组件开发规范，包括组件设计原则、Ant Design 集成、样式规范、Figma 还原
tools: ["Read", "Grep", "Glob"]
model: sonnet
---

# Component Development - React 组件开发规范

## 职责
指导 React 组件的设计、开发和维护，包括组件分层、Props 设计、Ant Design 集成、样式规范和 Figma 设计还原。

---

## 组件设计原则

1. **单一职责**: 每个组件只做一件事
2. **可复用性**: 通过 Props 参数化，避免硬编码
3. **组合优于继承**: 使用组合模式，通过 children 和 render props 扩展
4. **TypeScript 优先**: 所有 Props 必须有 TypeScript 接口定义

---

## 组件分类体系

### 全局公用组件 (`src/components/`)

多页面复用的组件，如 ErrorBoundary、LazyImage、Skeleton 等。

```
src/components/
├── ErrorBoundary/           # 错误边界
│   └── index.tsx
├── LazyImage/               # 懒加载图片
│   └── index.tsx
├── Skeleton/                # 骨架屏
│   └── index.tsx
└── StaticFunction/          # 全局静态工具
    └── index.tsx
```

### 页面级组件 (`src/views/[page]/components/`)

特定页面专用的组件，不在其他页面中使用。

```
src/views/UserManagement/
├── index.tsx                # 页面入口
├── index.module.scss        # 页面样式
└── components/              # 页面级组件
    ├── UserTable.tsx
    ├── UserForm.tsx
    └── UserFilter.tsx
```

### 页面组件 (`src/views/`)

路由对应的页面，**页面间禁止互相导入** (ESLint 强制)。

---

## 组件开发模板

### 基础组件

```typescript
import React from 'react';
import styles from './index.module.scss';

interface UserCardProps {
  /** 用户信息 */
  user: UserInfo;
  /** 是否紧凑模式 */
  compact?: boolean;
  /** 点击回调 */
  onClick?: (user: UserInfo) => void;
  /** 自定义类名 */
  className?: string;
}

const UserCard: React.FC<UserCardProps> = ({ user, compact = false, onClick, className }) => {
  return (
    <div
      className={`${styles.card} ${compact ? styles.compact : ''} ${className || ''}`}
      onClick={() => onClick?.(user)}
    >
      <div className={styles.avatar}>
        <img src={user.avatar} alt={user.realName} />
      </div>
      <div className={styles.info}>
        <h4 className={styles.name}>{user.realName}</h4>
        <span className={styles.role}>{user.role}</span>
      </div>
    </div>
  );
};

export default UserCard;
```

### 业务组件 (带 Store 和 API)

```typescript
import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, message } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store';
import { getUserList } from '@/api';
import type { UserInfo } from '@/api';

interface UserTableProps {
  /** 筛选角色 */
  filterRole?: string;
  /** 选中回调 */
  onSelect?: (users: UserInfo[]) => void;
}

const UserTable: React.FC<UserTableProps> = ({ filterRole, onSelect }) => {
  const [data, setData] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getUserList({ role: filterRole });
      setData(result.list);
    } catch {
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  }, [filterRole]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    { title: '姓名', dataIndex: 'realName', key: 'name' },
    { title: '角色', dataIndex: 'role', key: 'role' },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: UserInfo) => (
        <Space>
          <Button type="link" size="small">编辑</Button>
          <Button type="link" size="small" danger>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      rowSelection={onSelect ? { onChange: (_, rows) => onSelect(rows) } : undefined}
    />
  );
};

export default UserTable;
```

---

## 页面布局约定

### 全局 Layout

项目使用统一 Layout 包裹所有鉴权页面：

```
Layout (src/layout/)
├── LayoutHeader    # 顶部导航
├── LayoutMenu      # 侧边菜单
└── LayoutMain      # 内容区 (Outlet 渲染子路由)
```

**Layout 配置**: 通过路由的 `handle.layout` 控制显隐

```typescript
// src/router/routes/async.tsx
{
  path: 'fullscreen-page',
  element: <FullscreenPage />,
  handle: {
    title: '全屏页面',
    layout: {
      layout: false,    // 隐藏整个 Layout
      header: false,    // 或只隐藏 Header
    }
  }
}
```

---

## 错误边界

### 使用 ErrorBoundary

```typescript
import ErrorBoundary from '@/components/ErrorBoundary';

// 包裹整个页面
const App = () => (
  <ErrorBoundary>
    <RouterProvider router={router} />
  </ErrorBoundary>
);

// 包裹特定区域
const Dashboard = () => (
  <div>
    <ErrorBoundary>
      <ChartComponent />  {/* 图表出错不影响其他区域 */}
    </ErrorBoundary>
    <UserList />
  </div>
);
```

**注意**: ErrorBoundary 使用 Class Component 实现 (React 限制)，内部集成 Sentry 上报。

---

## Ant Design 集成规范

### 主题定制

```typescript
// 使用 ConfigProvider 包裹
import { ConfigProvider } from 'antd';
import { getAntdTheme } from '@/plugins/theme';

const App = () => (
  <ConfigProvider theme={getAntdTheme(currentTheme)}>
    <RouterProvider router={router} />
  </ConfigProvider>
);
```

### 组件覆写样式

```scss
// ✅ 正确: 通过 CSS 变量覆写 Ant Design 组件
.custom-table {
  :global {
    .ant-table-thead > tr > th {
      background: var(--ant-color-bg-container);
    }
  }
}

// ❌ 错误: 直接用硬编码颜色覆写
.custom-table .ant-table-thead > tr > th {
  background: #fafafa;  // 禁止!
}
```

---

## 样式规范

### CSS Modules (推荐)

```typescript
// index.module.scss
.container {
  padding: 16px;
  background: var(--ant-color-bg-container);
}

.title {
  font-size: 18px;
  color: var(--ant-color-text);
}

// 组件中使用
import styles from './index.module.scss';

const Page = () => (
  <div className={styles.container}>
    <h2 className={styles.title}>标题</h2>
  </div>
);
```

### UnoCSS (工具类)

```typescript
// 简单布局使用 UnoCSS
const FlexRow = () => (
  <div className="flex items-center gap-2">
    <span>Label</span>
    <Input />
  </div>
);
```

**选择原则**:
- 复杂样式 → CSS Modules
- 简单布局 (flex、margin、padding) → UnoCSS
- 不要混用同一组件内的样式方案

---

## Figma 设计还原

### 流程

```
1. 使用 Figma MCP 获取设计数据
2. 提取设计 Token (间距、颜色、字体)
3. 下载图片资源 (SVG → src/assets/icons/, PNG → src/assets/images/)
4. 映射颜色到 CSS 变量
5. 编写组件代码
```

### 图标使用规范

```typescript
// ✅ 正确: SVG 下载为文件，用 img 标签引用
<img src={iconSrc} alt="icon" className={styles.icon} />

// ✅ 正确: 使用 unplugin-icons (自动导入)
import HomeIcon from '~icons/custom/home';
<HomeIcon className={styles.icon} />

// ❌ 禁止: 内联 SVG
<svg viewBox="0 0 24 24"><path d="..." /></svg>
```

---

## 快速检查清单

- [ ] Props 使用 TypeScript 接口
- [ ] 组件分类正确 (全局/页面级)
- [ ] 使用 CSS 变量/Ant Design Token 设置颜色
- [ ] CSS Modules 或 UnoCSS (不混用)
- [ ] 错误处理完整 (try-catch)
- [ ] 加载状态处理 (loading)
- [ ] key 属性正确 (列表渲染)
- [ ] 事件处理使用 useCallback (传给子组件时)
- [ ] 图标使用文件引用 (非内联 SVG)

---

## 相关文档

- [common-patterns.md](common-patterns.md) - Props/CSS/数据驱动 (SSoT)
- [figma-extraction-guide.md](figma-extraction-guide.md) - Figma 设计还原
- [coding-standards.md](coding-standards.md) - 编码规范
