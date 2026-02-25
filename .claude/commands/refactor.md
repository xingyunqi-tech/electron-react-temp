---
description: 重构最佳实践 - 安全重构原则和步骤
---

# 重构最佳实践

## 安全重构原则

1. **小步前进**: 每次只改一件事
2. **测试覆盖**: 重构前确保有测试
3. **持续验证**: 每步改完都运行测试
4. **可逆操作**: 确保能回退

## 重构前检查

```bash
git status              # 确认工作区干净
pnpm test               # 确认测试通过
pnpm type-check         # 确认类型正确
```

## 常见重构模式

### 1. 提取 Custom Hook

```typescript
// Before: 组件内重复逻辑
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
useEffect(() => { fetchData(); }, []);

// After: 提取为 Hook
function useDataList(fetcher) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  // ...
  return { data, loading, refresh };
}
```

### 2. 组件拆分

```
// Before: 一个大组件 500+ 行
UserManagement.tsx (500 lines)

// After: 拆分为多个子组件
UserManagement/
├── index.tsx          # 页面容器 (50 lines)
├── components/
│   ├── UserTable.tsx  # 表格 (150 lines)
│   ├── UserForm.tsx   # 表单 (120 lines)
│   └── UserFilter.tsx # 筛选 (80 lines)
```

### 3. Redux Selector 优化

```typescript
// Before: 内联 selector (每次新引用)
const items = useAppSelector(state => state.feature.list.filter(i => i.active));

// After: createSelector 缓存
const activeItemsSelector = createSelector(
  featureListSelector,
  list => list.filter(i => i.active),
);
```

### 4. 消除重复代码

```typescript
// Before: 相似的 API 调用模式
const fetchUsers = async () => { setLoading(true); try { ... } finally { setLoading(false); } };
const fetchOrders = async () => { setLoading(true); try { ... } finally { setLoading(false); } };

// After: 通用 Hook
const { data: users, loading } = useAsyncData(getUserList, params);
```

## 重构后验证

```bash
pnpm type-check         # TypeScript 检查
pnpm lint               # Lint 检查
pnpm test               # 运行测试
```
