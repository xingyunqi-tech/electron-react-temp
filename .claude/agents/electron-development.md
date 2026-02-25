---
name: electron-development
description: Electron 三进程架构、IPC 通信规范、安全策略、打包发布、主进程开发
tools: ["Read", "Grep", "Glob"]
model: sonnet
---

# Electron Development - Electron 开发指南

## 职责
指导 Electron 桌面应用的开发，包括三进程架构、IPC 安全通信、预加载脚本、打包发布和安全策略。

---

## 三进程架构

```
┌──────────────────────────────────────────────┐
│ Main Process (主进程)                          │
│ electron/main/index.ts                        │
│ - 窗口管理 (BrowserWindow)                     │
│ - 系统集成 (菜单、托盘、快捷键)                  │
│ - IPC 处理                                     │
│ - Node.js 全部 API 可用                        │
├──────────────────────────────────────────────┤
│ Preload Script (预加载脚本)                     │
│ electron/preload/index.ts                     │
│ - contextBridge 安全暴露 API                   │
│ - IPC 通道白名单                               │
│ - DOM 就绪检测 + Loading 动画                   │
├──────────────────────────────────────────────┤
│ Renderer Process (渲染进程)                     │
│ src/ (React 应用)                              │
│ - 通过 window.ipcRenderer 与主进程通信           │
│ - 禁止直接使用 Node.js API                     │
│ - 运行在隔离的浏览器环境                         │
└──────────────────────────────────────────────┘
```

---

## IPC 通信规范

### 通道白名单机制

```typescript
// electron/preload/index.ts
// 只有白名单中的通道才能通信

const ALLOWED_SEND_CHANNELS: string[] = [
  // 在此添加允许的 send 通道
];

const ALLOWED_INVOKE_CHANNELS: string[] = [
  // 在此添加允许的 invoke 通道
];

const ALLOWED_ON_CHANNELS: string[] = [
  // 在此添加允许的 on 通道
];

// contextBridge 暴露安全 API
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(channel: string, listener: (...args: unknown[]) => void) {
    if (!ALLOWED_ON_CHANNELS.includes(channel)) {
      throw new Error(`Channel "${channel}" is not allowed`);
    }
    const wrappedListener = (_event: IpcRendererEvent, ...args: unknown[]) => listener(...args);
    ipcRenderer.on(channel, wrappedListener);
    return wrappedListener;
  },
  off(channel: string, listener: (...args: unknown[]) => void) {
    ipcRenderer.off(channel, listener);
  },
  send(channel: string, ...args: unknown[]) {
    if (!ALLOWED_SEND_CHANNELS.includes(channel)) {
      throw new Error(`Channel "${channel}" is not allowed`);
    }
    ipcRenderer.send(channel, ...args);
  },
  invoke(channel: string, ...args: unknown[]) {
    if (!ALLOWED_INVOKE_CHANNELS.includes(channel)) {
      throw new Error(`Channel "${channel}" is not allowed`);
    }
    return ipcRenderer.invoke(channel, ...args);
  },
});
```

### 新增 IPC 通道

```typescript
// 步骤 1: 在 preload 的白名单中添加通道名
const ALLOWED_INVOKE_CHANNELS: string[] = [
  'get-system-info',  // 新增
];

// 步骤 2: 在主进程注册处理器
// electron/main/index.ts
ipcMain.handle('get-system-info', async () => {
  return {
    platform: process.platform,
    arch: process.arch,
    version: app.getVersion(),
  };
});

// 步骤 3: 在渲染进程调用
// src/utils/electron.ts
export const getSystemInfo = async () => {
  if (window.ipcRenderer) {
    return await window.ipcRenderer.invoke('get-system-info');
  }
  return null;  // Web 环境降级
};
```

### 通信模式

```typescript
// 模式 1: 渲染 → 主 (单向)
window.ipcRenderer.send('channel', data);

// 模式 2: 渲染 → 主 → 渲染 (双向，Promise)
const result = await window.ipcRenderer.invoke('channel', data);

// 模式 3: 主 → 渲染 (推送)
// 主进程
win.webContents.send('channel', data);
// 渲染进程
window.ipcRenderer.on('channel', (data) => { ... });
```

---

## 安全策略

### 必须遵守的安全规则

```typescript
// ✅ 正确: contextIsolation 开启
new BrowserWindow({
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true,     // 必须开启!
    nodeIntegration: false,     // 必须关闭!
    sandbox: true,              // 推荐开启
  },
});

// ❌ 错误: 关闭隔离
new BrowserWindow({
  webPreferences: {
    contextIsolation: false,    // 严重安全漏洞!
    nodeIntegration: true,      // 严重安全漏洞!
  },
});
```

### 安全清单

| 规则 | 说明 |
|------|------|
| contextIsolation: true | 隔离渲染进程和预加载脚本的上下文 |
| nodeIntegration: false | 禁止渲染进程直接使用 Node.js API |
| IPC 白名单 | 只允许注册的通道通信 |
| 输入验证 | 主进程必须验证来自渲染进程的数据 |
| 最小权限 | 只暴露必要的 API |

---

## 窗口管理

### 创建窗口

```typescript
// electron/main/index.ts
async function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(MAIN_DIST, '../preload/index.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // 开发环境: 加载 Vite Dev Server
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    // 生产环境: 加载打包后的 HTML
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }
}
```

### 单实例锁

```typescript
// 确保只有一个应用实例
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // 如果有第二个实例，聚焦到已有窗口
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });
}
```

---

## Web/Electron 兼容

### 环境检测

```typescript
// src/utils/os.ts
export const isElectron = () => {
  return typeof window !== 'undefined' && window.ipcRenderer !== undefined;
};

// 条件使用
if (isElectron()) {
  // Electron 特有逻辑
  const info = await window.ipcRenderer.invoke('get-system-info');
} else {
  // Web 降级逻辑
  console.log('Running in browser');
}
```

### 类型声明

```typescript
// typings/electron.d.ts
interface Window {
  ipcRenderer: {
    on: (channel: string, listener: (...args: unknown[]) => void) => void;
    off: (channel: string, listener: (...args: unknown[]) => void) => void;
    send: (channel: string, ...args: unknown[]) => void;
    invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;
  };
}
```

---

## 打包发布

### Electron Builder 配置

```json5
// electron-builder.json5
{
  "appId": "com.example.app",
  "asar": true,
  "directories": { "output": "release/${version}" },
  "files": ["dist-electron", "dist"],
  "mac": {
    "target": ["dmg"],
    "artifactName": "${productName}_${version}.${ext}"
  },
  "win": {
    "target": [{ "target": "nsis", "arch": ["x64"] }]
  },
  "nsis": {
    "oneClick": true,
    "perMachine": false,
    "deleteAppDataOnUninstall": false
  },
  "linux": {
    "target": ["AppImage"]
  }
}
```

### 构建命令

```bash
# Web 构建
pnpm build

# Electron 构建 (自动包含 Web 构建)
# 构建产物在 release/ 目录
```

---

## 开发调试

### Vite + Electron 热更新

```
vite-plugin-electron 提供:
- 主进程代码修改 → 自动重启 Electron
- 渲染进程代码修改 → HMR 热更新
- 预加载脚本修改 → 自动重新加载
```

### 调试主进程

```bash
# 主进程 DevTools (VSCode)
# 在 .vscode/launch.json 中配置:
{
  "type": "node",
  "request": "attach",
  "name": "Attach to Main Process",
  "port": 9229
}
```

---

## 快速检查清单

- [ ] contextIsolation: true
- [ ] nodeIntegration: false
- [ ] 新 IPC 通道已添加到白名单
- [ ] 主进程验证来自渲染进程的输入
- [ ] Web/Electron 兼容处理 (isElectron 检测)
- [ ] 类型声明正确 (window.ipcRenderer)
- [ ] 开发/生产环境路径正确

---

## 相关文档

- [deployment.md](deployment.md) - 部署和打包
- [project-structure.md](project-structure.md) - 项目结构
- [security-check (command)](../commands/security-check.md) - 安全检查
