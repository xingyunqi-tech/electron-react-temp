import { merge } from 'lodash-es';

/**
 * 前端配置 JSON Schema 类型定义
 */
export interface IBaseSchema {
  title: string;
  description?: string;
  /** 栅格占比 1-24，默认: 基础类型 12，object 24 */
  span?: number;
}

/** 字符串类型 */
export interface IStringSchema extends IBaseSchema {
  type: 'string';
  /** text | password | textarea | color | url | image | file | date | time | datetime | daterange | datetimerange | radio | i18n */
  inputType?:
    | 'text'
    | 'password'
    | 'textarea'
    | 'color'
    | 'url'
    | 'image'
    | 'file'
    | 'date'
    | 'time'
    | 'datetime'
    | 'daterange'
    | 'datetimerange'
    | 'radio'
    | 'i18n';
  /** 上传文件的 accept 属性，仅 image/file 类型有效 */
  accept?: string;
  /** 提供枚举值时渲染为下拉选择器或单选按钮组（配合 inputType: 'radio'） */
  enumType?: readonly string[];
  /** i18n 类型时为 Record<LocaleKey, string>，其他为 string */
  defaultValue?: string | Record<string, string>;
}

/** 数字类型 */
export interface INumberSchema extends IBaseSchema {
  type: 'number';
  /** input: 数字输入框 | slider: 滑块 | rate: 评分 */
  inputType?: 'input' | 'slider' | 'rate';
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
}

/** 布尔类型 */
export interface IBooleanSchema extends IBaseSchema {
  type: 'boolean';
  defaultValue?: boolean;
}

/** 数组类型 */
export interface IArraySchema extends IBaseSchema {
  type: 'array';
  /** 数组元素的 schema 定义 */
  items: JsonSchema;
  /** 仅 string 元素有效：提供枚举值时渲染为多选下拉，否则为标签输入 */
  enumType?: readonly string[];
  /** checkbox: 枚举多选时渲染为多选框组 */
  inputType?: 'checkbox';
  defaultValue?: readonly any[];
}

/** 对象类型（嵌套子表单） */
export interface IObjectSchema extends IBaseSchema {
  type: 'object';
  properties: Record<string, JsonSchema>;
}

export type JsonSchema = IStringSchema | INumberSchema | IBooleanSchema | IArraySchema | IObjectSchema;

/** 从 Schema 推导 TypeScript 值类型 */
export type InferValue<T> = T extends { type: infer Type }
  ? Type extends 'string'
    ? T extends { inputType: 'i18n' }
      ? Record<string, string>
      : string
    : Type extends 'number'
      ? number
      : Type extends 'boolean'
        ? boolean
        : Type extends 'array'
          ? T extends { items: infer I }
            ? Array<InferValue<I>>
            : never
          : Type extends 'object'
            ? T extends { properties: infer P }
              ? { [K in keyof P]: InferValue<P[K]> }
              : never
            : never
  : never;

/**
 * 从 Schema 提取默认值
 */
export function extractDefaults<T extends Record<string, JsonSchema>>(schema: T): { [K in keyof T]: InferValue<T[K]> } {
  const result: Record<string, any> = {};
  for (const [key, s] of Object.entries(schema)) {
    if (s.type === 'object') {
      result[key] = extractDefaults(s.properties);
    } else {
      result[key] = s.defaultValue;
    }
  }
  return result as { [K in keyof T]: InferValue<T[K]> };
}

// ============================================================
// 前端配置 Schema
// ============================================================

export const frontendConfigSchema = {
  // ==================== 基础配置 ====================
  basic: {
    type: 'object',
    title: '基础配置',
    properties: {
      systemTitle: {
        type: 'string',
        title: '系统标题',
        description: '显示在头部和浏览器标签页的系统名称，支持多语言配置',
        inputType: 'i18n',
        defaultValue: { 'zh-CN': '管理系统', 'en-US': 'Management System' },
      },
      defaultPage: {
        type: 'string',
        title: '默认页面',
        description: '登录后默认跳转的页面路径',
        defaultValue: '/home',
      },
      defaultLanguage: {
        type: 'string',
        title: '默认语言',
        enumType: ['zh-CN', 'en-US'],
        defaultValue: 'zh-CN',
      },
      logoImage: {
        type: 'string',
        title: 'Logo',
        description: '上传系统 Logo 图片',
        inputType: 'image',
        accept: 'image/png,image/jpeg,image/svg+xml',
        defaultValue: '',
      },
    },
  },

  // ==================== 水印配置 ====================
  watermark: {
    type: 'object',
    title: '水印配置',
    properties: {
      enabled: {
        type: 'boolean',
        title: '启用水印',
        description: '是否在页面上显示水印',
        defaultValue: false,
      },
      content: {
        type: 'string',
        title: '水印内容',
        defaultValue: 'admin',
      },
      color: {
        type: 'string',
        title: '水印颜色',
        inputType: 'color',
        defaultValue: '#000000',
      },
      fontSize: {
        type: 'number',
        title: '字体大小',
        min: 10,
        max: 30,
        defaultValue: 14,
      },
      opacity: {
        type: 'number',
        title: '透明度',
        inputType: 'slider',
        min: 0,
        max: 1,
        step: 0.05,
        defaultValue: 1,
      },
      fontWeight: {
        type: 'string',
        title: '字重',
        enumType: ['normal', 'lighter', 'bold', 'bolder'],
        defaultValue: 'normal',
      },
      rotate: {
        type: 'number',
        title: '旋转角度',
        inputType: 'slider',
        min: -90,
        max: 90,
        step: 1,
        defaultValue: -22,
      },
      gapX: {
        type: 'number',
        title: '水平间距',
        description: '水印之间的水平间距 (px)',
        min: 20,
        max: 300,
        step: 10,
        defaultValue: 100,
      },
      gapY: {
        type: 'number',
        title: '垂直间距',
        description: '水印之间的垂直间距 (px)',
        min: 20,
        max: 300,
        step: 10,
        defaultValue: 100,
      },
    },
  },

  // ==================== Sentry 监控配置 ====================
  sentry: {
    type: 'object',
    title: 'Sentry 监控配置',
    description: '错误监控与性能追踪配置（需同时开启环境变量 VITE_ENABLE_SENTRY=true）',
    properties: {
      dsn: {
        type: 'string',
        title: 'DSN',
        description: 'Sentry 项目的 DSN 地址',
        inputType: 'url',
        defaultValue: 'https://6914505451e51547265bf2ffdf603f57@o4506822939508736.ingest.us.sentry.io/4510939975122944',
        span: 24,
      },
      release: {
        type: 'string',
        title: '版本号',
        description: '应用版本号，用于关联 Source Map',
        defaultValue: '1.0.0',
      },
      debug: {
        type: 'boolean',
        title: '调试模式',
        description: '启用后 Sentry SDK 会输出调试日志',
        defaultValue: false,
      },
      tracesSampleRate: {
        type: 'number',
        title: '跟踪采样率',
        description: '性能追踪采样比例 (0-1)，生产环境建议 0.1',
        inputType: 'slider',
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: 0.1,
      },
      replaysSessionSampleRate: {
        type: 'number',
        title: '会话重放采样率',
        description: '正常会话重放比例 (0-1)',
        inputType: 'slider',
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: 0.01,
      },
      replaysOnErrorSampleRate: {
        type: 'number',
        title: '错误重放采样率',
        description: '发生错误时的重放比例 (0-1)',
        inputType: 'slider',
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: 1.0,
      },
      enablePerformance: {
        type: 'boolean',
        title: '性能监控',
        description: '启用浏览器性能追踪',
        defaultValue: true,
      },
      enableReplay: {
        type: 'boolean',
        title: '会话重放',
        description: '启用会话录制与回放',
        defaultValue: true,
      },
      enableFeedback: {
        type: 'boolean',
        title: '用户反馈',
        description: '启用用户反馈组件',
        defaultValue: false,
      },
      enableRouterTracking: {
        type: 'boolean',
        title: '路由追踪',
        description: '记录路由切换事件',
        defaultValue: true,
      },
      enableStateTracking: {
        type: 'boolean',
        title: '状态追踪',
        description: '记录 Redux 状态变更',
        defaultValue: true,
      },
      sendDefaultPii: {
        type: 'boolean',
        title: '发送 PII',
        description: '是否发送用户个人身份信息',
        defaultValue: false,
      },
      maxBreadcrumbs: {
        type: 'number',
        title: '最大面包屑数',
        description: '保留的最大事件追踪条目数',
        min: 10,
        max: 500,
        step: 10,
        defaultValue: 100,
      },
    },
  },

  // ==================== 控件示例（实际项目中可删除） ====================
  _demo: {
    type: 'object',
    title: '控件类型示例',
    description: '展示 SchemaForm 支持的所有控件类型，实际项目中按需保留或删除',
    properties: {
      radio: {
        type: 'string',
        title: '单选按钮组',
        inputType: 'radio',
        enumType: ['compact', 'default', 'loose'],
        defaultValue: 'default',
      },
      password: { type: 'string', title: '密码输入', inputType: 'password', defaultValue: '' },
      textarea: { type: 'string', title: '多行文本', inputType: 'textarea', defaultValue: '', span: 24 },
      url: { type: 'string', title: 'URL 输入', inputType: 'url', defaultValue: '' },
      file: { type: 'string', title: '文件上传', inputType: 'file', accept: '.css,.json', defaultValue: '' },
      date: { type: 'string', title: '日期', inputType: 'date', defaultValue: '' },
      time: { type: 'string', title: '时间', inputType: 'time', defaultValue: '' },
      datetime: { type: 'string', title: '日期时间', inputType: 'datetime', defaultValue: '' },
      daterange: { type: 'string', title: '日期范围', inputType: 'daterange', defaultValue: '' },
      datetimerange: { type: 'string', title: '日期时间范围', inputType: 'datetimerange', defaultValue: '', span: 24 },
      rate: { type: 'number', title: '评分', inputType: 'rate', max: 5, defaultValue: 3 },
      checkbox: {
        type: 'array',
        title: '多选框组',
        items: { type: 'string', title: '选项' },
        inputType: 'checkbox',
        enumType: ['A', 'B', 'C', 'D'],
        defaultValue: ['A', 'C'],
      },
      tags: {
        type: 'array',
        title: '标签输入',
        description: '回车添加标签',
        items: { type: 'string', title: '标签' },
        defaultValue: [],
      },
      multiSelect: {
        type: 'array',
        title: '多选下拉',
        items: { type: 'string', title: '选项' },
        enumType: ['alpha', 'beta', 'gamma', 'delta'],
        defaultValue: ['alpha'],
      },
      numberArray: {
        type: 'array',
        title: '数字列表',
        items: { type: 'number', title: '数字', min: 0, max: 999 },
        defaultValue: [1, 2, 3],
      },
      objectArray: {
        type: 'array',
        title: '对象列表',
        items: {
          type: 'object',
          title: '条目',
          properties: {
            name: { type: 'string', title: '名称', defaultValue: '' },
            value: { type: 'number', title: '数值', defaultValue: 0 },
            enabled: { type: 'boolean', title: '启用', defaultValue: true },
          },
        },
        defaultValue: [],
      },
    },
  },
} as const satisfies Record<string, JsonSchema>;

/**
 * 默认前端配置
 */
export const defaultFrontendConfig = extractDefaults(frontendConfigSchema);

/** 前端配置类型（从 Schema 推导） */
export type FrontendConfig = typeof defaultFrontendConfig;

/** 全局配置单例（合并了默认值 + 自定义配置） */
export let config: FrontendConfig = { ...defaultFrontendConfig };

/** 深合并自定义配置到全局单例 */
export function mergeConfig(customConfig: Partial<FrontendConfig> = {}) {
  config = merge({}, defaultFrontendConfig, customConfig);
  return config;
}
