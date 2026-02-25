import { useCallback } from 'react';
import dayjs from 'dayjs';
import {
  Checkbox,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Rate,
  Switch,
  Select,
  Slider,
  TimePicker,
  Card,
  Col,
  Row,
  Upload,
  Button,
  Image,
  Space,
} from 'antd';
import { UploadOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { extractDefaults, type JsonSchema, type IObjectSchema, type IStringSchema } from '@/constants/frontendConfig';
import { message } from '@/components/StaticFunction';

/** 上传文件大小限制：5MB */
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

interface SchemaFieldsProps {
  schema: Record<string, JsonSchema>;
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  disabled?: boolean;
}

/**
 * 内部字段渲染（不包含 <Form>，可安全递归嵌套）
 */
function SchemaFields({ schema, value, onChange, disabled }: SchemaFieldsProps) {
  const handleFieldChange = (key: string, fieldValue: any) => {
    onChange({ ...value, [key]: fieldValue });
  };

  const renderField = useCallback(
    (fieldSchema: JsonSchema, fieldValue: any, onFieldChange: (v: any) => void) => {
      switch (fieldSchema.type) {
        case 'string': {
          if (fieldSchema.enumType && fieldSchema.inputType === 'radio') {
            return (
              <Radio.Group
                value={fieldValue}
                onChange={e => onFieldChange(e.target.value)}
                disabled={disabled}
                optionType="button"
                buttonStyle="solid"
                options={fieldSchema.enumType.map(v => ({ value: v, label: v }))}
              />
            );
          }
          if (fieldSchema.enumType) {
            return (
              <Select
                value={fieldValue}
                onChange={onFieldChange}
                disabled={disabled}
                options={fieldSchema.enumType.map(v => ({ value: v, label: v }))}
                style={{ width: '100%' }}
              />
            );
          }
          if (fieldSchema.inputType === 'textarea') {
            return (
              <Input.TextArea
                value={fieldValue}
                onChange={e => onFieldChange(e.target.value)}
                disabled={disabled}
                rows={3}
              />
            );
          }
          if (fieldSchema.inputType === 'password') {
            return (
              <Input.Password value={fieldValue} onChange={e => onFieldChange(e.target.value)} disabled={disabled} />
            );
          }
          if (fieldSchema.inputType === 'color') {
            return (
              <ColorPicker
                value={fieldValue || undefined}
                onChange={(_, hex) => onFieldChange(hex)}
                disabled={disabled}
                showText
              />
            );
          }
          if (fieldSchema.inputType === 'image') {
            return (
              <div>
                {fieldValue && (
                  <Space style={{ marginBottom: 8 }}>
                    <Image src={fieldValue} width={80} height={80} style={{ objectFit: 'cover', borderRadius: 4 }} />
                    <Button
                      icon={<DeleteOutlined />}
                      size="small"
                      danger
                      disabled={disabled}
                      onClick={() => onFieldChange('')}
                    />
                  </Space>
                )}
                <Upload
                  accept={(fieldSchema as IStringSchema).accept || 'image/*'}
                  showUploadList={false}
                  disabled={disabled}
                  beforeUpload={file => {
                    if (file.size > MAX_UPLOAD_SIZE) {
                      message.error(`文件大小不能超过 ${MAX_UPLOAD_SIZE / 1024 / 1024}MB`);
                      return false;
                    }
                    const reader = new FileReader();
                    reader.onload = e => onFieldChange(e.target?.result as string);
                    reader.readAsDataURL(file);
                    return false;
                  }}
                >
                  <Button icon={<UploadOutlined />} disabled={disabled}>
                    选择图片
                  </Button>
                </Upload>
              </div>
            );
          }
          if (fieldSchema.inputType === 'file') {
            return (
              <div>
                {fieldValue && (
                  <Space style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--ant-color-text-secondary)' }}>已上传文件</span>
                    <Button
                      icon={<DeleteOutlined />}
                      size="small"
                      danger
                      disabled={disabled}
                      onClick={() => onFieldChange('')}
                    />
                  </Space>
                )}
                <Upload
                  accept={(fieldSchema as IStringSchema).accept}
                  showUploadList={false}
                  disabled={disabled}
                  beforeUpload={file => {
                    if (file.size > MAX_UPLOAD_SIZE) {
                      message.error(`文件大小不能超过 ${MAX_UPLOAD_SIZE / 1024 / 1024}MB`);
                      return false;
                    }
                    const reader = new FileReader();
                    reader.onload = e => onFieldChange(e.target?.result as string);
                    reader.readAsDataURL(file);
                    return false;
                  }}
                >
                  <Button icon={<UploadOutlined />} disabled={disabled}>
                    选择文件
                  </Button>
                </Upload>
              </div>
            );
          }
          if (fieldSchema.inputType === 'url') {
            return (
              <Input
                value={fieldValue}
                onChange={e => onFieldChange(e.target.value)}
                disabled={disabled}
                type="url"
                placeholder="https://"
              />
            );
          }
          if (fieldSchema.inputType === 'date') {
            return (
              <DatePicker
                value={fieldValue ? dayjs(fieldValue) : null}
                onChange={(_, dateStr) => onFieldChange(dateStr)}
                disabled={disabled}
                style={{ width: '100%' }}
              />
            );
          }
          if (fieldSchema.inputType === 'time') {
            return (
              <TimePicker
                value={fieldValue ? dayjs(fieldValue, 'HH:mm:ss') : null}
                onChange={(_, timeStr) => onFieldChange(timeStr)}
                disabled={disabled}
                style={{ width: '100%' }}
              />
            );
          }
          if (fieldSchema.inputType === 'datetime') {
            return (
              <DatePicker
                showTime
                value={fieldValue ? dayjs(fieldValue) : null}
                onChange={(_, dateStr) => onFieldChange(dateStr)}
                disabled={disabled}
                style={{ width: '100%' }}
              />
            );
          }
          if (fieldSchema.inputType === 'daterange') {
            const dates = fieldValue ? String(fieldValue).split(',') : [];
            return (
              <DatePicker.RangePicker
                value={dates.length === 2 && dates[0] ? [dayjs(dates[0]), dayjs(dates[1])] : null}
                onChange={(_, dateStrs) => onFieldChange(dateStrs.filter(Boolean).join(','))}
                disabled={disabled}
                style={{ width: '100%' }}
              />
            );
          }
          if (fieldSchema.inputType === 'datetimerange') {
            const dates = fieldValue ? String(fieldValue).split(',') : [];
            return (
              <DatePicker.RangePicker
                showTime
                value={dates.length === 2 && dates[0] ? [dayjs(dates[0]), dayjs(dates[1])] : null}
                onChange={(_, dateStrs) => onFieldChange(dateStrs.filter(Boolean).join(','))}
                disabled={disabled}
                style={{ width: '100%' }}
              />
            );
          }
          return <Input value={fieldValue} onChange={e => onFieldChange(e.target.value)} disabled={disabled} />;
        }

        case 'number': {
          if (fieldSchema.inputType === 'rate') {
            return (
              <Rate value={fieldValue} onChange={onFieldChange} disabled={disabled} count={fieldSchema.max ?? 5} />
            );
          }
          if (fieldSchema.inputType === 'slider') {
            return (
              <Slider
                value={fieldValue}
                onChange={onFieldChange}
                disabled={disabled}
                min={fieldSchema.min ?? 0}
                max={fieldSchema.max ?? 100}
                step={fieldSchema.step ?? 1}
              />
            );
          }
          return (
            <InputNumber
              value={fieldValue}
              onChange={v => onFieldChange(v ?? fieldSchema.defaultValue)}
              disabled={disabled}
              min={fieldSchema.min}
              max={fieldSchema.max}
              step={fieldSchema.step}
              style={{ width: '100%' }}
            />
          );
        }

        case 'boolean':
          return <Switch checked={fieldValue} onChange={onFieldChange} disabled={disabled} />;

        case 'array': {
          const { items } = fieldSchema;
          const list = (fieldValue || []) as any[];

          // 字符串数组 + 枚举 + 多选框组
          if (items.type === 'string' && fieldSchema.enumType && fieldSchema.inputType === 'checkbox') {
            return (
              <Checkbox.Group
                value={list}
                onChange={onFieldChange as any}
                disabled={disabled}
                options={fieldSchema.enumType.map(v => ({ value: v, label: v }))}
              />
            );
          }

          // 字符串数组 + 枚举 → 多选下拉
          if (items.type === 'string' && fieldSchema.enumType) {
            return (
              <Select
                mode="multiple"
                value={list}
                onChange={onFieldChange}
                disabled={disabled}
                options={fieldSchema.enumType.map(v => ({ value: v, label: v }))}
                style={{ width: '100%' }}
              />
            );
          }

          // 字符串数组 → 标签输入
          if (items.type === 'string') {
            return (
              <Select
                mode="tags"
                value={list}
                onChange={onFieldChange}
                disabled={disabled}
                tokenSeparators={[',']}
                style={{ width: '100%' }}
                placeholder="输入后回车添加"
              />
            );
          }

          // 数字/对象数组 → 动态列表
          const handleAdd = () => {
            const newItem =
              items.type === 'object'
                ? extractDefaults(items.properties)
                : items.type === 'number'
                  ? (items.defaultValue ?? 0)
                  : '';
            onFieldChange([...list, newItem]);
          };
          const handleRemove = (idx: number) => {
            onFieldChange(list.filter((_, i) => i !== idx));
          };
          const handleItemChange = (idx: number, v: any) => {
            const next = [...list];
            next[idx] = v;
            onFieldChange(next);
          };

          // 数字数组
          if (items.type === 'number') {
            return (
              <div>
                {list.map((item, idx) => (
                  <Space key={idx} style={{ display: 'flex', marginBottom: 8 }}>
                    <InputNumber
                      value={item}
                      onChange={v => handleItemChange(idx, v ?? 0)}
                      disabled={disabled}
                      min={items.min}
                      max={items.max}
                      step={items.step}
                    />
                    <Button
                      icon={<DeleteOutlined />}
                      size="small"
                      danger
                      disabled={disabled}
                      onClick={() => handleRemove(idx)}
                    />
                  </Space>
                ))}
                <Button type="dashed" onClick={handleAdd} disabled={disabled} block icon={<PlusOutlined />}>
                  添加
                </Button>
              </div>
            );
          }

          // 对象数组
          if (items.type === 'object') {
            return (
              <div>
                {list.map((item, idx) => (
                  <Card
                    key={idx}
                    size="small"
                    title={`${items.title} ${idx + 1}`}
                    extra={
                      <Button
                        icon={<DeleteOutlined />}
                        size="small"
                        type="text"
                        danger
                        disabled={disabled}
                        onClick={() => handleRemove(idx)}
                      />
                    }
                    style={{ marginBottom: 8 }}
                  >
                    <SchemaFields
                      schema={items.properties}
                      value={item || {}}
                      onChange={v => handleItemChange(idx, v)}
                      disabled={disabled}
                    />
                  </Card>
                ))}
                <Button type="dashed" onClick={handleAdd} disabled={disabled} block icon={<PlusOutlined />}>
                  添加{items.title}
                </Button>
              </div>
            );
          }

          return null;
        }

        case 'object':
          return (
            <SchemaFields
              schema={(fieldSchema as IObjectSchema).properties}
              value={fieldValue || {}}
              onChange={onFieldChange}
              disabled={disabled}
            />
          );

        default:
          return <Input value={String(fieldValue ?? '')} disabled />;
      }
    },
    [disabled],
  );

  return (
    <Row gutter={[16, 0]}>
      {Object.entries(schema).map(([key, fieldSchema]) => {
        const fieldValue = value[key] ?? (fieldSchema.type !== 'object' ? fieldSchema.defaultValue : undefined);
        const isBlock =
          fieldSchema.type === 'object' || (fieldSchema.type === 'array' && fieldSchema.items.type !== 'string');
        const span = fieldSchema.span ?? (isBlock ? 24 : 12);

        if (isBlock) {
          return (
            <Col span={span} key={key}>
              <Card title={fieldSchema.title} size="small" style={{ marginBottom: 16 }}>
                {fieldSchema.description && (
                  <p style={{ color: 'var(--ant-color-text-tertiary)', marginBottom: 12 }}>{fieldSchema.description}</p>
                )}
                {renderField(fieldSchema, fieldValue, v => handleFieldChange(key, v))}
              </Card>
            </Col>
          );
        }

        return (
          <Col span={span} key={key}>
            <Form.Item label={fieldSchema.title} tooltip={fieldSchema.description} style={{ marginBottom: 16 }}>
              {renderField(fieldSchema, fieldValue, v => handleFieldChange(key, v))}
            </Form.Item>
          </Col>
        );
      })}
    </Row>
  );
}

interface SchemaFormProps {
  schema: Record<string, JsonSchema>;
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  disabled?: boolean;
}

/**
 * Schema 驱动的表单组件
 * 根据 JSON Schema 自动生成 Ant Design 表单
 */
export default function SchemaForm({ schema, value, onChange, disabled }: SchemaFormProps) {
  return (
    <Form layout="vertical" size="middle">
      <SchemaFields schema={schema} value={value} onChange={onChange} disabled={disabled} />
    </Form>
  );
}
