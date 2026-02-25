---
name: api-development
description: Orval API 自动生成架构、四层目录结构、自定义扩展、HTTP 多实例管理
tools: ["Read", "Grep", "Glob"]
model: sonnet
---

# API Development - API 开发指南

## 职责
指导 Orval API 自动生成架构的使用，包括四层目录结构、自定义扩展、HTTP 多实例管理和请求去重机制。

---

## 重要警告

**绝对禁止修改 `src/api/generated/` 目录下的任何文件！**

这些文件由 Orval 根据 OpenAPI 规范自动生成，每次执行 `pnpm api:gen` 会完全覆盖。

---

## 核心架构

### 四层目录结构

```
src/api/
├── core/                  # 第 1 层: HTTP 基础设施 (手动维护)
│   └── mutator.ts         # 自定义 Axios mutator
├── generated/             # 第 2 层: 自动生成 (禁止修改!)
│   ├── auth/auth.ts       # 认证相关 API
│   ├── model/             # 类型定义 (每个类型一个文件)
│   └── [module]/          # 按模块组织的 API
├── custom/                # 第 3 层: 自定义扩展 (手动编写)
│   ├── external.ts        # 调用外部 API
│   └── override.ts        # 覆盖/扩展生成的 API
└── index.ts               # 第 4 层: 统一导出 (custom 优先)
```

### 工作流程

```
后端更新 API → 更新 openapi.json → pnpm api:gen → 自动生成代码 → pnpm format
```

---

## 三种使用场景

### 场景 1: 直接使用生成的 API (80%)

```typescript
// ✅ 从 @/api 统一导入
import { loginWithPhone, getCurrentUser, getUserList } from '@/api';

// 在组件中使用
const handleLogin = async () => {
  const result = await loginWithPhone({ phone, password });
  console.log(result.token);
};

// 在 Redux Thunk 中使用
const loginAction = createAsyncThunk('user/login', async (credentials) => {
  const result = await loginWithPhone(credentials);
  return result;
});
```

### 场景 2: 覆盖自动生成的 API (15%)

```typescript
// src/api/custom/override.ts
import { customMutator } from '../core/mutator';
import type { LoginResponse } from '../generated/model';

// 覆盖生成的登录 API，添加额外逻辑
export const loginWithPhone = async (params: { phone: string; password: string }): Promise<LoginResponse> => {
  // 加密密码
  const encryptedPassword = encrypt(params.password);
  return customMutator<LoginResponse>({
    url: '/auth/login',
    method: 'POST',
    data: { ...params, password: encryptedPassword },
  });
};
```

### 场景 3: 完全自定义 API (5%)

```typescript
// src/api/custom/external.ts
import { customMutator } from '../core/mutator';

// 调用外部第三方 API
export const getWeatherData = async (city: string) => {
  return customMutator({
    url: `https://api.weather.com/v1/${city}`,
    method: 'GET',
    instance: 'external',  // 使用外部 HTTP 实例
  });
};

// 文件上传
export const uploadFile = async (file: File, onProgress?: (percent: number) => void) => {
  const formData = new FormData();
  formData.append('file', file);
  return customMutator({
    url: '/upload',
    method: 'POST',
    data: formData,
    instance: 'upload',
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress?.(Math.round((e.loaded / (e.total || 1)) * 100)),
  });
};
```

---

## HTTP 多实例管理

### 可用实例

```typescript
// src/api/core/mutator.ts 中定义的实例
const instances = {
  default: createInstance(),   // 默认实例 (带 token、错误处理)
  upload: createInstance(),    // 上传实例 (更长超时)
  download: createInstance(),  // 下载实例 (返回原始 response)
  external: createInstance(),  // 外部 API (无 token)
};
```

### 使用方式

```typescript
// 指定使用哪个实例
const result = await customMutator({
  url: '/api/data',
  method: 'GET',
  instance: 'default',       // 默认可省略
});

// 下载文件 (返回原始 response 包含 headers)
const response = await customMutator({
  url: '/api/export',
  method: 'GET',
  instance: 'download',
  responseType: 'blob',
});
```

---

## 请求去重机制

### 自动去重 (默认行为)

```typescript
// POST/PUT/PATCH/DELETE 请求默认启用去重
// 同一个 URL + Method 的请求，如果前一个未完成，后一个会复用结果

// 禁用去重 (某些场景需要)
const result = await customMutator({
  url: '/api/submit',
  method: 'POST',
  data: formData,
  disableDedup: true,  // 禁用去重
});
```

### 手动清除待处理请求

```typescript
import { clearPendingRequests } from '@/api/core/mutator';

// 路由切换时清除所有待处理请求
useEffect(() => {
  return () => clearPendingRequests();
}, []);
```

---

## 类型定义

### 自动生成的类型

```typescript
// 所有 model 类型从 @/api 导入
import type { UserInfo, LoginResponse, ApiResponse, PaginatedResult } from '@/api';

// 使用场景
const [user, setUser] = useState<UserInfo | null>(null);
const [list, setList] = useState<PaginatedResult<UserInfo>>({ list: [], total: 0 });
```

### 响应类型转换

```typescript
// Orval 生成: PostAuthLogin200 = ApiResponse<LoginResponse>
// customMutator 自动提取: LoginResponse (剥离外层 ApiResponse 包装)
// 所以调用方直接得到业务数据，无需 .data 二次解构
```

---

## 统一导出策略

```typescript
// src/api/index.ts 导出策略:
// 1. 先导出 model 类型 (接口定义)
export * from './generated/model';

// 2. 导出 API 函数 (不导出 *Result 类型别名)
export { loginWithPhone, getCurrentUser } from './generated/auth/auth';

// 3. 导出 custom 扩展 (会覆盖同名的 generated 导出)
export * from './custom/external';
export * from './custom/override';
```

**关键**: custom 目录的导出优先于 generated，实现无缝覆盖。

---

## Redux Store 集成模式

```typescript
// ✅ 推荐: Store 中使用 API
// src/store/modules/user.ts
import { loginWithPhone, getCurrentUser } from '@/api';

const loginAction = createAsyncThunk('user/login', async (credentials, { rejectWithValue }) => {
  try {
    const result = await loginWithPhone(credentials);
    storage('localStorage').set('token', result.token);
    return result;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const getInfoAction = createAsyncThunk('user/getInfo', async () => {
  const result = await getCurrentUser();
  return result;
});
```

---

## AI 开发快速检查清单

- [ ] API 从 `@/api` 统一导入
- [ ] 未修改 `generated/` 目录下的文件
- [ ] 自定义 API 放在 `custom/` 目录
- [ ] 新增 custom API 已在 `index.ts` 中导出
- [ ] 使用了正确的 HTTP 实例
- [ ] 错误处理完整 (try-catch)
- [ ] 类型定义正确 (使用 generated model)

---

## 开发决策树

```
需要调用 API?
├── 生成的 API 已有? → 直接使用 (从 @/api 导入)
├── 需要修改逻辑? → 在 custom/override.ts 覆盖
├── 全新 API (外部/特殊)? → 在 custom/external.ts 新增
└── 后端新增接口? → 更新 openapi.json → pnpm api:gen
```

---

## 常见问题 FAQ

**Q: 生成的类型找不到?**
A: 运行 `pnpm api:gen` 重新生成，确保 `orval.config.ts` 中的 OpenAPI 地址正确。

**Q: 需要添加请求头?**
A: 在 `mutator.ts` 的拦截器中统一添加，不要在每个调用处单独添加。

**Q: API 返回格式变了?**
A: 检查 `mutator.ts` 中的 `ExtractResult<T>` 类型转换逻辑。

---

## 相关文档

- [common-patterns.md](common-patterns.md) - 通用开发模式
- [store-development.md](store-development.md) - Redux Store 集成
- [coding-standards.md](coding-standards.md) - 编码规范
