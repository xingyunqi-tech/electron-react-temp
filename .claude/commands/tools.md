---
description: 工具索引 - 快速查找所有可用的 Skills、Commands、Agents
---

# 工具索引

## Skills (代码生成)

| Skill | 功能 | 使用 |
|-------|------|------|
| `/architecture-designer` | PRD -> 架构设计 | `/architecture-designer docs/prd/xxx.md` |
| `/component-generator` | React 组件生成 | `/component-generator UserList --type page` |
| `/store-generator` | Redux Store 生成 | `/store-generator UserStore --smart` |
| `/page-assembler` | 页面拼装 | `/page-assembler src/views/xxx/index.tsx` |
| `/api-generator` | 自定义 API 生成 | `/api-generator uploadFile --type upload` |
| `/figma-to-component` | Figma -> 组件 | `/figma-to-component <figma-url>` |
| `/code-optimizer` | 代码优化 | `/code-optimizer src/views/xxx/ --full` |
| `/test-coverage-checker` | 测试覆盖率 | `/test-coverage-checker --auto-generate` |
| `/implementation-validator` | 实现校验 | `/implementation-validator --all` |

## Commands (快速清单)

| Command | 功能 |
|---------|------|
| `/review-pr` | PR 审查清单 |
| `/git-workflow` | Git 工作流规范 |
| `/quick-fix` | 快速问题修复 |
| `/refactor` | 重构最佳实践 |
| `/optimize` | 性能优化指南 |
| `/security-check` | 安全检查清单 |
| `/tools` | 本索引 |

## Agents (深度指导)

| Agent | 适用场景 |
|-------|---------|
| `common-patterns` | 通用开发模式 (Props、CSS、Hooks) |
| `api-development` | Orval API 架构 |
| `component-development` | React 组件开发 |
| `router-development` | 路由和权限 |
| `electron-development` | Electron 主进程/IPC |
| `store-development` | Redux Toolkit + Saga |
| `coding-standards` | 编码规范 |
| `code-review` | 代码审查 |
| `testing` | 测试策略 |
| `project-structure` | 项目结构 |
| `figma-extraction-guide` | Figma 设计还原 |
| `deployment` | 部署和 CI/CD |

## 选择决策

```
需要生成代码?   → Skills
需要查规范?     → Agents
需要看清单?     → Commands
```

## 常用脚本

```bash
pnpm start              # 开发服务器
pnpm build              # 构建
pnpm lint               # 代码检查
pnpm type-check         # 类型检查
pnpm test               # 测试
pnpm api:gen            # API 生成
pnpm commit             # 交互式提交
pnpm analyzer           # Bundle 分析
```
