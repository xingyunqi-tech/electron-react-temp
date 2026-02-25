---
name: figma-to-component
description: 从 Figma 设计稿生成 React 组件，自动颜色映射、图片下载、类型生成
---

# Figma to Component - 设计稿转组件

## 功能概述
从 Figma 设计稿自动提取设计数据，生成符合项目规范的 React 组件代码，包括颜色映射、图片下载和样式生成。

## 使用方式
```bash
/figma-to-component <figma-url> [--split] [--download-assets]

# 示例
/figma-to-component https://www.figma.com/design/abc123/Design?node-id=100-200
/figma-to-component <url> --split --download-assets
```

## 参数说明
| 参数 | 说明 |
|------|------|
| `<figma-url>` | Figma 页面 URL |
| `--split` | 智能拆分为多个子组件 |
| `--download-assets` | 自动下载 SVG/PNG 资源 |

## 执行流程

### Phase 1: 提取设计数据
1. 从 URL 解析 `fileKey` 和 `nodeId`
2. 调用 `mcp__figma__get_figma_data` 获取设计数据
3. 分析节点树结构

### Phase 2: 提取设计 Token
1. **间距**: padding, gap, margin
2. **颜色**: 映射到 CSS 变量
3. **字体**: fontSize, fontWeight, lineHeight
4. **圆角**: borderRadius
5. **阴影**: boxShadow

### Phase 3: 下载资源
1. SVG 图标 → `src/assets/icons/`
2. PNG 图片 → `src/assets/images/`

### Phase 4: 生成组件
1. 创建 React 组件 (.tsx)
2. 创建样式文件 (.module.scss)
3. 定义 Props 接口

## 颜色映射规则

| Figma 颜色 | CSS 变量 |
|------------|---------|
| 纯黑文本 | `var(--ant-color-text)` |
| 灰色文本 | `var(--ant-color-text-secondary)` |
| 浅灰文本 | `var(--ant-color-text-tertiary)` |
| 白色背景 | `var(--ant-color-bg-container)` |
| 灰色背景 | `var(--ant-color-bg-layout)` |
| 蓝色主题 | `var(--ant-color-primary)` |
| 灰色边框 | `var(--ant-color-border)` |

## 图标使用规范

```typescript
// ✅ 正确: img 标签引用
<img src={iconSrc} alt="icon" />

// ❌ 禁止: 内联 SVG
<svg>...</svg>
```

## 规范约束
- 颜色必须映射到 CSS 变量
- 图标必须下载为文件
- Props 使用 TypeScript 接口
- 参考 [figma-extraction-guide agent] 和 [component-development agent]
