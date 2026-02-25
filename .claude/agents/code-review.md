---
name: code-review
description: 代码审查清单，覆盖功能、类型安全、性能、安全、AI 生成代码检查
tools: ["Read", "Grep", "Glob"]
model: sonnet
---

# Code Review - 代码审查指南

## 职责
提供全面的代码审查清单，覆盖功能正确性、类型安全、性能优化、安全检查和 AI 生成代码的特殊检查点。

---

## 审查原则

1. **正确性优先**: 功能是否按预期工作
2. **类型安全**: TypeScript 类型是否完善
3. **性能意识**: 避免不必要的重渲染和内存泄漏
4. **安全合规**: 无 XSS、注入等安全漏洞

---

## AI 生成代码审查要点

| 检查项 | 说明 |
|--------|------|
| **幻觉检测** | API 名称、参数是否与 `@/api` 中的实际导出匹配 |
| **硬编码凭据** | 检查是否有 token、密码等硬编码 |
| **边界情况** | 空值、空数组、undefined 是否处理 |
| **注释准确性** | 注释是否与代码逻辑一致 |
| **导入路径** | 是否使用了不存在的路径或模块 |
| **依赖完整性** | useEffect 依赖数组是否完整 |

---

## 代码审查检查清单

### TypeScript

- [ ] 无 `any` 类型 (使用 `unknown` + 类型守卫)
- [ ] Props 接口完整定义
- [ ] 函数返回类型明确
- [ ] 类型导入使用 `import type`
- [ ] 泛型参数有约束

### React 组件

- [ ] 函数组件 + Hooks (非 Class)
- [ ] Hooks 在顶层调用
- [ ] useEffect 依赖数组完整
- [ ] useCallback/useMemo 合理使用
- [ ] key 属性正确 (列表渲染)
- [ ] 条件渲染在 Hooks 之后
- [ ] 事件处理函数不在 JSX 中内联定义 (频繁渲染时)

### API 调用

- [ ] 从 `@/api` 统一导入
- [ ] 未修改 `generated/` 目录
- [ ] 错误处理完整 (try-catch)
- [ ] Loading 状态正确管理
- [ ] 组件卸载时取消请求 (长请求)

### Redux Store

- [ ] 使用 `createSlice` 定义
- [ ] Thunk 有 `rejectWithValue` 处理
- [ ] Selector 使用 `createSelector` 缓存
- [ ] Action 命名符合规范
- [ ] 初始状态完整

### 样式

- [ ] 颜色使用 CSS 变量 / Ant Design Token
- [ ] 无硬编码颜色值
- [ ] CSS Modules 或 UnoCSS (不混用)
- [ ] 无标签选择器 (h1, div, p)
- [ ] 嵌套深度不超过 3 层

### Electron (如适用)

- [ ] IPC 通道在白名单中
- [ ] 主进程验证输入
- [ ] 无 nodeIntegration: true
- [ ] Web/Electron 兼容处理

---

## 性能优化检查

### 组件性能

```typescript
// ❌ 问题: 每次渲染创建新对象/函数
<ChildComponent style={{ color: 'red' }} onClick={() => handleClick(id)} />

// ✅ 优化: 使用 useMemo/useCallback
const style = useMemo(() => ({ color: 'red' }), []);
const handleItemClick = useCallback(() => handleClick(id), [id]);
<ChildComponent style={style} onClick={handleItemClick} />
```

### Selector 性能

```typescript
// ❌ 问题: 每次返回新引用
const items = useAppSelector(state => state.feature.list.filter(i => i.active));

// ✅ 优化: createSelector 缓存
const activeItemsSelector = createSelector(
  featureListSelector,
  list => list.filter(i => i.active),
);
const items = useAppSelector(activeItemsSelector);
```

### 网络优化

- [ ] 避免重复请求 (请求去重已内置)
- [ ] 大列表使用虚拟滚动
- [ ] 图片使用懒加载 (LazyImage)
- [ ] 路由使用 React.lazy 代码分割

---

## 安全检查

### XSS 防护

```typescript
// ❌ 危险: dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ 安全: 使用 DOMPurify
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

### 其他安全项

- [ ] 无敏感信息硬编码 (token, key, password)
- [ ] URL 参数经过验证
- [ ] 文件上传有类型和大小检查
- [ ] 权限检查在前后端都有

---

## 审查报告模板

```markdown
## 代码审查结果

### 总体评价
- [ ] 通过 / [x] 需修改

### 发现的问题
1. **[严重]** 描述...
2. **[建议]** 描述...

### 优点
- 描述做得好的地方...

### 建议
- 可以改进的地方...
```

---

## 相关文档

- [coding-standards.md](coding-standards.md) - 编码规范
- [common-patterns.md](common-patterns.md) - 通用模式
- [testing.md](testing.md) - 测试策略
