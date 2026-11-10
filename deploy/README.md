# Docker 部署管理文档

用于管理 Electron React Web 应用的 Docker 容器。

## 📁 文件说明

- `manage.sh` - 容器管理脚本
- `nginx.conf` - Nginx 配置文件
- `../Dockerfile` - Docker 镜像构建文件
- `../package.sh` - 自动化打包脚本

## 🚀 快速使用

### 方式一：使用 package.sh 构建并部署（推荐）

```bash
# 1. 执行构建脚本
./package.sh

# 2. 解压部署包
tar -xzf electron-react-web_xxxxx.tar.gz
cd electron-react-web

# 3. 加载Docker镜像
docker load -i electron-react-web_xxxxx.tar

# 4. 使用管理脚本启动
./manage.sh start
```

### 方式二：手动Docker运行

```bash
# 1. 执行构建脚本
./package.sh

# 2. 运行容器
# 方式A: 使用默认配置(镜像内置nginx.conf)
docker run -d \
  --name electron-react-web \
  -p 80:80 \
  electron-react-web:<git-hash>

# 方式B: 挂载自定义配置覆盖默认配置
docker run -d \
  --name electron-react-web \
  -p 80:80 \
  -v $(pwd)/deploy/nginx.conf:/etc/nginx/nginx.conf:ro \
  -v $(pwd)/logs:/var/log/nginx \
  electron-react-web:<git-hash>
```

## 📋 可用命令

| 命令 | 说明 |
|------|------|
| `start` | 启动容器（自动创建/加载镜像） |
| `stop` | 停止容器 |
| `restart` | 重启容器 |
| `remove` | 删除容器 |
| `status` | 查看状态 |
| `logs` | 查看日志 |
| `build` | 构建镜像 |
| `deploy <镜像>` | 从镜像仓库拉取镜像并重建容器（CI 部署使用） |
| `help` | 帮助信息 |

## 🔧 配置

- 容器名称: `electron-react-web`
- 镜像名称: `electron-react-web:local`
- 默认端口: `31190`
- 环境变量: `PORT` - 自定义端口

## 📝 使用场景

**开发环境:**
```bash
pnpm build
cd deploy && ./manage.sh start
# 访问 http://localhost:31190
```

**生产部署:**
```bash
tar -xzf electron-react-web_xxxxx.tar.gz
cd electron_react_web && ./manage.sh start
```

## 🐛 故障排查

**端口被占用:**
```bash
lsof -i :31190
PORT=3000 ./manage.sh start  # 换端口
```

**容器无法启动:**
```bash
./manage.sh logs           # 查看日志
./manage.sh remove         # 清理重建
./manage.sh build
./manage.sh start
```

**镜像不存在:**
```bash
cd .. && pnpm build        # 构建资源
cd deploy && ./manage.sh build
```

## 🔗 访问地址

- 应用: http://localhost:31190
- 版本: http://localhost:31190/web/version

## 🔧 配置文件挂载

Docker镜像**默认包含**`nginx.conf`配置文件，可直接启动。如需自定义配置，可通过volume挂载覆盖。

### 默认配置

镜像内置 `deploy/nginx.conf` 作为默认配置，无需挂载即可启动。

### 可选挂载的配置文件（覆盖默认配置）

1. **Nginx配置文件** (`deploy/nginx.conf`) - 可选
   - 挂载路径: `/etc/nginx/nginx.conf`
   - 用途: 自定义服务器配置、代理设置等
   - **挂载后将覆盖镜像内置的默认配置**

2. **主题配置文件** (`public/theme.css`)
   - 挂载路径: `/usr/share/nginx/html/theme.css`
   - 用途: 自定义主题颜色和样式

3. **语言包文件** (`public/locale/`)
   - 挂载路径: `/usr/share/nginx/html/locale`
   - 用途: 更新国际化文本

4. **日志目录** (`./logs`)
   - 挂载路径: `/var/log/nginx`
   - 用途: 持久化日志文件

### 配置覆盖的优势

1. **开箱即用**: 使用默认配置可直接启动,无需额外配置
2. **灵活定制**: 需要时可挂载自定义配置覆盖默认配置
3. **环境适配**: 不同环境可挂载不同的配置文件
4. **快速调整**: 修改配置后只需重启容器即可生效

### 修改配置后重启

```bash
# 方式一：使用管理脚本
cd electron_react_web
./manage.sh restart

# 方式二：手动重启容器
docker restart electron-react-web
```

### 在线修改配置示例

```bash
# 1. 修改本地配置文件
vim deploy/nginx.conf

# 2. 重启容器使配置生效
./manage.sh restart

# 3. 验证配置是否生效
./manage.sh logs
```

## 📦 常用 Docker 命令

```bash
# 管理脚本命令
./manage.sh start      # 启动容器
./manage.sh stop       # 停止容器
./manage.sh restart    # 重启容器
./manage.sh status     # 查看状态
./manage.sh logs       # 查看日志
./manage.sh remove     # 删除容器
./manage.sh build      # 构建镜像

# Docker 原生命令
docker ps -a                       # 查看所有容器
docker logs electron-react-web          # 查看日志
docker logs -f electron-react-web       # 实时查看日志
docker exec -it electron-react-web sh   # 进入容器
docker stats electron-react-web         # 资源占用
docker inspect electron-react-web       # 查看容器详细信息
```

## 🔒 生产环境部署建议

1. **使用自定义配置文件**
   ```bash
   # 为不同环境准备不同的nginx配置
   cp nginx.conf nginx.prod.conf
   # 编辑生产环境配置
   vim nginx.prod.conf
   # 启动时挂载生产配置
   docker run -v ./nginx.prod.conf:/etc/nginx/nginx.conf:ro ...
   ```

2. **限制容器资源**
   ```bash
   docker run -d \
     --cpus="1" \
     --memory="512m" \
     --name electron-react-web \
     electron-react-web:latest
   ```

3. **配置日志持久化**
   ```bash
   # 挂载日志目录
   docker run -d \
     -v /var/log/nginx:/var/log/nginx \
     electron-react-web:latest
   ```

4. **健康检查**
   - 镜像已内置健康检查配置
   - 每30秒检查一次服务状态
   - 连续3次失败后标记为unhealthy

5. **配置文件管理**
   - 生产环境配置独立管理
   - 通过volume挂载覆盖默认配置
   - 配置文件纳入版本控制

## 🐛 故障排查

### 配置文件不生效

```bash
# 1. 检查挂载是否成功
docker exec electron-react-web cat /etc/nginx/nginx.conf

# 2. 检查配置文件语法
docker exec electron-react-web nginx -t

# 3. 重启容器
./manage.sh restart
```

### 日志查看

```bash
# 查看应用日志
./manage.sh logs
# 或
docker logs -f electron-react-web

# 查看nginx错误日志(如果挂载了日志目录)
tail -f logs/error.log

# 查看nginx访问日志(如果挂载了日志目录)
tail -f logs/access.log
```

---

## 🚀 GitLab CI/CD 自动化部署

项目配置了完整的 GitLab CI/CD 流程，支持自动化部署。

### Pipeline 流程

```
推送代码 → 安装依赖 → 代码检查 → 单元测试 → 构建打包 → 部署上线
```

### 环境变量配置

在 GitLab 项目的 `Settings > CI/CD > Variables` 中配置：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `DEPLOY_SERVER_HOST` | 服务器地址 | `192.168.1.100` |
| `DEPLOY_SERVER_USER` | SSH 用户名 | `deploy` |
| `DEPLOY_SERVER_PATH` | 部署目录 | `/opt/electron-react-web` |
| `DEPLOY_SSH_PRIVATE_KEY` | SSH 私钥 | `-----BEGIN RSA PRIVATE KEY-----...` |

### 服务器准备

```bash
# 1. 安装 Docker
sudo apt install -y docker.io
sudo systemctl start docker

# 2. 创建部署用户
sudo useradd -m deploy
sudo usermod -aG docker deploy

# 3. 创建部署目录
sudo mkdir -p /opt/electron-react-web
sudo chown deploy:deploy /opt/electron-react-web

# 4. 配置 SSH 免密登录
# 将 GitLab CI 的公钥添加到 ~/.ssh/authorized_keys
```

### 执行部署

**支持的分支/标签**:
- `master` - 主分支部署
- `release/*` - 发布分支（如 `release/v1.0.0`）
- `tags` - Git 标签（如 `v1.0.0`）

```bash
# 方式一: 推送到 master 分支
git push origin master

# 方式二: 推送到 release 分支
git push origin release/v1.0.0

# 方式三: 创建并推送标签
git tag v1.0.0
git push origin v1.0.0

# 等待 Pipeline 完成构建

# 在 GitLab 中手动触发部署
# CI/CD > Pipelines > 点击 deploy ▶️
```

### 热更新部署（零停机）

热更新只需更新静态资源，无需重启容器：

```bash
# 1. 从 GitLab Artifacts 下载静态资源包
# CI/CD > Pipelines > 下载 static_assets_<hash>.tar.gz

# 2. 上传到服务器
scp static_assets_*.tar.gz deploy@your-server.com:/opt/electron-react-web/

# 3. SSH 到服务器执行热更新
ssh deploy@your-server.com
cd /opt/electron-react-web
tar -xzf static_assets_*.tar.gz

# 复制新资源到容器
docker cp dist/. electron-react-web:/usr/share/nginx/html/
docker cp version.html electron-react-web:/usr/share/nginx/html/

# 重载 Nginx（不重启）
docker exec electron-react-web nginx -s reload

# 清理临时文件
rm -rf dist version.html static_assets_*.tar.gz
```

### 部署包说明

Pipeline 会生成两个文件：

1. **electron-react-web_<hash>_<timestamp>.tar.gz**
   完整部署包，包含 Docker 镜像和管理脚本

2. **static_assets_<hash>.tar.gz**
   静态资源包，仅包含 dist/ 和 version.html，用于热更新

### 回滚机制

```bash
# 查看历史部署包（自动保留最近3个）
ls -lt /opt/electron-react-web/electron-react-web_*.tar.gz

# 解压旧版本并部署
tar -xzf electron-react-web_<old-hash>_*.tar.gz
cd electron_react_web
docker load -i electron-react-web_*.tar
./manage.sh restart
```

### CI/CD 特性

- ✅ 自动化测试和代码检查
- ✅ 自动构建 Docker 镜像
- ✅ 支持完整部署和热更新
- ✅ 自动清理旧版本（保留3个）
- ✅ 版本信息可追溯
- ✅ 手动触发确保安全

**完整 CI/CD 文档**: 查看项目根目录 README.md 的 "CI/CD 自动化部署" 章节
