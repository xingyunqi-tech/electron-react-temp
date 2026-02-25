---
name: store-generator
description: Redux Toolkit Slice + Saga 生成器，自动集成 API，支持持久化配置
---

# Store Generator - Store 生成器

## 功能概述
生成符合项目规范的 Redux Toolkit Slice，包括 State、Reducers、AsyncThunks、Selectors，可选集成 Saga。

## 使用方式
```bash
/store-generator <StoreName> [--smart] [--persist] [--dynamic]

# 示例
/store-generator UserStore --smart
/store-generator DashboardStore --dynamic
/store-generator SettingStore --persist
```

## 参数说明
| 参数 | 说明 |
|------|------|
| `--smart` | 智能模式，自动从 `@/api` 匹配 API 并生成 Thunks |
| `--persist` | 添加持久化配置 |
| `--dynamic` | 生成为动态模块 (defineModule/destroyModule) |

## 生成模板

### 标准模块

```typescript
// src/store/modules/{name}.ts
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// ==================== 类型定义 ====================
interface {Name}State {
  list: {Item}[];
  loading: boolean;
  currentId: string | null;
}

const NAMESPACE = '{name}' as const;

// ==================== 初始状态 ====================
const initialState: {Name}State = {
  list: [],
  loading: false,
  currentId: null,
};

// ==================== 异步 Thunks ====================
export const fetch{Name}ListAction = createAsyncThunk(
  `${NAMESPACE}/fetchList`,
  async (params: { page: number; size: number }, { rejectWithValue }) => {
    try {
      return await get{Name}List(params);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// ==================== Slice ====================
const {name}Slice = createSlice({
  name: NAMESPACE,
  initialState,
  reducers: {
    setCurrent{Name}Action(state, action: PayloadAction<string | null>) {
      state.currentId = action.payload;
    },
    reset{Name}Action() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetch{Name}ListAction.pending, (state) => { state.loading = true; })
      .addCase(fetch{Name}ListAction.fulfilled, (state, action) => {
        state.list = action.payload.list;
        state.loading = false;
      })
      .addCase(fetch{Name}ListAction.rejected, (state) => { state.loading = false; });
  },
});

// ==================== Actions 导出 ====================
export const { setCurrent{Name}Action, reset{Name}Action } = {name}Slice.actions;

// ==================== Selectors ====================
const {name}RootSelector = (state: { [NAMESPACE]: {Name}State }) => state[NAMESPACE];
export const {name}ListSelector = createSelector({name}RootSelector, s => s.list);
export const {name}LoadingSelector = createSelector({name}RootSelector, s => s.loading);

// ==================== Reducer 导出 ====================
export default {name}Slice.reducer;
```

### 动态模块 (--dynamic)

额外生成:
```typescript
import type { ReduxModule } from '@/store/framework';

export const {name}Module: ReduxModule = {
  name: NAMESPACE,
  reducer: {name}Slice.reducer,
};

// 使用: createInjectStoreWrapper({name}Module)(PageComponent)
```

## 注册步骤

生成后需手动在 `src/store/index.ts` 中注册:

```typescript
// 静态模块: 添加到 initialReducers
initialReducers: { ..., {name}: {name}Reducer }

// 动态模块: 使用 createInjectStoreWrapper
```

## 规范约束
- 参考 [store-development agent] 的命名规范和模式
- Action: xxxAction, Selector: xxxSelector
- 必须使用 createSelector 缓存
