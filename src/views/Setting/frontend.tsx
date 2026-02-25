import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Space } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store';
import { frontendConfigSelector, setFrontendConfigAction, resetFrontendConfigAction } from '@/store/modules/global';
import { frontendConfigSchema, mergeConfig } from '@/constants/frontendConfig';
import { message, modal } from '@/components/StaticFunction';
import ConfigEditor from '@/components/ConfigEditor';
import styles from './frontend.module.scss';

export default function SettingFrontend() {
  const dispatch = useAppDispatch();
  const storedConfig = useAppSelector(frontendConfigSelector);

  // 已保存的完整配置（store + 默认值深合并）
  const savedConfig = useMemo(() => mergeConfig(storedConfig), [storedConfig]);

  // 草稿状态：编辑时只改本地，点保存才写入 store
  const [draft, setDraft] = useState<Record<string, any>>(savedConfig);

  // 外部配置变化时同步草稿（如重置后）
  useEffect(() => {
    setDraft(savedConfig);
  }, [savedConfig]);

  // 是否有未保存的修改
  const isDirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(savedConfig), [draft, savedConfig]);

  const handleChange = useCallback((value: Record<string, any>) => {
    setDraft(value);
  }, []);

  const handleSave = useCallback(() => {
    dispatch(setFrontendConfigAction(draft));
    message.success('配置已保存');
  }, [dispatch, draft]);

  const handleReset = useCallback(() => {
    modal.confirm({
      title: '恢复默认配置',
      content: '确定要恢复默认配置吗？所有自定义修改将丢失。',
      centered: true,
      onOk: () => {
        dispatch(resetFrontendConfigAction());
        message.success('已恢复默认配置');
      },
    });
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <Card
        title="前端配置"
        extra={
          <Space>
            <Button type="primary" disabled={!isDirty} onClick={handleSave}>
              保存配置
            </Button>
            <Button danger onClick={handleReset}>
              恢复默认
            </Button>
          </Space>
        }
      >
        <ConfigEditor schema={frontendConfigSchema} value={draft} onChange={handleChange} />
      </Card>
    </div>
  );
}
