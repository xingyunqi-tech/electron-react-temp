---
name: page-assembler
description: 页面拼装器，将组件、Store、API 组装为完整的页面
---

# Page Assembler - 页面拼装器

## 功能概述
将已生成的组件、Store 和 API 组装为完整的页面，包括数据流、事件处理和路由集成。

## 使用方式
```bash
/page-assembler <page-path> [--with-skeleton] [--with-pagination]

# 示例
/page-assembler src/views/UserManagement/index.tsx
/page-assembler src/views/OrderList/index.tsx --with-pagination
```

## 参数说明
| 参数 | 说明 |
|------|------|
| `<page-path>` | 页面文件路径 |
| `--with-skeleton` | 添加骨架屏加载 |
| `--with-pagination` | 添加分页逻辑 |

## 执行流程

### Phase 1: 分析依赖
1. 扫描页面目录下的 components/
2. 匹配对应的 Store 模块
3. 识别需要的 API

### Phase 2: 组装页面
1. 导入所有依赖
2. 连接 Redux Store (dispatch + selectors)
3. 实现数据获取逻辑 (useEffect)
4. 绑定事件处理 (useCallback)
5. 组合子组件

### Phase 3: 生成代码

```typescript
// 生成的页面结构
import React, { useState, useEffect, useCallback } from 'react';
import { Button, Space, message } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchListAction, listSelector, loadingSelector } from '@/store/modules/feature';
import FeatureTable from './components/FeatureTable';
import FeatureForm from './components/FeatureForm';
import styles from './index.module.scss';

const FeaturePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const list = useAppSelector(listSelector);
  const loading = useAppSelector(loadingSelector);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchListAction({ page: 1, size: 10 }));
  }, [dispatch]);

  const handleCreate = useCallback(() => setFormVisible(true), []);

  return (
    <div className={styles.container}>
      <Space className={styles.toolbar}>
        <Button type="primary" onClick={handleCreate}>新建</Button>
      </Space>
      <FeatureTable data={list} loading={loading} />
      <FeatureForm visible={formVisible} onClose={() => setFormVisible(false)} />
    </div>
  );
};

export default FeaturePage;
```

## 规范约束
- 页面组件放在 `src/views/{Name}/index.tsx`
- 页面级组件放在 `src/views/{Name}/components/`
- 参考 [component-development agent] 和 [store-development agent]
