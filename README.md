# Electron React 企业级桌面应用模板

> 基于 React 18 + Electron 40 + TypeScript + Vite 构建的现代化桌面应用模板，同时支持 Web 部署

[![Node.js](https://img.shields.io/badge/node-%3E%3D22-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.x-61DAFB)](https://react.dev/)
[![Electron](https://img.shields.io/badge/electron-40.x-47848F)](https://www.electronjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.9-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/vite-7.x-646CFF)](https://vitejs.dev/)

## 特性

- **现代化技术栈**: React 18 + Electron 40 + TypeScript 5.9 + Vite 7
- **桌面 + Web**: 同一套代码同时支持 Electron 桌面端和 Web 端部署
- **UI 组件库**: Ant Design 6 + UnoCSS 原子化 CSS
- **状态管理**: Redux Toolkit + Redux Saga，自定义框架支持动态模块注册
- **权限路由**: React Router 7，三层路由体系（基础/公共/异步权限）
- **API 自动生成**: Orval 从 OpenAPI 规范自动生成类型安全的 API 层
- **国际化**: i18next + react-i18next，支持 AI 自动翻译
- **主题系统**: Ant Design Token + CSS 变量，支持 dark/light 切换
- **Electron 安全**: contextBridge + IPC 通道白名单，遵循安全最佳实践
- **测试完善**: Vitest 单元测试 + Playwright E2E 测试
- **代码质量**: ESLint + Stylelint + Prettier + Husky + lint-staged
- **监控集成**: Sentry 错误监控和性能追踪
- **容器化**: Docker + Nginx 一键部署
- **CI/CD**: GitHub Actions 自动化质量检查和部署
- **AI 辅助开发**: Claude Code Skills 配置，75% 效率提升

## 技术架构

### 核心技术栈

| 分类 | 技术 |
|------|------|
| **框架** | React 18 (Hooks + Function Component) |
| **桌面端** | Electron 40 (Main + Preload + Renderer 三进程) |
| **语言** | TypeScript 5.9 (严格类型检查) |
| **构建** | Vite 7 + vite-plugin-electron |
| **状态管理** | Redux Toolkit + Redux Saga |
| **路由** | React Router 7 |
| **UI 库** | Ant Design 6 |
| **样式** | UnoCSS + SCSS + CSS Modules |
| **HTTP** | Axios + Orval (API 自动生成) |
| **测试** | Vitest 4 + Playwright 1.57 |
| **监控** | Sentry (错误 + 性能) |

### 开发工具

| 分类 | 技术 |
|------|------|
| **代码检查** | ESLint |
| **代码格式化** | Prettier |
| **样式检查** | Stylelint |
| **Git 钩子** | Husky + lint-staged |
| **提交规范** | Commitizen + cz-git |
| **拼写检查** | CSpell |
| **桌面打包** | electron-builder |

## 项目结构

```
electron-react-temp/
├── .claude/                   # Claude AI 配置 (Skills/Agents/Commands)
├── .github/workflows/         # GitHub Actions CI/CD
├── .husky/                    # Git hooks 配置
├── .vscode/                   # VS Code 编辑器配置
├── config/                    # 项目配置文件
│   ├── devServer.ts           # 开发服务器配置
│   ├── host.ts                # 主机配置
│   └── proxy.ts               # 代理配置
├── deploy/                    # 部署相关文件
│   ├── manage.sh              # Docker 容器管理脚本
│   ├── nginx.conf             # Nginx 配置文件
│   └── README.md              # 部署说明文档
├── e2e/                       # E2E 测试
├── electron/                  # Electron 桌面端
│   ├── main/                  # 主进程 (窗口管理、IPC)
│   └── preload/               # 预加载脚本 (contextBridge)
├── public/                    # 静态资源
│   └── theme.css              # CSS 主题变量
├── scripts/                   # 构建和工具脚本
│   ├── i18n/                  # 国际化自动化脚本
│   ├── cssVars/               # CSS 变量检查脚本
│   └── husky/                 # 提交信息检查
├── src/                       # 源代码 (渲染进程)
│   ├── api/                   # API 接口层
│   │   ├── core/              # HTTP 客户端、拦截器 (手动维护)
│   │   ├── generated/         # Orval 自动生成 (禁止修改!)
│   │   ├── custom/            # 自定义扩展 API
│   │   └── index.ts           # 统一导出
│   ├── app/                   # App 配置
│   ├── assets/                # 静态资源 (图片、图标)
│   ├── components/            # 全局公用组件
│   │   ├── ErrorBoundary/     # 错误边界
│   │   ├── LazyImage/         # 懒加载图片
│   │   ├── Skeleton/          # 骨架屏
│   │   └── StaticFunction/    # 静态方法组件
│   ├── constants/             # 常量定义
│   ├── hooks/                 # 自定义 Hooks
│   ├── interface/             # TypeScript 接口定义
│   ├── layout/                # 布局组件
│   ├── locale/                # 国际化语言包
│   ├── plugins/               # 全局插件
│   │   ├── dayjs.ts           # 日期处理
│   │   ├── locale.ts          # i18n 配置
│   │   ├── sentry/            # 错误监控
│   │   ├── storage/           # 存储管理
│   │   ├── theme.ts           # 主题配置
│   │   └── webVitals.ts       # 性能指标
│   ├── router/                # 路由配置
│   │   ├── routes/            # 路由定义 (base/common/async)
│   │   └── guards.tsx         # 路由守卫 (AuthGuard)
│   ├── store/                 # Redux 状态管理
│   │   ├── modules/           # 业务模块 (global/user/permission)
│   │   └── framework/         # 自定义框架 (动态模块/插件)
│   ├── styles/                # 全局样式
│   ├── utils/                 # 工具函数
│   ├── views/                 # 页面组件
│   │   ├── Home/              # 首页
│   │   ├── Login/             # 登录页
│   │   ├── Setting/           # 设置页
│   │   ├── Forbidden/         # 403 页面
│   │   └── NotFound/          # 404 页面
│   └── index.ts               # 应用入口
├── tests/                     # 单元测试
├── typings/                   # TypeScript 全局类型声明
├── Dockerfile                 # Docker 镜像配置
├── electron-builder.json5     # Electron 打包配置
├── orval.config.ts            # Orval API 生成配置
├── playwright.config.ts       # Playwright E2E 配置
├── vitest.config.ts           # Vitest 测试配置
├── package.json               # 项目依赖配置
└── package.sh                 # 部署打包脚本
```

## 快速开始

### 环境要求

- **Node.js**: >= 22.0.0
- **包管理器**: pnpm (必须)

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 启动开发服务器 (Web + Electron)
pnpm start

# 启动 HTTPS 开发服务器
pnpm start:https
```

### 构建

```bash
# 构建 Web 生产版本
pnpm build

# 打包 Electron 桌面应用
pnpm package

# 预览 Web 构建结果
pnpm preview

# 构建并分析包大小
pnpm analyzer
```

## 脚本命令

### 开发相关

```bash
pnpm start              # 启动开发服务器
pnpm start:https        # HTTPS 开发服务器
pnpm type-check         # TypeScript 类型检查
```

### 测试相关

```bash
pnpm test               # 运行单元测试
pnpm test:watch         # 监听模式
pnpm test:coverage      # 测试覆盖率报告
pnpm test:ui            # Vitest UI 界面
pnpm test:e2e           # Playwright E2E 测试
pnpm test:e2e:report    # 查看 E2E 测试报告
```

### 代码质量

```bash
pnpm lint               # 完整代码检查 (ESLint + Stylelint + Markdownlint)
pnpm lint:script        # JavaScript/TypeScript 检查
pnpm lint:style         # 样式文件检查
pnpm lint:md            # Markdown 文档检查
pnpm format             # Prettier 代码格式化
pnpm cspell             # 拼写检查
pnpm commit             # 规范化提交 (Commitizen)
```

### API 和国际化

```bash
pnpm api:gen            # Orval 生成 API 代码 (从 openapi.json)
pnpm i18n               # 交互式国际化管理
pnpm i18n:exportLocale  # 导出语言包
```

### 构建和部署

```bash
pnpm build              # 构建 Web 生产版本
pnpm package            # 打包 Electron 桌面应用
pnpm preview            # 预览构建结果
pnpm analyzer           # 分析构建产物
pnpm uploadToSentry     # 上传 Source Map 到 Sentry
pnpm clean              # 清理构建产物
```

## 核心架构

### Orval API 自动生成

项目使用 Orval 从 OpenAPI 规范自动生成类型安全的 API 层：

```
后端更新 API → 更新 openapi.json → pnpm api:gen → 自动生成代码
```

- `src/api/generated/` — 自动生成，**禁止手动修改**
- `src/api/custom/` — 自定义扩展 (文件上传、WebSocket 等)
- 从 `@/api` 统一导入，不直接从 `generated/` 导入

### 三层路由体系

| 路由层 | 文件 | 说明 |
|--------|------|------|
| 基础路由 | `routes/base.tsx` | 登录、404、403，无需登录 |
| 公共路由 | `routes/common.tsx` | 首页等，登录即可访问 |
| 异步路由 | `routes/async.tsx` | 管理页面，需要角色权限 |

路由守卫流程：Token 检查 → 初始化权限路由 → 获取用户信息 → 角色过滤 → 放行/403

### Redux 自定义框架

- **动态模块注册**: `defineModule()` / `destroyModule()` 支持按需加载
- **插件系统**: 持久化插件 (redux-persist + localforage)、循环任务插件
- **模块模式**: Slice + AsyncThunk + createSelector 统一导出

### Electron 三进程架构

| 进程 | 目录 | 职责 |
|------|------|------|
| Main | `electron/main/` | 窗口管理、IPC 处理、系统集成 |
| Preload | `electron/preload/` | contextBridge 安全暴露 API |
| Renderer | `src/` | React 应用 |

安全要求：IPC 通道白名单、禁止关闭 contextIsolation、禁止在渲染进程使用 Node.js API

### 主题系统

所有颜色使用 CSS 变量或 Ant Design Token，支持 dark/light 主题切换：

```scss
// 正确
.component {
  color: var(--ant-color-text);
  background: var(--ant-color-bg-container);
}
```

主题配置：`src/plugins/theme.ts` | CSS 变量：`public/theme.css`

## VS Code 配置

项目推荐安装以下插件（已配置在 `.vscode/extensions.json`）：

| 插件 | 用途 |
|------|------|
| ESLint | JavaScript/TypeScript 代码检查 |
| Stylelint | CSS/SCSS 代码检查 |
| Prettier | 代码格式化 |
| CSS Modules | CSS Modules 智能提示 |
| ES7+ React snippets | React 代码片段 |
| Code Spell Checker | 拼写检查 |
| i18n Ally | 国际化开发辅助 |
| CSS Variable Autocomplete | CSS 变量自动补全 |
| UnoCSS | UnoCSS 智能提示 |

## 环境变量

**开发环境** (`.env.development`):

```bash
VITE_BASEURL=http://localhost:3001/
```

**生产环境** (`.env.production`):

```bash
VITE_BASEURL=//127.0.0.1:3001/
VITE_SENTRY_ORG=your_org
VITE_SENTRY_PROJECT=your_project
VITE_SENTRY_AUTH_TOKEN=your_auth_token
```

**本地覆盖** (`.env.local`):

```bash
VITE_ENABLE_HTTPS=false
VITE_ENABLE_ANALYZER=false
VITE_UPLOAD_TO_SENTRY=false
```

## Docker 部署

### 本地开发部署

```bash
pnpm build
cd deploy && ./manage.sh start
# 访问 http://localhost:31190
```

### 生产环境部署

```bash
# 构建部署包
./package.sh

# 在服务器上解压并部署
tar -xzf electron-react-web_*.tar.gz
cd electron_react_web
./manage.sh start
```

支持的命令：`start` | `stop` | `restart` | `status` | `logs` | `build` | `remove` | `help`

详细部署文档：[deploy/README.md](./deploy/README.md)

## Electron 桌面打包

```bash
# 打包当前平台
pnpm package
```

支持 macOS (DMG)、Windows (NSIS) 和 Linux (AppImage)，配置文件：`electron-builder.json5`

## CI/CD

项目配置了 GitHub Actions 自动化流程：

| Workflow | 触发条件 | 功能 |
|----------|---------|------|
| Check Quality | Push / PR | 代码检查、类型检查、单元测试 |
| Build & Deploy | Quality 通过后 | 构建、Docker 打包、部署 |

## Claude Code AI 辅助

项目配置了完整的 Claude Code 工具链，支持 AI 辅助开发：

- **9 个 Skills**: 从架构设计到测试生成的完整工作流
- **12 个 Agents**: 各领域的深度开发指导
- **7 个 Commands**: 快速参考清单
- **自动化 Hooks**: 安全规则强制执行

详细配置：[.claude/README.md](.claude/README.md)

## 最佳实践

### 代码组织

- **全局组件** → `src/components/` (多页面复用)
- **页面级组件** → `src/views/[page]/components/` (单页面使用)
- **API 调用** → 优先使用 Orval 生成的 API，特殊场景在 `src/api/custom/` 扩展
- **状态管理** → Redux Store 模块放在 `src/store/modules/`
- **类型定义** → 全局类型放在 `typings/`，模块类型放在 `src/interface/`

### 开发规范

- 使用 `pnpm commit` 进行规范化提交
- 提交前自动运行 ESLint、Stylelint 和类型检查
- 所有颜色使用 CSS 变量，禁止硬编码
- Props 使用 TypeScript 接口定义
- Views 之间禁止互相导入

### 性能优化

- 路由懒加载 (React.lazy + Suspense)
- Redux Selector 缓存 (createSelector)
- 组件按需渲染 (React.memo + useMemo)
- 代码分割和 Tree Shaking
- Gzip 压缩

## 常见问题

### 依赖安装问题

```bash
# 清理缓存后重新安装
pnpm store prune
pnpm install
```

### Node 版本不匹配

```bash
# 需要 Node >= 22
node -v
nvm install 22 && nvm use 22
```

### 类型检查错误

```bash
pnpm type-check
# VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### 构建失败

```bash
pnpm clean
pnpm build
# 构建已设置 max-old-space-size=16384
```

### Docker 容器无法访问

```bash
cd deploy
./manage.sh status    # 检查状态
./manage.sh logs      # 查看日志
lsof -i :31190        # 检查端口
```

## 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feat/amazing-feature`)
3. 提交更改 (`pnpm commit`)
4. 推送到分支 (`git push origin feat/amazing-feature`)
5. 提交 Pull Request

要求：
- 所有测试通过 (`pnpm test`)
- 代码检查通过 (`pnpm lint`)
- 类型检查通过 (`pnpm type-check`)

## License

MIT
