import { Button, Card } from 'antd';
import React from 'react';
import { t } from '@/plugins/locale';

/**
 * [边界] 重复运行幂等性 + 已有 i18n import 合并
 *
 * 本文件「模拟已被 i18n 化过一次」的状态：顶部已有 `import { t } from '@/plugins/locale'`，
 * 且已有 t('views.demo.idempotent.*') 调用。再次对本文件跑 generate 时，期望：
 *   1. 不重复注入 import —— mergeNamedImport 幂等去重，顶部仍只有一行 import
 *   2. 不二次包裹已有 t(...) —— key 内无中文，不会被再次提取成 t(t(...))
 *   3. 仅提取下方「新增的未处理中文」并替换
 *
 * 验证点：diff 输出里 import 仍单行、已有 t() 原样保留、仅新增中文被替换。
 */
const IdempotentComponent: React.FC = () => {
  return (
    <Card title={t('views.demo.idempotent.cardTitle')}>
      {/* 已 i18n 化：应原样保留，不被二次处理 */}
      <p>{t('views.demo.idempotent.existingText')}</p>

      {/* 新增未处理中文：应被提取并替换为 t('...') */}
      <p>这是新增的未处理中文内容</p>
      <Button>新增的未处理按钮</Button>
    </Card>
  );
};

export default IdempotentComponent;
