---
name: architecture-designer
description: 从 PRD 文档生成完整架构设计，包括目录结构、路由配置、数据流、开发计划
---

# Architecture Designer - 架构设计器

## 功能概述
根据 PRD 文档生成完整的技术方案，包括目录结构设计、路由配置、状态管理方案、API 接口规划和开发计划。

## 使用方式
```bash
/architecture-designer <prd-path> [--create-todos]

# 示例
/architecture-designer docs/prd/user-management.md --create-todos
```

## 参数说明
| 参数 | 说明 |
|------|------|
| `<prd-path>` | PRD 文档路径 |
| `--create-todos` | 生成 TODO 任务清单 |

## 执行流程

### Phase 1: PRD 分析
1. 读取 PRD 文档
2. 识别功能模块和页面列表
3. 提取 API 接口需求
4. 确认角色权限要求

### Phase 2: 架构设计
1. **目录结构**: 设计 views、components、store 目录
2. **路由配置**: 确定路由层级和权限配置
3. **状态管理**: 规划 Redux Store 模块和数据流
4. **API 规划**: 确认需要的 API 接口 (Orval 生成 vs 自定义)
5. **组件规划**: 识别全局组件和页面级组件

### Phase 3: 输出方案

输出格式:

```markdown
## 技术方案

### 1. 目录结构
src/views/[feature]/
├── index.tsx
├── components/
│   ├── [Component1].tsx
│   └── [Component2].tsx
└── index.module.scss

### 2. 路由配置
// async.tsx 中添加
{ path: 'feature', element: <Feature />, handle: { title: '功能', roles: [...] } }

### 3. Store 设计
src/store/modules/feature.ts
- State: { list, loading, currentId }
- Thunks: fetchListAction, createAction
- Selectors: featureListSelector, currentFeatureSelector

### 4. API 接口
- GET /feature/list → getFeatureList (Orval)
- POST /feature → createFeature (Orval)
- POST /feature/upload → uploadFeatureFile (Custom)

### 5. 开发计划
1. [ ] 创建 Store 模块
2. [ ] 创建页面组件
3. [ ] 配置路由
4. [ ] 接入 API
5. [ ] 编写测试
```

## 规范约束
- 路由配置参考 [router-development agent]
- Store 设计参考 [store-development agent]
- API 使用参考 [api-development agent]
- 组件设计参考 [component-development agent]
