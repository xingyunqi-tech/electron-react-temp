---
description: 性能优化指南 - React/Electron/网络/构建优化
---

# 性能优化指南

## 性能度量工具

```bash
pnpm analyzer           # Bundle 分析
pnpm test:coverage      # 代码覆盖率
# Web Vitals (生产环境自动采集)
```

## React 组件优化

### 1. 避免不必要的重渲染

```typescript
// useMemo: 缓存计算结果
const filteredList = useMemo(() =>
  list.filter(item => item.status === 'active'),
  [list]
);

// useCallback: 缓存函数引用
const handleClick = useCallback((id: string) => {
  dispatch(selectItem(id));
}, [dispatch]);

// React.memo: 浅比较 Props
const UserCard = React.memo<UserCardProps>(({ user }) => {
  return <div>{user.name}</div>;
});
```

### 2. 代码分割

```typescript
// React.lazy + Suspense
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Skeleton />}>
  <HeavyComponent />
</Suspense>
```

### 3. 列表优化

```typescript
// 虚拟滚动 (大列表 > 100 项)
import { FixedSizeList } from 'react-window';

// 正确的 key (使用唯一 ID，非 index)
{list.map(item => <Item key={item.id} data={item} />)}
```

## Redux 优化

### Selector 缓存

```typescript
// ✅ createSelector 防止重复计算
const expensiveSelector = createSelector(
  [baseSelector],
  (data) => expensiveComputation(data),
);

// ❌ 避免内联 selector
useAppSelector(state => state.list.filter(...));
```

## 网络优化

- 请求去重: 内置于 `customMutator` (默认开启)
- 图片懒加载: 使用 `LazyImage` 组件
- API 缓存: 在 Store 中缓存已请求数据
- 分页: 大列表使用分页而非全量加载

## 构建优化

```bash
pnpm analyzer           # 查看 Bundle 大小
```

- **代码分割**: Vite 自动 chunk splitting
- **资源压缩**: Gzip 压缩 (vite-plugin-compression)
- **Tree Shaking**: 使用 ES Module 导出
- **图片优化**: 小于 4KB 自动内联为 base64

## Electron 优化

- 主进程: 避免阻塞 UI 的同步操作
- 预加载: Loading 动画减少白屏时间
- 窗口: 延迟显示直到内容就绪
- 内存: 监控渲染进程内存使用

## 性能目标

| 指标 | 目标 |
|------|------|
| FCP | < 1.5s |
| LCP | < 2.5s |
| CLS | < 0.1 |
| Bundle (gzip) | < 500KB |
