---
name: implementation-validator
description: 代码实现一致性校验，验证 API/PRD/类型/错误处理的完整性
---

# Implementation Validator - 实现校验器

## 功能概述
系统性验证代码实现与 API 规范、PRD 需求的一致性，检查类型安全、参数完整性和错误处理。

## 使用方式
```bash
/implementation-validator [--all] [<prd-path>] [<code-path>]

# 示例
/implementation-validator --all
/implementation-validator docs/prd/user.md src/views/UserManagement/
/implementation-validator src/store/modules/user.ts
```

## 参数说明
| 参数 | 说明 |
|------|------|
| `--all` | 完整校验 (所有维度) |
| `<prd-path>` | PRD 文档路径 (可选) |
| `<code-path>` | 代码路径 |

## 5 阶段校验

### Phase 1: API 一致性
验证代码中使用的 API 函数是否与 `@/api` 的导出匹配:

- [ ] API 函数名在 `src/api/index.ts` 中导出
- [ ] 参数类型与 generated model 匹配
- [ ] 返回类型正确处理

### Phase 2: 类型安全
- [ ] 无 `any` 类型
- [ ] Props 接口完整
- [ ] API 响应类型正确
- [ ] State 类型定义完整

### Phase 3: 参数完整性
- [ ] API 调用传递了所有必需参数
- [ ] 路由配置包含 title 和 roles
- [ ] Store 初始状态完整

### Phase 4: 错误处理
- [ ] 异步操作有 try-catch
- [ ] Thunk 有 rejectWithValue
- [ ] Loading 状态正确管理
- [ ] 用户提示信息完整

### Phase 5: Store 架构
- [ ] Selector 使用 createSelector
- [ ] Action 命名规范
- [ ] 模块在 Store 中注册
- [ ] 无循环依赖

## 输出格式

```markdown
## 校验报告

### 通过项 (12/15)
- [x] API 导入路径正确
- [x] TypeScript 类型完整
- [x] 错误处理完整

### 失败项 (3/15)
1. **[API]** `getFeatureDetail` 未在 @/api 中导出
   - 修复: 运行 `pnpm api:gen` 或在 custom/ 中定义
2. **[类型]** `FeatureFormValues` 缺少 `status` 字段
   - 修复: 添加 `status: string` 到接口
3. **[Store]** `featureListSelector` 未使用 createSelector
   - 修复: 包装为 createSelector

### PRD 一致性 (有 PRD 时)
- [x] 用户列表页面 ✓
- [ ] 用户详情页面 ✗ (未实现)
- [x] 权限控制 ✓
```

## 规范约束
- 参考所有 Agent 文档的规范要求
- 重点检查 [api-development] 和 [store-development] 规范
