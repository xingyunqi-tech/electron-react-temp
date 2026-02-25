---
name: store-development
description: Redux Toolkit + Redux Saga 状态管理，自定义框架 (动态模块注册/插件系统)，Slice + Thunk + Selector 模式
tools: ["Read", "Grep", "Glob"]
model: sonnet
---

# Store Development - Redux 状态管理

## 职责
指导 Redux Toolkit + Redux Saga 状态管理的设计与实现，包括自定义框架、动态模块注册、Slice 开发模式和最佳实践。

---

## 核心架构

### 技术栈
- **Redux Toolkit**: Slice + createAsyncThunk
- **Redux Saga**: 复杂异步流程 (轮询、WebSocket)
- **自定义框架**: 动态模块注册、插件系统
- **Redux Persist**: 持久化 (localforage/IndexedDB)

### 目录结构

```
src/store/
├── index.ts                # Store 配置入口
├── framework/              # 自定义框架
│   ├── factory.ts          # createReduxFramework()
│   ├── reducers.ts         # 动态 reducer 管理
│   ├── module.ts           # defineModule / destroyModule
│   ├── types/              # 类型定义
│   ├── plugins/            # 插件
│   │   ├── persist.tsx     # 持久化插件
│   │   └── loop.ts         # 循环任务插件
│   ├── hooks.ts            # useReduxDispatch / useReduxSelector
│   ├── components/         # ReduxProvider 等组件
│   └── modules/            # 预定义模块 (key-value 等)
└── modules/                # 业务模块
    ├── global.ts           # 全局状态 (主题、语言)
    ├── user.ts             # 用户状态 (登录、信息)
    └── permission.ts       # 权限状态 (路由过滤)
```

---

## Store 模块开发模板

### 标准模块 (Slice + Thunk + Selectors)

```typescript
// src/store/modules/feature.ts
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getFeatureList, createFeature } from '@/api';
import type { FeatureItem } from '@/api';

// ==================== 类型定义 ====================
interface FeatureState {
  list: FeatureItem[];
  loading: boolean;
  currentId: string | null;
}

const NAMESPACE = 'feature' as const;

// ==================== 初始状态 ====================
const initialState: FeatureState = {
  list: [],
  loading: false,
  currentId: null,
};

// ==================== 异步 Thunks ====================
export const fetchFeatureListAction = createAsyncThunk(
  `${NAMESPACE}/fetchList`,
  async (params: { page: number; size: number }, { rejectWithValue }) => {
    try {
      return await getFeatureList(params);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createFeatureAction = createAsyncThunk(
  `${NAMESPACE}/create`,
  async (data: Partial<FeatureItem>, { rejectWithValue }) => {
    try {
      return await createFeature(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// ==================== Slice ====================
const featureSlice = createSlice({
  name: NAMESPACE,
  initialState,
  reducers: {
    setCurrentIdAction(state, action: PayloadAction<string | null>) {
      state.currentId = action.payload;
    },
    resetFeatureAction() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeatureListAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeatureListAction.fulfilled, (state, action) => {
        state.list = action.payload.list;
        state.loading = false;
      })
      .addCase(fetchFeatureListAction.rejected, (state) => {
        state.loading = false;
      });
  },
});

// ==================== Actions 导出 ====================
export const { setCurrentIdAction, resetFeatureAction } = featureSlice.actions;

// ==================== Selectors ====================
const featureRootSelector = (state: { [NAMESPACE]: FeatureState }) => state[NAMESPACE];

export const featureListSelector = createSelector(
  featureRootSelector,
  (state) => state.list,
);

export const featureLoadingSelector = createSelector(
  featureRootSelector,
  (state) => state.loading,
);

export const currentFeatureSelector = createSelector(
  [featureRootSelector],
  (state) => state.list.find(item => item.id === state.currentId) || null,
);

// ==================== Reducer 导出 ====================
export default featureSlice.reducer;
```

### 动态模块 (按需加载)

```typescript
// src/store/modules/dashboard.ts
import { createSlice } from '@reduxjs/toolkit';
import type { ReduxModule } from '@/store/framework';

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: { widgets: [], layout: null },
  reducers: { ... },
});

// 导出为 ReduxModule
export const dashboardModule: ReduxModule = {
  name: 'dashboard',
  reducer: dashboardSlice.reducer,
  // saga: dashboardSaga,  // 可选
};

export default dashboardSlice.reducer;

// ---- 在组件中动态注入 ----
import { createInjectStoreWrapper } from '@/store';
import { dashboardModule } from '@/store/modules/dashboard';
import DashboardPage from './DashboardPage';

// HOC 方式: 进入页面时注册，离开时销毁
export default createInjectStoreWrapper(dashboardModule)(DashboardPage);

// 或手动方式:
import { defineModule, destroyModule } from '@/store';
useEffect(() => {
  defineModule(dashboardModule);
  return () => destroyModule('dashboard');
}, []);
```

---

## 命名规范

### Action 命名

```typescript
// 同步 Action: 动词 + 名词 + Action
setLocaleAction          // 设置
toggleThemeAction        // 切换
resetPermissionAction    // 重置

// 异步 Thunk: 动词 + 名词 + Action
loginAction              // 登录
getInfoAction            // 获取信息
fetchFeatureListAction   // 获取列表
createFeatureAction      // 创建
```

### Selector 命名

```typescript
// 根选择器: 模块名 + RootSelector
const userRootSelector = (state) => state.user;

// 派生选择器: 属性名 + Selector
export const currentLocaleSelector = createSelector(...);
export const userRoleSelector = createSelector(...);
export const permissionRoutesSelector = createSelector(...);
```

### 状态属性命名

```typescript
// 布尔值: is/has 前缀
isRoutesGenerated: boolean;
isLoading: boolean;
hasError: boolean;

// 列表: 复数名词
routes: RouteConfig[];
users: UserInfo[];

// 当前选中: current 前缀
currentId: string | null;
currentLocale: LocaleType;
```

---

## 插件系统

### 持久化插件

```typescript
// src/store/index.ts 中配置
import { createPersistPlugin } from './framework/plugins/persist';

const store = createReduxFramework({
  initialReducers: { global: globalReducer, user: userReducer, permission: permissionReducer },
  plugins: [
    createPersistPlugin({
      key: 'electron-react-temp',
      storage: localforage,    // IndexedDB
      whitelist: ['global'],   // 只持久化 global 模块
    }),
    loopPlugin,
  ],
  devTools: import.meta.env.DEV,
});
```

### 循环任务插件

```typescript
import { startLoopAction, stopLoopAction } from '@/store/framework/plugins/loop';

// 启动轮询
dispatch(startLoopAction({
  key: 'refreshToken',
  interval: 5 * 60 * 1000,  // 5 分钟
  immediate: true,            // 立即执行一次
  task: async () => {
    await refreshToken();
  },
}));

// 停止轮询
dispatch(stopLoopAction('refreshToken'));
```

---

## Hooks 使用

### 基础 Hooks

```typescript
import { useAppDispatch, useAppSelector } from '@/store';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const role = useAppSelector(userRoleSelector);
  const locale = useAppSelector(currentLocaleSelector);

  const handleLogin = async () => {
    try {
      await dispatch(loginAction(credentials)).unwrap();
    } catch (error) {
      message.error('登录失败');
    }
  };
};
```

### 注意事项

```typescript
// ✅ 正确: 使用 createSelector 缓存
const filteredList = useAppSelector(
  createSelector(featureListSelector, list => list.filter(i => i.active))
);

// ❌ 错误: 每次渲染创建新引用
const filteredList = useAppSelector(state => state.feature.list.filter(i => i.active));
// 这会导致每次都返回新数组，触发不必要的重渲染
```

---

## 快速检查清单

- [ ] 使用 `createSlice` 定义 Slice
- [ ] 异步操作使用 `createAsyncThunk`
- [ ] Thunk 内部有 `rejectWithValue` 错误处理
- [ ] Selector 使用 `createSelector` 缓存
- [ ] Action 命名符合规范 (xxxAction)
- [ ] 状态接口有 TypeScript 定义
- [ ] 初始状态完整定义
- [ ] 动态模块有正确的注册/销毁生命周期

---

## 相关文档

- [common-patterns.md](common-patterns.md) - 通用模式
- [api-development.md](api-development.md) - API 集成
- [coding-standards.md](coding-standards.md) - 编码规范
