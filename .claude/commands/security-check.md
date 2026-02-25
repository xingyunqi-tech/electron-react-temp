---
description: 安全检查清单 - OWASP Top 10 前端安全
---

# 安全检查清单

## 1. XSS (跨站脚本攻击)

- [ ] 不使用 `dangerouslySetInnerHTML` (必须时用 DOMPurify)
- [ ] 用户输入经过转义
- [ ] URL 参数经过验证
- [ ] React 默认转义 JSX 中的值 (保持使用 `{}`)

```typescript
// ✅ 安全
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />

// ❌ 危险
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

## 2. 认证安全

- [ ] Token 存储在合适位置 (localStorage + HttpOnly Cookie)
- [ ] Token 有过期机制
- [ ] 密码传输前加密
- [ ] 登出时清除所有凭据

## 3. 数据暴露

- [ ] 无硬编码的 API Key、Token、密码
- [ ] `.env` 文件在 `.gitignore` 中
- [ ] 敏感信息不在前端日志中
- [ ] 生产环境关闭 Source Map (或上传到 Sentry)

## 4. CSRF (跨站请求伪造)

- [ ] API 请求携带 CSRF Token (如适用)
- [ ] 使用 SameSite Cookie 属性

## 5. CORS

- [ ] API 代理配置正确 (Nginx/Vite proxy)
- [ ] 不使用 `*` 通配符 CORS

## 6. Electron 安全

- [ ] `contextIsolation: true`
- [ ] `nodeIntegration: false`
- [ ] IPC 通道白名单
- [ ] 主进程验证来自渲染进程的输入
- [ ] 不加载远程模块

## 7. 依赖安全

```bash
pnpm audit              # 检查依赖漏洞
```

- [ ] 定期更新依赖
- [ ] 不使用已知有漏洞的包

## 8. 环境变量

- [ ] `VITE_` 前缀的变量不含敏感信息 (会打包到前端)
- [ ] 服务端密钥不通过前端环境变量传递

## 安全工具

```bash
pnpm audit              # 依赖漏洞扫描
pnpm lint               # 代码规范检查 (含部分安全规则)
```
