---
name: figma-extraction-guide
description: Figma MCP 使用指南，设计数据提取、资源下载、Token 映射、设计还原流程
tools: ["Read", "Grep", "Glob"]
model: sonnet
---

# Figma Extraction Guide - Figma 设计还原

## 职责
指导使用 Figma MCP 工具提取设计数据、下载资源、映射 Token，完成设计到 React 组件的还原。

---

## 核心流程

```
提取 fileKey/nodeId → 获取设计数据 → 提取设计 Token → 下载图片资源 → 编写 React 组件
```

---

## Step 1: 提取 fileKey 和 nodeId

### 从 Figma URL 解析

```
URL 格式: https://www.figma.com/design/{fileKey}/Title?node-id={nodeId}

示例: https://www.figma.com/design/abc123/MyDesign?node-id=100-200
fileKey: abc123
nodeId: 100-200 → 转换为 100:200 (URL 编码 - → :)
```

---

## Step 2: 获取设计数据

```typescript
// 使用 Figma MCP 工具
mcp__figma__get_figma_data({
  fileKey: 'abc123',
  nodeId: '100:200',
  depth: 3,  // 获取 3 层深度
})
```

### 数据结构

```json
{
  "name": "ComponentName",
  "type": "FRAME",
  "absoluteBoundingBox": { "x": 0, "y": 0, "width": 375, "height": 640 },
  "fills": [{ "type": "SOLID", "color": { "r": 1, "g": 1, "b": 1, "a": 1 } }],
  "children": [...]
}
```

---

## Step 3: 提取设计 Token

### 间距

```
padding: absoluteBoundingBox 计算
gap: itemSpacing 属性
```

### 颜色映射

```scss
// Figma 颜色 → CSS 变量映射
// 文本黑色 (0, 0, 0) → var(--ant-color-text)
// 灰色文本 → var(--ant-color-text-secondary)
// 白色背景 → var(--ant-color-bg-container)
// 主题蓝色 → var(--ant-color-primary)
// 边框灰色 → var(--ant-color-border)
```

### 字体

```scss
// Figma fontSize → CSS
font-size: 14px;  // 正文
font-size: 16px;  // 标题
font-size: 12px;  // 辅助文本
font-weight: 500; // 中等
font-weight: 600; // 加粗
```

---

## Step 4: 下载图片资源

### SVG 图标

```typescript
mcp__figma__download_figma_images({
  fileKey: 'abc123',
  nodes: [{ nodeId: '100:200', fileName: 'icon-name' }],
  localPath: '/path/to/project/src/assets/icons/',
  format: 'svg',
  scale: 1,
})
```

### PNG 图片

```typescript
mcp__figma__download_figma_images({
  fileKey: 'abc123',
  nodes: [{ nodeId: '100:201', fileName: 'banner' }],
  localPath: '/path/to/project/src/assets/images/',
  format: 'png',
  scale: 2,  // 2x 高清
})
```

### 资源路径约定

```
src/assets/
├── icons/           # SVG 图标
│   └── [project]/   # 按项目/模块分类
└── images/          # PNG/JPG 图片
    └── [project]/
```

---

## Step 5: 编写 React 组件

### 从设计数据到组件

```typescript
// 基于 Figma 数据生成
import React from 'react';
import styles from './index.module.scss';
import iconUser from '@/assets/icons/user.svg';

interface CardProps {
  title: string;
  description: string;
  avatar?: string;
}

const Card: React.FC<CardProps> = ({ title, description, avatar }) => {
  return (
    <div className={styles.card}>
      <img src={avatar || iconUser} alt="" className={styles.avatar} />
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.desc}>{description}</p>
      </div>
    </div>
  );
};
```

```scss
// index.module.scss - 使用设计 Token
.card {
  display: flex;
  align-items: center;
  gap: 12px;  // 从 Figma itemSpacing 提取
  padding: 16px;
  background: var(--ant-color-bg-container);
  border: 1px solid var(--ant-color-border);
  border-radius: var(--ant-border-radius);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.title {
  font-size: 16px;
  font-weight: 500;
  color: var(--ant-color-text);
  margin: 0;
}

.desc {
  font-size: 14px;
  color: var(--ant-color-text-secondary);
  margin: 4px 0 0;
}
```

---

## 图标使用规范

```typescript
// ✅ 正确: img 标签引用 SVG 文件
<img src={iconSrc} alt="icon" width={24} height={24} />

// ✅ 正确: unplugin-icons 自动导入
import HomeIcon from '~icons/custom/home';
<HomeIcon />

// ❌ 禁止: 内联 SVG
<svg viewBox="0 0 24 24"><path d="..." /></svg>
```

---

## Figma 转 CSS 盒模型

### 原则

```
Figma Auto Layout → CSS Flexbox
  - direction: horizontal → flex-direction: row
  - direction: vertical → flex-direction: column
  - gap → gap
  - padding → padding
  - align → align-items / justify-content

Figma Fixed Size → CSS width/height
  - width: fixed → width: Xpx
  - width: fill → flex: 1 或 width: 100%
  - width: hug → width: auto (默认)
```

---

## 异常处理

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| 403 Forbidden | API Key 无权限 | 检查 Figma API Key 配置 |
| 节点未找到 | nodeId 格式错误 | 确认 `-` 转换为 `:` |
| 图片下载失败 | 节点不可导出 | 检查节点是否有 export 设置 |
| 颜色不准确 | opacity 未提取 | 检查 fills[].opacity 属性 |

---

## 相关文档

- [component-development.md](component-development.md) - 组件开发规范
- [common-patterns.md](common-patterns.md) - CSS 变量规范
