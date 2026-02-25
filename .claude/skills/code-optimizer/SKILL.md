---
name: code-optimizer
description: 6 维度代码优化 (常量/函数/Hooks/组件/类型/Selector)，自动检测可提取的重复代码
---

# Code Optimizer - 代码优化器

## 功能概述
分析指定目录的代码，从 6 个维度识别优化机会并自动执行优化。

## 使用方式
```bash
/code-optimizer <path> [--full] [--dry-run]

# 示例
/code-optimizer src/views/UserManagement/ --full
/code-optimizer src/components/ --dry-run
```

## 参数说明
| 参数 | 说明 |
|------|------|
| `<path>` | 目标目录或文件 |
| `--full` | 6 维度全量优化 |
| `--dry-run` | 只报告不修改 |

## 6 维度优化

### 1. 常量提取
检测硬编码的魔法数字和重复字符串:

```typescript
// Before
if (list.length > 10) { ... }
if (status === 'active') { ... }

// After
const MAX_DISPLAY_COUNT = 10;
const STATUS = { ACTIVE: 'active' } as const;
```

### 2. 工具函数提取
检测重复的计算逻辑:

```typescript
// Before (多处重复)
const fullName = `${user.firstName} ${user.lastName}`;

// After
// utils/format.ts
export const getFullName = (user: { firstName: string; lastName: string }) =>
  `${user.firstName} ${user.lastName}`;
```

### 3. Custom Hooks 提取
检测组件中重复的状态 + 副作用模式:

```typescript
// Before (多个组件重复)
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
useEffect(() => { fetchData(); }, []);

// After
// hooks/useAsyncData.ts
export function useAsyncData<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  // ...
  return { data, loading, refresh };
}
```

### 4. 组件提取
检测 JSX 中的重复结构:

```typescript
// Before (多处重复的状态标签)
<span className={`status ${item.status}`}>{statusMap[item.status]}</span>

// After
// components/StatusTag.tsx
const StatusTag: React.FC<{ status: string }> = ({ status }) => (
  <span className={`status ${status}`}>{statusMap[status]}</span>
);
```

### 5. 类型提取
检测重复的类型定义:

```typescript
// Before (多处定义相似类型)
interface UserFormData { name: string; email: string; }
interface OrderFormData { name: string; email: string; address: string; }

// After
interface BaseFormData { name: string; email: string; }
interface OrderFormData extends BaseFormData { address: string; }
```

### 6. Selector 优化
检测未缓存的 Redux Selector:

```typescript
// Before
const items = useAppSelector(state => state.feature.list.filter(i => i.active));

// After
const activeItemsSelector = createSelector(featureListSelector, list => list.filter(i => i.active));
const items = useAppSelector(activeItemsSelector);
```

## 输出格式

```markdown
## 优化报告

### 发现的优化点
1. [常量] 发现 3 处魔法数字
2. [Hooks] 发现 2 处可提取的数据获取模式
3. [Selector] 发现 1 处未缓存的 selector

### 建议操作
- 创建 `src/constants/feature.ts`
- 创建 `src/hooks/useFeatureList.ts`
- 在 `src/store/modules/feature.ts` 中添加 selector

### 已执行 (非 dry-run)
- [x] 提取常量到 constants/
- [x] 创建 useFeatureList Hook
- [x] 添加缓存 Selector
```
