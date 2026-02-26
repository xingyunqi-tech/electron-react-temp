import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Space, Spin } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store';
import { frontendConfigSelector, fetchFrontendConfigThunk, saveFrontendConfigThunk } from '@/store/modules/global';
import { frontendConfigSchema, mergeConfig } from '@/constants/frontendConfig';
import { message, modal } from '@/components/StaticFunction';
import ConfigEditor from '@/components/ConfigEditor';
import styles from './frontend.module.scss';

export default function SettingFrontend() {
  const dispatch = useAppDispatch();
  const storedConfig = useAppSelector(frontendConfigSelector);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 页面挂载时从服务端拉取最新配置
  useEffect(() => {
    dispatch(fetchFrontendConfigThunk()).finally(() => setLoading(false));
  }, [dispatch]);

  // 已保存的完整配置（store + 默认值深合并）
  const savedConfig = useMemo(() => mergeConfig(storedConfig), [storedConfig]);

  // 草稿状态：编辑时只改本地，点保存才写入 store
  const [draft, setDraft] = useState<Record<string, any>>(savedConfig);

  // 外部配置变化时同步草稿（如 fetch/reset 后）
  useEffect(() => {
    setDraft(savedConfig);
  }, [savedConfig]);

  // 是否有未保存的修改
  const isDirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(savedConfig), [draft, savedConfig]);

  const handleChange = useCallback((value: Record<string, any>) => {
    setDraft(value);
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await dispatch(saveFrontendConfigThunk(draft)).unwrap();
      message.success('配置已保存');
    } catch {
      message.error('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  }, [dispatch, draft]);

  const handleReset = useCallback(() => {
    modal.confirm({
      title: '恢复默认配置',
      content: '确定要恢复默认配置吗？所有自定义修改将丢失。',
      centered: true,
      onOk: async () => {
        try {
          await dispatch(saveFrontendConfigThunk({})).unwrap();
          message.success('已恢复默认配置');
        } catch {
          message.error('重置失败，请重试');
        }
      },
    });
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <Card
        title="前端配置"
        extra={
          <Space>
            <Button type="primary" disabled={!isDirty} loading={saving} onClick={handleSave}>
              保存配置
            </Button>
            <Button danger onClick={handleReset}>
              恢复默认
            </Button>
          </Space>
        }
      >
        <Spin spinning={loading}>
          <ConfigEditor schema={frontendConfigSchema} value={draft} onChange={handleChange} />
        </Spin>
      </Card>
    </div>
  );
}
