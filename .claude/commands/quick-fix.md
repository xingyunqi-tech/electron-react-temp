---
description: 快速问题修复索引 - 按错误类型分类的解决方案
---

# 快速问题修复

## 问题诊断表

| 症状 | 可能原因 | 快速修复 |
|------|---------|---------|
| TypeScript 类型错误 | 接口不匹配 | `pnpm type-check` 定位 |
| ESLint 报错 | 代码规范违反 | `pnpm lint:script --fix` |
| 样式不生效 | CSS Modules 未导入 | 检查 `import styles` |
| API 调用失败 | 接口变更 | `pnpm api:gen` 重新生成 |
| 路由 404 | 路由未注册 | 检查 `routes/*.tsx` |
| 路由 403 | 权限不足 | 检查 `handle.roles` |
| Store 状态不更新 | Selector 缓存 | 检查 `createSelector` 依赖 |
| Electron IPC 失败 | 通道不在白名单 | 检查 `preload/index.ts` |
| 构建失败 | 类型/语法错误 | `pnpm type-check` |
| 热更新失效 | 缓存问题 | 重启 dev server |

## TypeScript 常见错误

```typescript
// TS2322: Type 'X' is not assignable to 'Y'
// → 检查接口定义，使用类型断言或修正类型

// TS2339: Property does not exist
// → 检查接口是否包含该属性，使用可选链 ?.

// TS7006: Parameter implicitly has 'any' type
// → 添加参数类型注解
```

## React 常见错误

```typescript
// "Cannot update a component while rendering"
// → 不要在渲染期间调用 setState，移到 useEffect 中

// "Rendered more hooks than during the previous render"
// → Hook 调用在条件语句中，移到顶层

// "Each child should have a unique key"
// → 添加 key 属性到列表元素
```

## 工具命令

```bash
pnpm type-check        # TypeScript 检查
pnpm lint              # 全部 Lint
pnpm lint:script       # ESLint
pnpm lint:style        # Stylelint
pnpm test              # 运行测试
pnpm api:gen           # 重新生成 API
pnpm cspell            # 拼写检查
```
