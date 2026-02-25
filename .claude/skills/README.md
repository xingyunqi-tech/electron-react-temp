# Skills 总览

Skills 是命令式工具，用于快速完成重复性开发任务，效率提升 75%。

## 开发辅助类 (6 个)

| Skill | 功能 | 常用命令 |
|-------|------|----------|
| `/architecture-designer` | PRD -> 架构设计，生成开发计划 | `/architecture-designer docs/prd/user.md --create-todos` |
| `/component-generator` | React 组件生成 (基础/业务/页面) | `/component-generator UserList --type page --smart` |
| `/store-generator` | Redux Toolkit Slice + Saga 生成 | `/store-generator UserStore --smart` |
| `/page-assembler` | 页面拼装器 | `/page-assembler src/views/user/index.tsx` |
| `/api-generator` | 自定义 API 生成 (20% 场景) | `/api-generator uploadFile --type upload` |
| `/figma-to-component` | Figma 设计稿 -> React 组件 | `/figma-to-component <figma-url>` |

## 质量保障类 (3 个)

| Skill | 功能 | 常用命令 |
|-------|------|----------|
| `/code-optimizer` | 6 维度代码优化 | `/code-optimizer src/views/user/ --full` |
| `/test-coverage-checker` | 测试覆盖率检查 + 自动生成测试 | `/test-coverage-checker --auto-generate` |
| `/implementation-validator` | 代码实现一致性校验 | `/implementation-validator --all docs/prd/feature.md src/views/feature/` |

## 完整开发流程

```bash
/architecture-designer docs/prd/user.md --create-todos  # 1. 架构设计
pnpm api:gen                                             # 2. API 同步
/store-generator UserStore --smart                       # 3. 生成 Store
/component-generator UserManagement --type page --smart  # 4. 生成页面
/page-assembler src/views/user/index.tsx                 # 5. 页面拼装
/code-optimizer src/views/user/ --full                   # 6. 代码优化
/test-coverage-checker --auto-generate                   # 7. 质量检查
pnpm commit                                              # 8. 提交代码
```
