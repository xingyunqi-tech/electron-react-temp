# CLAUDE.md - AI 开发助手快速指南

## Git 提交规则
- **提交格式**: `type: subject` 或 `type(scope): subject`
- **示例**: `feat: 添加用户登录功能` 或 `fix(auth): 修复登录验证问题`
- **AI 标识**: 提交代码时不要添加 Co-Authored-By 签名，改为在 commit 末尾添加：🤖 Generated with AI

> 完整的 Skills、Commands、Hooks 配置请查看 [.claude/README.md](.claude/README.md)
> 人类开发者请查看 [README.md](README.md)

---

## 核心技术栈

- **框架**: React 18 + Electron 40 | **语言**: TypeScript 5.9 (严格模式)
- **构建**: Vite 7 + vite-plugin-electron | **UI**: Ant Design 6 + UnoCSS
- **状态**: Redux Toolkit + Redux Saga (动态模块注册)
- **路由**: React Router 7 (动态权限路由)
- **HTTP**: Axios + Orval (API 自动生成) | **测试**: Vitest 4 + Playwright 1.57

**项目定位**: 企业级 Electron + React 桌面应用模板，同时支持 Web 部署。

---

## 核心架构决策

### 1. Orval API 自动生成 → [详细文档](.claude/agents/api-development.md)

```
src/api/
├── core/         # HTTP 客户端、拦截器 (手动维护)
├── generated/    # Orval 自动生成 (禁止修改!)
├── custom/       # 自定义扩展 (手动编写)
└── index.ts      # 统一导出 (custom 优先)
```

**规则**: 绝对禁止修改 `generated/` | 从 `@/api` 统一导入 | 扩展写在 `custom/`

### 2. 三层路由体系 → [详细文档](.claude/agents/router-development.md)

```
src/router/routes/
├── base.tsx     # 基础路由 (登录) - 无需登录
├── common.tsx   # 公共路由 (首页) - 登录即可访问
└── async.tsx    # 异步路由 (管理页面) - 需要角色权限
```

**守卫流程**: Token 检查 → 初始化权限路由 → 获取用户信息 → 角色过滤 → 放行/403

### 3. Redux 自定义框架 → [详细文档](.claude/agents/store-development.md)

- 动态模块: `defineModule(module)` / `destroyModule(name)`
- 插件系统: `createPersistPlugin` / `loopPlugin`
- 模式: Slice + AsyncThunk + createSelector 统一导出

### 4. Electron 三进程架构 → [详细文档](.claude/agents/electron-development.md)

- Main (`electron/main/`) + Preload (`electron/preload/`) + Renderer (`src/`)
- 安全: contextBridge 暴露 API、IPC 通道白名单、禁止关闭 contextIsolation

### 5. CSS 主题系统

所有颜色必须使用 CSS 变量 (`var(--ant-color-xxx)`) 或 Ant Design Token，**禁止硬编码颜色值**。
主题配置: `src/plugins/theme.ts` | CSS 变量: `public/theme.css`

---

## 禁止事项

| 禁止操作 | 后果 |
|---------|------|
| 修改 `src/api/generated/` | 修改会被 Orval 覆盖丢失 |
| 直接从 `generated/` 导入 | 自定义扩展不生效 |
| 硬编码颜色值 | 主题切换失效 |
| 渲染进程使用 Node API | 安全漏洞 |
| 关闭 contextIsolation | 严重安全隐患 |
| Views 间互相导入 | 架构耦合 |
| 重复配置全局插件 (Dayjs/i18n/Storage/Sentry) | 资源浪费，可能冲突 |

## 必须遵守

- Props 使用 TypeScript 接口 → [common-patterns](.claude/agents/common-patterns.md)
- 颜色使用 CSS 变量 → [common-patterns](.claude/agents/common-patterns.md)
- IPC 通道加入白名单 → [electron-development](.claude/agents/electron-development.md)
- 错误处理 try-catch + finally → [common-patterns](.claude/agents/common-patterns.md)
- API 从 `@/api` 导入 → [api-development](.claude/agents/api-development.md)
- Selector 使用 createSelector → [store-development](.claude/agents/store-development.md)

---

## 关键目录速查

| 目录 | 职责 | 注意事项 |
|------|------|---------|
| `src/api/generated/` | Orval 自动生成的 API | **禁止修改** |
| `src/api/custom/` | 自定义/扩展 API | 在这里扩展 |
| `src/components/` | 全局公用组件 | 多页面复用 |
| `src/views/` | 页面组件 | **页面间禁止互相导入** |
| `src/router/routes/` | 路由配置 | 三层路由体系 |
| `src/store/modules/` | Redux Store 模块 | Slice + Thunk + Selectors |
| `src/store/framework/` | Redux 自定义框架 | 动态模块、插件系统 |
| `src/plugins/` | 全局插件 (Dayjs/i18n/Storage/Sentry) | **禁止重复配置** |
| `src/hooks/` | 自定义 Hooks | usePermission 等 |
| `electron/main/` | Electron 主进程 | 窗口管理、IPC |
| `electron/preload/` | Electron 预加载 | IPC 白名单 |
| `public/theme.css` | CSS 主题变量 | 所有颜色用变量 |

---

## Agent 导航

| Agent | 适用场景 |
|-------|---------|
| [common-patterns](.claude/agents/common-patterns.md) | Props/CSS/Hooks/错误处理 (SSoT) |
| [api-development](.claude/agents/api-development.md) | Orval API、自定义扩展 |
| [component-development](.claude/agents/component-development.md) | React 组件、Ant Design |
| [router-development](.claude/agents/router-development.md) | 路由配置、权限控制 |
| [electron-development](.claude/agents/electron-development.md) | Electron、IPC、打包 |
| [store-development](.claude/agents/store-development.md) | Redux Toolkit + Saga |
| [coding-standards](.claude/agents/coding-standards.md) | 编码规范、代码风格 |
| [code-review](.claude/agents/code-review.md) | 代码审查、质量检查 |
| [testing](.claude/agents/testing.md) | Vitest + Playwright |
| [deployment](.claude/agents/deployment.md) | Docker、CI/CD |
| [project-structure](.claude/agents/project-structure.md) | 目录组织规范 |
| [figma-extraction-guide](.claude/agents/figma-extraction-guide.md) | Figma 设计还原 |

---

## 常用命令

```bash
pnpm start              # 开发服务器 (Web + Electron)
pnpm build              # 构建生产版本
pnpm api:gen            # 生成 API 代码 (从 openapi.json)
pnpm lint               # ESLint + Stylelint + Markdownlint
pnpm type-check         # TypeScript 类型检查
pnpm test               # 运行测试
pnpm test:coverage      # 测试覆盖率
pnpm test:e2e           # E2E 测试
pnpm commit             # 交互式提交 (commitizen)
```
