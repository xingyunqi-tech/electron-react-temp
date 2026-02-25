---
name: component-generator
description: 智能 React 组件生成，支持基础/业务/页面三种类型，自动集成 Store 和 API
---

# Component Generator - 组件生成器

## 功能概述
根据规范自动生成 React TypeScript 组件，支持基础组件、业务组件和页面组件三种类型。

## 使用方式
```bash
/component-generator <ComponentName> [--type basic|business|page] [--smart] [--with-router]

# 示例
/component-generator UserCard --type basic
/component-generator UserTable --type business --smart
/component-generator UserManagement --type page --smart --with-router
```

## 参数说明
| 参数 | 说明 | 默认值 |
|------|------|--------|
| `--type` | 组件类型 | `basic` |
| `--smart` | 智能模式 (自动分析依赖) | `false` |
| `--with-router` | 同时生成路由配置 | `false` |

## 组件模板

### Basic (基础组件)
位置: `src/components/{Name}/index.tsx`

```typescript
import React from 'react';
import styles from './index.module.scss';

interface {Name}Props {
  /** 属性描述 */
  // TODO: 定义 Props
}

const {Name}: React.FC<{Name}Props> = (props) => {
  return (
    <div className={styles.container}>
      {/* TODO: 组件内容 */}
    </div>
  );
};

export default {Name};
```

### Business (业务组件)
位置: `src/views/{Page}/components/{Name}.tsx`

```typescript
import React, { useState, useCallback } from 'react';
import { message } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store';
// TODO: 导入 API 和类型

interface {Name}Props {
  // TODO: 定义 Props
}

const {Name}: React.FC<{Name}Props> = (props) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  // TODO: 业务逻辑

  return (
    <div>
      {/* TODO: 组件内容 */}
    </div>
  );
};

export default {Name};
```

### Page (页面组件)
位置: `src/views/{Name}/index.tsx`

```typescript
import React, { useState, useEffect, useCallback } from 'react';
import { Button, Space, message } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store';
import styles from './index.module.scss';
// TODO: 导入 API、Store、类型

const {Name}: React.FC = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: 初始化数据
  }, []);

  return (
    <div className={styles.container}>
      {/* TODO: 页面内容 */}
    </div>
  );
};

export default {Name};
```

## Smart 模式
启用 `--smart` 时:
1. 分析项目现有 API (从 `@/api`)
2. 自动匹配 Store 模块
3. 生成完整的 CRUD 页面逻辑
4. 包含 Loading、错误处理、分页

## 规范约束
- Props 必须使用 TypeScript 接口
- 颜色使用 CSS 变量 / Ant Design Token
- 回调函数使用 `on` 前缀
- 参考 [common-patterns agent] 和 [component-development agent]
