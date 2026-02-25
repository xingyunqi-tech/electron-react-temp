---
description: Git 工作流规范 - 分支策略、提交规范、PR 流程
---

# Git 工作流规范

## 分支策略

| 分支类型 | 命名 | 说明 |
|---------|------|------|
| **主分支** | `master` / `main` | 生产环境代码 |
| **开发分支** | `develop` | 集成测试 |
| **功能分支** | `feat/xxx` | 新功能开发 |
| **修复分支** | `fix/xxx` | Bug 修复 |
| **发布分支** | `release/x.x.x` | 版本发布 |
| **热修复** | `hotfix/xxx` | 紧急修复 |

## 提交规范 (Conventional Commits)

```
type(scope): subject

type:
  feat     - 新功能
  fix      - Bug 修复
  docs     - 文档更新
  style    - 代码格式 (不影响功能)
  refactor - 代码重构
  perf     - 性能优化
  test     - 测试相关
  build    - 构建/依赖
  ci       - CI/CD 配置
  chore    - 其他杂项

示例:
  feat: 添加用户登录功能
  fix(auth): 修复 Token 刷新逻辑
  refactor(store): 重构用户模块
```

## PR 流程

```
1. 创建功能分支: git checkout -b feat/xxx
2. 开发 + 提交
3. 推送: git push origin feat/xxx
4. 创建 PR → master
5. 代码审查 (CI 自动检查)
6. 合并 PR
```

## 提交前检查

```bash
pnpm lint          # 代码检查
pnpm type-check    # 类型检查
pnpm test          # 运行测试
pnpm commit        # 交互式提交 (推荐)
```

## 常用命令

```bash
git stash           # 暂存当前修改
git stash pop       # 恢复暂存
git log --oneline   # 查看提交历史
git diff --staged   # 查看暂存区变更
```
