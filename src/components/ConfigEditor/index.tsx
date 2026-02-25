import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Radio } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import { useAppSelector } from '@/store';
import { currentThemeSelector } from '@/store/modules/global';
import { message } from '@/components/StaticFunction';
import type { JsonSchema } from '@/constants/frontendConfig';
import SchemaForm from './SchemaForm';

type EditMode = 'visual' | 'code';

interface ConfigEditorProps {
  schema: Record<string, JsonSchema>;
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
}

/**
 * 配置编辑器
 * 支持可视表单模式和 JSON 代码编辑模式
 */
export default function ConfigEditor({ schema, value, onChange }: ConfigEditorProps) {
  const currentTheme = useAppSelector(currentThemeSelector);
  const [editMode, setEditMode] = useState<EditMode>('visual');
  const [jsonText, setJsonText] = useState('');
  const skipSyncRef = useRef(false);

  // 外部 value 变化时同步到 JSON 文本（跳过内部编辑触发的更新，避免光标跳动）
  useEffect(() => {
    if (skipSyncRef.current) {
      skipSyncRef.current = false;
      return;
    }
    setJsonText(JSON.stringify(value, null, 2));
  }, [value]);

  // JSON 编辑变更（实时解析）
  const handleCodeChange = useCallback(
    (text: string) => {
      setJsonText(text);
      try {
        const parsed = JSON.parse(text);
        if (typeof parsed === 'object' && parsed !== null) {
          skipSyncRef.current = true;
          onChange(parsed);
        }
      } catch {
        // JSON 不合法时不触发更新
      }
    },
    [onChange],
  );

  // 切换模式时校验 JSON
  const handleModeChange = useCallback(
    (mode: EditMode) => {
      if (editMode === 'code' && mode === 'visual') {
        try {
          JSON.parse(jsonText);
        } catch {
          message.error('请先修正 JSON 格式错误');
          return;
        }
      }
      if (mode === 'code') {
        setJsonText(JSON.stringify(value, null, 2));
      }
      setEditMode(mode);
    },
    [editMode, jsonText, value],
  );

  const codeExtensions = useMemo(() => [json()], []);

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Radio.Group value={editMode} onChange={e => handleModeChange(e.target.value)} buttonStyle="solid" size="small">
          <Radio.Button value="visual">可视模式</Radio.Button>
          <Radio.Button value="code">编辑模式</Radio.Button>
        </Radio.Group>
      </div>

      {editMode === 'visual' ? (
        <SchemaForm schema={schema} value={value} onChange={onChange} />
      ) : (
        <CodeMirror
          value={jsonText}
          extensions={codeExtensions}
          theme={currentTheme === 'dark' ? oneDark : undefined}
          onChange={handleCodeChange}
          height="calc(100vh - 320px)"
          style={{ borderRadius: 4, overflow: 'hidden' }}
        />
      )}
    </div>
  );
}
