---
name: common-patterns
description: 通用开发模式的单一真实来源 (SSoT)，涵盖 React 组件模式、TypeScript 接口、CSS 变量、错误处理等
tools: ["Read", "Grep", "Glob"]
model: sonnet
---

# Common Patterns - 通用开发模式

## 职责
作为项目通用开发模式的**单一真实来源 (Single Source of Truth)**，所有其他 Agent 引用本文档中的规范。

---

## React 组件模式

### Props 定义规范

**必须使用 TypeScript 接口定义所有 Props**

```typescript
// ✅ 正确: 完整的 TypeScript 接口
interface UserCardProps {
  /** 用户信息 */
  user: UserInfo;
  /** 是否显示操作按钮 */
  showActions?: boolean;
  /** 编辑回调 */
  onEdit?: (id: string) => void;
  /** 删除回调 */
  onDelete?: (id: string) => void;
  /** 自定义类名 */
  className?: string;
  /** 子元素 */
  children?: React.ReactNode;
}

const UserCard: React.FC<UserCardProps> = ({ user, showActions = true, onEdit, onDelete, className, children }) => {
  return (
    <div className={className}>
      <span>{user.realName}</span>
      {showActions && (
        <>
          {onEdit && <Button onClick={() => onEdit(user.id)}>编辑</Button>}
          {onDelete && <Button onClick={() => onDelete(user.id)}>删除</Button>}
        </>
      )}
      {children}
    </div>
  );
};

// ❌ 错误: 使用 any 或不定义接口
const UserCard = (props: any) => { ... };
```

**Props 定义规则:**
1. 必选参数在前，可选参数在后
2. 回调函数使用 `on` 前缀: `onClick`, `onChange`, `onEdit`
3. 布尔值使用 `is`/`has`/`show` 前缀: `isLoading`, `hasError`, `showActions`
4. 提供有意义的默认值
5. 添加 JSDoc 注释说明用途

### 组件声明规范

```typescript
// ✅ 推荐: React.FC + 解构 Props
const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  return <div>{title}</div>;
};

// ✅ 也可以: 直接声明函数
function MyComponent({ title, onAction }: MyComponentProps) {
  return <div>{title}</div>;
}

export default MyComponent;
```

### Hooks 使用规范

```typescript
// ✅ 正确: 自定义 Hook 以 use 开头
function useUserList(params: ListParams) {
  const [data, setData] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getUserList(params);
      setData(result.list);
    } catch (error) {
      console.error('Failed to fetch user list:', error);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, refresh: fetchData };
}

// ❌ 错误: Hook 不以 use 开头
function fetchUserList() { ... }  // 这不是 Hook
```

**Hooks 规则:**
1. 自定义 Hook 必须以 `use` 开头
2. 只在组件顶层调用 Hook，不在条件/循环中调用
3. 使用 `useCallback` 包裹传给子组件的函数
4. 使用 `useMemo` 缓存昂贵计算
5. `useEffect` 依赖数组必须完整

---

## 数据驱动模式

### 列表渲染

```typescript
// ✅ 正确: 数据驱动 + map 渲染
interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const menuItems: MenuItem[] = [
  { key: 'home', label: '首页', icon: <HomeIcon />, path: '/home' },
  { key: 'setting', label: '设置', icon: <SettingIcon />, path: '/setting' },
];

const Menu: React.FC = () => (
  <nav>
    {menuItems.map(item => (
      <Link key={item.key} to={item.path}>
        {item.icon}
        <span>{item.label}</span>
      </Link>
    ))}
  </nav>
);

// ❌ 错误: 硬编码重复结构
const Menu = () => (
  <nav>
    <Link to="/home"><HomeIcon /><span>首页</span></Link>
    <Link to="/setting"><SettingIcon /><span>设置</span></Link>
  </nav>
);
```

### 数据接口类型

```typescript
// ✅ 正确: 定义完整的数据接口
interface TableColumn<T = unknown> {
  key: string;
  title: string;
  dataIndex: keyof T;
  width?: number;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
}

// 使用泛型约束
const columns: TableColumn<UserInfo>[] = [
  { key: 'name', title: '姓名', dataIndex: 'realName', width: 120 },
  { key: 'role', title: '角色', dataIndex: 'role', render: (val) => getRoleName(val as string) },
];
```

---

## CSS 变量使用规范

### Ant Design Token 变量 (优先使用)

```scss
// ✅ 正确: 使用 Ant Design CSS 变量
.component {
  // 文本颜色
  color: var(--ant-color-text);                    // 主文本
  color: var(--ant-color-text-secondary);           // 次要文本
  color: var(--ant-color-text-tertiary);            // 辅助文本
  color: var(--ant-color-text-quaternary);          // 占位符

  // 背景颜色
  background: var(--ant-color-bg-container);        // 容器背景
  background: var(--ant-color-bg-layout);           // 布局背景
  background: var(--ant-color-bg-elevated);         // 悬浮背景

  // 边框
  border: 1px solid var(--ant-color-border);        // 标准边框
  border: 1px solid var(--ant-color-border-secondary); // 次要边框

  // 主题色
  color: var(--ant-color-primary);                  // 主色
  color: var(--ant-color-success);                  // 成功
  color: var(--ant-color-warning);                  // 警告
  color: var(--ant-color-error);                    // 错误
  color: var(--ant-color-info);                     // 信息

  // 圆角
  border-radius: var(--ant-border-radius);          // 标准圆角

  // 字体
  font-size: var(--ant-font-size);                  // 标准字体大小
  font-family: var(--ant-font-family);              // 字体族
}

// ❌ 错误: 硬编码颜色
.component {
  color: #333;            // 禁止!
  background: #fff;       // 禁止!
  border: 1px solid #d9d9d9; // 禁止!
}
```

### public/theme.css 自定义变量

```scss
// 项目自定义变量 (在 public/theme.css 中定义)
.component {
  color: var(--colorTextHeading);
  background: var(--colorBgContainer);
}
```

**优先级**: Ant Design Token > public/theme.css 自定义变量 > 硬编码值 (禁止)

### CSS 盒模型规范

```scss
// ✅ 必须: 所有组件使用 border-box
.component {
  box-sizing: border-box;

  *, *::before, *::after {
    box-sizing: inherit;
  }
}
```

### 样式选择器规范

```scss
// ✅ 正确: 使用 class 选择器
.user-card { ... }
.user-card-header { ... }

// ✅ 正确: CSS Modules
.container { ... }
.header { ... }

// ❌ 禁止: 标签选择器
h1 { ... }
div { ... }
p { ... }

// 嵌套深度: 最多 3 层
.parent {
  .child {
    .grandchild { ... }  // 最大深度
  }
}
```

### RGB 颜色函数规范

```scss
// ✅ 正确: 现代 RGB 语法 (无逗号)
color: rgb(255 255 255 / 0.8);
background: rgb(0 0 0 / 0.05);

// ❌ 错误: 旧式 rgba 语法
color: rgba(255, 255, 255, 0.8);
```

### CSS 数值精度

```scss
// ✅ 正确: 小数保留最多 3 位
width: 33.333%;
opacity: 0.85;

// ❌ 错误: 过多小数位
width: 33.333333%;
```

---

## 错误处理模式

### 异步函数

```typescript
// ✅ 正确: try-catch-finally 完整处理
const handleSubmit = async () => {
  setLoading(true);
  try {
    const result = await submitForm(formData);
    message.success('提交成功');
    navigate('/list');
  } catch (error) {
    if (error instanceof AxiosError) {
      message.error(error.response?.data?.message || '提交失败');
    } else {
      message.error('未知错误');
    }
  } finally {
    setLoading(false);
  }
};

// ❌ 错误: 无错误处理
const handleSubmit = async () => {
  const result = await submitForm(formData);  // 可能抛异常!
  message.success('提交成功');
};
```

### Redux Thunk 错误处理

```typescript
// ✅ 正确: createAsyncThunk 内处理
const loginAction = createAsyncThunk('user/login', async (credentials, { rejectWithValue }) => {
  try {
    const result = await loginWithPhone(credentials);
    storage('localStorage').set('token', result.token);
    return result;
  } catch (error) {
    return rejectWithValue((error as AxiosError).response?.data);
  }
});

// 组件中使用
const handleLogin = async () => {
  try {
    await dispatch(loginAction(credentials)).unwrap();
    navigate('/home');
  } catch (error) {
    message.error('登录失败');
  }
};
```

---

## 导入规范

### 导入顺序

```typescript
// 1. React 核心
import React, { useState, useEffect, useCallback, useMemo } from 'react';

// 2. 第三方库
import { Button, Form, Input, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

// 3. Store
import { useAppDispatch, useAppSelector } from '@/store';
import { loginAction, userRoleSelector } from '@/store/modules/user';

// 4. API
import { getUserList } from '@/api';

// 5. 组件
import ErrorBoundary from '@/components/ErrorBoundary';

// 6. Hooks
import { usePermission } from '@/hooks/usePermission';

// 7. 工具函数/常量
import { ROLES } from '@/constants';
import { formatDate } from '@/utils';

// 8. 类型 (type-only import)
import type { UserInfo } from '@/api';
import type { RootState } from '@/store';

// 9. 样式
import styles from './index.module.scss';
```

### 路径别名

```typescript
// ✅ 正确: 使用 @ 别名
import { UserCard } from '@/components/UserCard';

// ❌ 错误: 使用相对路径 (跨目录时)
import { UserCard } from '../../../components/UserCard';

// ✅ 正确: 同级/子级用相对路径
import { SubComponent } from './components/SubComponent';
```

---

## Ant Design 集成模式

### 表单处理

```typescript
// ✅ 推荐: Ant Design Form + TypeScript
interface LoginFormValues {
  phone: string;
  password: string;
  remember: boolean;
}

const LoginForm: React.FC = () => {
  const [form] = Form.useForm<LoginFormValues>();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      await dispatch(loginAction(values)).unwrap();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item name="phone" rules={[{ required: true, message: '请输入手机号' }]}>
        <Input placeholder="手机号" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true }]}>
        <Input.Password placeholder="密码" />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>登录</Button>
    </Form>
  );
};
```

### 表格 + 分页

```typescript
// ✅ 推荐: Ant Design Table 分页模式
const UserList: React.FC = () => {
  const [data, setData] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchData = useCallback(async (page: number, size: number) => {
    setLoading(true);
    try {
      const result = await getUserList({ page, size });
      setData(result.list);
      setPagination(prev => ({ ...prev, total: result.total }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={pagination}
      onChange={(pag) => setPagination(prev => ({ ...prev, ...pag }))}
      rowKey="id"
    />
  );
};
```

---

## 快速参考清单

- [ ] Props 使用 TypeScript 接口定义
- [ ] 回调函数使用 `on` 前缀
- [ ] 布尔值使用 `is/has/show` 前缀
- [ ] 颜色使用 CSS 变量 / Ant Design Token
- [ ] 异步操作使用 try-catch-finally
- [ ] 导入按规范顺序排列
- [ ] 列表使用 `map` + 数据驱动
- [ ] CSS 使用 class 选择器 (禁止标签选择器)
- [ ] 自定义 Hook 以 `use` 开头
- [ ] 组件导出使用 `export default`

---

## 相关文档

- [component-development.md](component-development.md) - React 组件开发规范
- [store-development.md](store-development.md) - Redux 状态管理
- [coding-standards.md](coding-standards.md) - 编码规范
- [api-development.md](api-development.md) - API 开发
