---
name: api-generator
description: 自定义 API 生成器，处理 Orval 无法覆盖的 20% 场景 (文件上传/下载、WebSocket 等)
---

# API Generator - 自定义 API 生成器

## 功能概述
为 Orval 无法自动生成的 API 场景生成自定义 API 函数。适用于文件上传/下载、WebSocket、外部 API 调用等。

## 使用方式
```bash
/api-generator <functionName> [--type upload|download|websocket|external|override]

# 示例
/api-generator uploadFile --type upload
/api-generator downloadReport --type download
/api-generator connectChat --type websocket
/api-generator getWeather --type external
/api-generator loginWithEncrypt --type override
```

## 参数说明
| 参数 | 说明 |
|------|------|
| `--type upload` | 文件上传 (multipart/form-data) |
| `--type download` | 文件下载 (blob) |
| `--type websocket` | WebSocket 连接 |
| `--type external` | 外部第三方 API |
| `--type override` | 覆盖 Orval 生成的 API |

## 生成位置
所有自定义 API 生成到 `src/api/custom/` 目录。

## 模板

### Upload

```typescript
// src/api/custom/upload.ts
import { customMutator } from '../core/mutator';

export const uploadFile = async (
  file: File,
  onProgress?: (percent: number) => void,
) => {
  const formData = new FormData();
  formData.append('file', file);

  return customMutator({
    url: '/upload',
    method: 'POST',
    data: formData,
    instance: 'upload',
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      onProgress?.(Math.round((e.loaded / (e.total || 1)) * 100));
    },
  });
};
```

### Download

```typescript
// src/api/custom/download.ts
import { customMutator } from '../core/mutator';

export const downloadReport = async (id: string) => {
  const response = await customMutator({
    url: `/report/${id}/download`,
    method: 'GET',
    instance: 'download',
    responseType: 'blob',
  });

  // 触发浏览器下载
  const url = URL.createObjectURL(response.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = `report-${id}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
};
```

### External

```typescript
// src/api/custom/external.ts
import { customMutator } from '../core/mutator';

export const getWeather = async (city: string) => {
  return customMutator({
    url: `https://api.weather.com/v1/${city}`,
    method: 'GET',
    instance: 'external',
  });
};
```

### Override

```typescript
// src/api/custom/override.ts
import { customMutator } from '../core/mutator';
import { encrypt } from '@/utils/crypto';

// 覆盖 Orval 生成的登录 API，添加密码加密
export const loginWithPhone = async (params: { phone: string; password: string }) => {
  return customMutator({
    url: '/auth/login',
    method: 'POST',
    data: { ...params, password: encrypt(params.password) },
  });
};
```

## 导出步骤
生成后需在 `src/api/index.ts` 中添加导出:

```typescript
export * from './custom/upload';
export * from './custom/download';
```

## 规范约束
- 所有自定义 API 放在 `src/api/custom/` 目录
- 使用 `customMutator` 统一发送请求
- 指定正确的 HTTP 实例 (default/upload/download/external)
- 参考 [api-development agent]
