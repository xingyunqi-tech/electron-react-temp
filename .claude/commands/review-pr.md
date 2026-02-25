---
description: PR 审查清单 - 代码质量、功能、安全、性能
---

# PR 审查清单

## 1. 代码质量
- [ ] TypeScript 类型完善，无 `any`
- [ ] 命名规范 (PascalCase 组件, camelCase 函数, UPPER_SNAKE_CASE 常量)
- [ ] 导入顺序正确 (React → 三方库 → Store → API → 组件 → Hooks → 类型 → 样式)
- [ ] 无冗余代码和注释
- [ ] 代码可读性好

## 2. 功能检查
- [ ] 实现符合需求
- [ ] 边界情况处理 (空值、空列表、错误状态)
- [ ] Loading 状态正确显示
- [ ] 错误处理完整 (try-catch-finally)

## 3. React 规范
- [ ] Hooks 在顶层调用
- [ ] useEffect 依赖数组完整
- [ ] useCallback/useMemo 合理使用
- [ ] key 属性正确
- [ ] 条件渲染在 Hooks 之后

## 4. Store 规范
- [ ] 使用 createSlice + createAsyncThunk
- [ ] Selector 使用 createSelector 缓存
- [ ] Thunk 有 rejectWithValue 处理
- [ ] Action 命名规范 (xxxAction)

## 5. API 规范
- [ ] 从 `@/api` 统一导入
- [ ] 未修改 `generated/` 目录
- [ ] 自定义 API 在 `custom/` 目录

## 6. 样式规范
- [ ] 颜色使用 CSS 变量 / Ant Design Token
- [ ] CSS Modules 或 UnoCSS (不混用)
- [ ] 无标签选择器

## 7. 安全检查
- [ ] 无硬编码凭据
- [ ] XSS 防护 (DOMPurify)
- [ ] Electron IPC 通道在白名单中
- [ ] 输入验证完整

## 8. AI 生成代码检查
- [ ] API 名称与实际导出匹配 (无幻觉)
- [ ] 导入路径存在
- [ ] 注释与代码逻辑一致

## 工具命令
```bash
pnpm lint          # 代码检查
pnpm type-check    # 类型检查
pnpm test          # 运行测试
```
