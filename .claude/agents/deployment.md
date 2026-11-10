---
name: deployment
description: 应用部署指南，Docker 容器化、CI/CD (GitHub Actions)、Nginx 配置、Electron 打包
tools: ["Read", "Grep", "Glob"]
model: sonnet
---

# Deployment - 部署指南

## 职责
指导应用的构建、部署和运维，包括 Docker 容器化、CI/CD 流水线、Nginx 配置和 Electron 打包发布。

---

## 部署架构

### Web 部署

```
GitHub Push → Check (lint/type-check/test)

手动触发 Deploy → Build Docker Image (nginx:alpine)
  → Push GHCR / TCR
  → SSH: docker pull from TCR → manage.sh deploy
```

### Electron 打包

```
pnpm build → Vite 构建 Web 资产
  → electron-builder 打包
  → 输出 DMG (Mac) / NSIS (Win) / AppImage (Linux)
  → release/{version}/
```

---

## Docker 部署

### 文件结构

```
deploy/
├── manage.sh           # Docker 容器管理脚本
├── nginx.conf          # Nginx 配置
└── README.md           # 部署说明
Dockerfile              # Docker 镜像配置
package.sh              # 打包脚本
```

### Dockerfile

```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### 容器管理

```bash
# 启动
./deploy/manage.sh start

# 停止
./deploy/manage.sh stop

# 重启
./deploy/manage.sh restart

# 查看日志
./deploy/manage.sh logs
```

---

## CI/CD (GitHub Actions)

### Check (`.github/workflows/check.yml`)

触发: PR / Push / 手动

```yaml
Jobs:
  lint:    ESLint + Stylelint + Markdownlint
  type:    TypeScript 编译检查
  test:    Vitest 单元测试
```

### Deploy (`.github/workflows/deploy.yml`)

触发: 手动（可选部署目标 aliyun / tencent / all）

```yaml
Steps:
  1. pnpm build (构建 Web 资产)
  2. 构建 Nginx 镜像，推送 GHCR；部署时同时推送腾讯云 TCR
  3. 同步 manage.sh、nginx.conf 到服务器
  4. SSH 登录 TCR 执行 manage.sh deploy <镜像>
  5. cleanup-registry.yml 清理 GHCR / TCR 旧镜像（各保留 2 个）
```

### 所需 Secrets（`<PREFIX>` 为 `ALIYUN` 或 `TENCENT`）

| Secret | 用途 |
|--------|------|
| `<PREFIX>_HOST` | 服务器地址 |
| `<PREFIX>_USER` | SSH 用户名 |
| `<PREFIX>_PATH` | 部署目录 |
| `<PREFIX>_SSH_KEY` | SSH 私钥 |
| `TENCENT_TCR_PASSWORD` | TCR 个人版登录密码 |

### 所需 Variables

| Variable | 用途 |
|----------|------|
| `TENCENT_TCR_REGISTRY` | TCR 地址 |
| `TENCENT_TCR_NAMESPACE` | TCR 命名空间 |
| `TENCENT_TCR_USERNAME` | 腾讯云账号 UIN |

---

## Nginx 配置

### 关键特性

```nginx
server {
    listen 80;

    # SPA 路由支持
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api/ {
        proxy_pass http://backend:3000/;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
}
```

---

## Electron 打包

### 配置 (`electron-builder.json5`)

```json5
{
  "appId": "com.example.electron-react-vite",
  "asar": true,
  "directories": { "output": "release/${version}" },
  "files": ["dist-electron", "dist"],
  "mac": { "target": ["dmg"] },
  "win": { "target": [{ "target": "nsis", "arch": ["x64"] }] },
  "linux": { "target": ["AppImage"] }
}
```

### 产物路径

```
release/
└── {version}/
    ├── app-{version}.dmg         # macOS
    ├── app-{version}-setup.exe   # Windows
    └── app-{version}.AppImage    # Linux
```

---

## 环境变量

### 开发环境 (`.env.development`)

```
VITE_BASEURL=https://api.sunweijie.top
```

### 生产环境 (`.env.production`)

```
VITE_BASEURL=https://api.sunweijie.top
VITE_ENABLE_WEB_VITALS=true
VITE_ENABLE_SENTRY=true
VITE_SENTRY_DSN=...
```

---

## 故障排查

| 问题 | 排查方向 |
|------|---------|
| 构建失败 | 检查 TypeScript 类型错误: `pnpm type-check` |
| Docker 启动失败 | 检查端口占用: `docker logs <container>` |
| 部署后 404 | 检查 Nginx try_files 配置 |
| API 请求失败 | 检查 proxy_pass 配置和后端服务状态 |
| Electron 打包失败 | 检查 electron-builder 配置和 Node 版本 |

---

## 部署检查清单

### 构建前

- [ ] `pnpm type-check` 通过
- [ ] `pnpm lint` 通过
- [ ] `pnpm test` 通过
- [ ] 环境变量正确配置

### 部署前

- [ ] Docker 镜像构建成功
- [ ] Nginx 配置语法正确
- [ ] 服务器磁盘空间充足

### 部署后

- [ ] 页面可正常访问
- [ ] API 代理正常工作
- [ ] SPA 路由正常 (直接访问子路径)
- [ ] 静态资源正常加载

---

## 相关文档

- [electron-development.md](electron-development.md) - Electron 开发
- [project-structure.md](project-structure.md) - 项目结构
