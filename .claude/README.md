# Claude Code 配置指南

> 本项目的 Claude Code 完整配置，包括 Agents、Skills、Commands 和 Hooks

---

## 四层工具体系

| 层级 | 职责 | 触发方式 | 复杂度 |
|------|------|----------|--------|
| **Commands** | 快速提示/清单 | `/command-name` 手动调用 | 简单 |
| **Skills** | 代码生成/自动化 | Claude 自动发现，根据任务匹配 | 复杂 |
| **Agents** | 深度指导/规范 | Task 工具 `subagent_type` 参数 | 深入 |
| **Hooks** | 自动化规则 | 事件驱动，自动执行 | 确定性 |

**使用原则:**
- **日常开发**: 优先使用 Skills（快速自动化）
- **查看清单**: 使用 Commands（快速提醒）
- **学习规范**: 使用 Agents（深度指导）
- **强制规则**: Hooks 自动执行

---

## Skills - 代码生成和自动化

### 开发辅助类

| Skill | 功能 | 常用命令 |
|-------|------|----------|
| `/architecture-designer` | PRD -> 架构设计 | `/architecture-designer docs/prd/user.md --create-todos` |
| `/component-generator` | React 组件生成 (基础/业务/页面) | `/component-generator UserList --type page --smart` |
| `/store-generator` | Redux Toolkit Slice + Saga 生成 | `/store-generator UserStore --smart` |
| `/page-assembler` | 页面拼装器 | `/page-assembler src/views/user/index.tsx` |
| `/api-generator` | 自定义 API 生成 (20% 场景) | `/api-generator uploadFile --type upload` |
| `/figma-to-component` | Figma -> React 组件 | `/figma-to-component <figma-url>` |

### 质量保障类

| Skill | 功能 | 常用命令 |
|-------|------|----------|
| `/test-coverage-checker` | 测试覆盖率检查 + 自动生成 | `/test-coverage-checker --auto-generate` |
| `/implementation-validator` | 实现一致性校验 | `/implementation-validator --all` |
| `/code-optimizer` | 6 维度代码优化 | `/code-optimizer src/views/user/ --full` |

### 智能化工作流

```bash
/architecture-designer docs/prd/user.md --create-todos  # 1. 架构设计
pnpm api:gen                                             # 2. API 同步
/store-generator UserStore --smart                       # 3. 生成 Store
/component-generator UserManagement --type page --smart  # 4. 生成页面
/page-assembler src/views/user/index.tsx                 # 5. 页面拼装
/code-optimizer src/views/user/ --full                   # 6. 代码优化
/test-coverage-checker --auto-generate                   # 7. 质量检查
```

---

## Commands - 快速提示和清单

| Command | 功能 | 使用场景 |
|---------|------|----------|
| `/review-pr` | PR 审查清单 | 代码审查前 |
| `/git-workflow` | Git 工作流规范 | 提交前查看 |
| `/quick-fix` | 快速问题修复索引 | 遇到问题时 |
| `/refactor` | 重构最佳实践 | 重构代码前 |
| `/optimize` | 性能优化指南 | 优化性能前 |
| `/security-check` | 安全检查清单 (OWASP) | 安全审查时 |
| `/tools` | 工具索引 | 查找工具时 |

---

## Agents - 深度指导

### 核心 Agents

| Agent | 文件 | 职责 |
|-------|------|------|
| `common-patterns` | `common-patterns.md` | 通用模式 SSoT (Props/CSS/Hooks/错误处理) |
| `api-development` | `api-development.md` | Orval API 架构、多实例、请求去重 |
| `component-development` | `component-development.md` | React 组件规范、Ant Design 集成 |
| `router-development` | `router-development.md` | 三层路由、AuthGuard、权限控制 |
| `electron-development` | `electron-development.md` | 三进程架构、IPC 白名单、安全策略 |
| `store-development` | `store-development.md` | Redux Toolkit + Saga、动态模块 |

### 专业 Agents

| Agent | 文件 | 职责 |
|-------|------|------|
| `coding-standards` | `coding-standards.md` | TypeScript/React 编码规范 |
| `code-review` | `code-review.md` | 代码审查清单、AI 代码检查 |
| `testing` | `testing.md` | Vitest + Playwright 测试策略 |
| `project-structure` | `project-structure.md` | 目录组织规范 |
| `figma-extraction-guide` | `figma-extraction-guide.md` | Figma MCP 设计还原 |
| `deployment` | `deployment.md` | Docker/CI-CD/Electron 打包 |

### Agent 依赖关系

```
common-patterns (SSoT)
├── component-development (引用 Props/CSS/Hooks)
│   └── figma-extraction-guide
├── coding-standards (引用 Props/CSS)
│   └── api-development
├── router-development
├── store-development
├── electron-development
└── testing
```

---

## Hooks - 自动化规则

| Hook | 触发时机 | 作用 |
|------|----------|------|
| `SessionStart` | 会话开始 | 显示分支、未提交数、规范提醒 |
| `PreToolUse(Write\|Edit)` | 写/编辑文件前 | **拦截对 `src/api/generated/` 的修改** |
| `UserPromptSubmit` | 提交提示时 | 显示 Git 状态 |
| `PostToolUse(Write)` | 写文件后 | 确认文件路径 |
| `PostToolUse(Edit)` | 编辑文件后 | 确认文件路径 |
| `SessionEnd` | 会话结束 | 显示 Git 状态提醒 |

### 安全原则
- PreToolUse 拦截器强制禁止修改 `src/api/generated/` 目录
- 使用 `|| true` 避免阻塞（仅限非拦截类 Hook）
- 只运行只读命令（拦截类 Hook 除外）
- 设置 `timeout` 防止卡死

---

## MCP 服务器配置

**共享配置** (`settings.json`，默认启用):

| 服务器 | 功能 |
|--------|------|
| `figma` | Figma 设计稿读取 |
| `context7` | 第三方库文档查询 |
| `eslint` | 代码质量检查 |
| `chrome-devtools` | 浏览器调试 |
| `sentry` | 错误监控 |

**可选配置** (`.mcp.json` 中已定义，可通过 `settings.local.json` 启用):

| 服务器 | 功能 |
|--------|------|
| `github` | GitHub 仓库操作 |
| `sequential-thinking` | 复杂推理辅助 |
| `playwright` | E2E 自动化测试 |
| `memory` | 跨会话记忆 |

> 在 `settings.local.json` 中设置 `"enableAllProjectMcpServers": true` 可一键启用全部服务器。

---

## Permissions 权限配置

| 分类 | 允许 (allow) |
|------|------|
| **开发** | `pnpm start:*`, `pnpm build:*` |
| **代码生成** | `pnpm api:gen:*` |
| **质量** | `pnpm lint:*`, `pnpm type-check:*` |
| **测试** | `pnpm test:*`, `pnpm test:e2e:*` |
| **Git** | `git status`, `git diff`, `git log`, `git push` 等 |

| 分类 | 拒绝 (deny) |
|------|------|
| **破坏性 Git** | `git push --force`, `git reset --hard`, `git checkout -- .`, `git clean -f` |
| **文件删除** | `rm -rf` |

---

## 自定义扩展

### 新增 Command

在 `commands/` 目录创建 `.md` 文件:

```markdown
---
description: 命令描述
---

# 命令标题
命令内容...
```

### 新增 Skill

在 `skills/` 目录创建子目录和 `SKILL.md`:

```markdown
---
name: skill-name
description: Skill 描述
---

# Skill 标题
## 功能概述 / 使用方式 / 执行流程
```

### 新增 Agent

在 `agents/` 目录创建 `.md` 文件:

```markdown
---
name: agent-name
description: Agent 描述
tools: ["Read", "Grep", "Glob"]
model: sonnet
---

# Agent 标题
## 职责 / 规范详情
```

### 新增 Hook

在 `settings.json` 的 `hooks` 字段中添加配置。
