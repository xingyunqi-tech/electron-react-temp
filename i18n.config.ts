import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from '@kit/i18n-tools';

// 工具用 jiti 以 ESM 方式加载本配置，ESM 下没有 __dirname，需从 import.meta.url 派生
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// =============================================================================
// @kit/i18n-tools 配置（React + react-i18next）
//
// 字段分组：
//   root        项目根（绝对路径），所有相对路径以此为基准
//   framework   框架 + i18n 库 + t 导入路径（判别 union）
//   locales     源 / 目标语种（targets 数组化以支持多目标）
//   io          目录 / 扫描 / 落盘
//   keys        i18n key 派生（前缀 + 兜底 + 复用）
//   glossary    翻译词表（可选）
//   llm         LLM API 与任务并发（idGeneration / translation 各自配置）
//
// 与运行时的衔接：
//   - tImport 指向项目自有的 '@/plugins/locale'（导出 t）
//   - localesDir 'src/locale' 与现有 zh-CN.json / en-US.json 一致
//   - exportDir 'public/locale' 是运行时 loadLocaleMessages 的加载来源
// =============================================================================

export default defineConfig({
  /** 项目根目录（绝对路径）。所有相对路径以此为基准。 */
  root: __dirname,

  // ---- 框架 ---------------------------------------------------------------
  /**
   * 框架配置。type='react' 与 type='vue' 是封闭判别 union，loader 会校验
   * library 与 type 是否匹配（防止 type='react' 误配 vue-i18n 这类错配）。
   */
  framework: {
    /** 框架类型：'react' | 'vue' */
    type: 'react',
    /** i18n 库：'react-i18next' | 'react-intl'。本项目使用 react-i18next。 */
    library: 'react-i18next',
    /**
     * t 函数的导入路径。工具会向被改写的 .ts/.tsx 文件注入
     * `import { t } from '<tImport>'`。这里指向项目自有的 '@/plugins/locale'
     * （非默认 '@/i18n'），与 src/plugins/locale.ts 的导出保持一致。
     */
    tImport: '@/plugins/locale',
    /** 命名空间（仅 react-i18next 的 ns 前缀场景需要；默认 'translation' 留空即可）。 */
    namespace: '',
  },

  // ---- 语言 ---------------------------------------------------------------
  /**
   * 语言配置。targets 是数组，支持多目标语种；翻译 / 词表 / 落盘流程对每个
   * target 单独处理。targets 不能包含 source。
   */
  locales: {
    /** 源语言（被提取、被翻译的原文语言）。 */
    source: 'zh-CN',
    /** 目标语言数组。如需多语种：['en-US', 'ja-JP', 'ko-KR']。 */
    targets: ['en-US'],
    // 可选：扩展 LLM prompt 中的语种展示名（覆盖内置 LOCALE_NAMES 表）
    // names: { 'zh-CN': 'Simplified Chinese', 'en-US': 'English' },
  },

  // ---- IO -----------------------------------------------------------------
  /** 所有目录 / 扫描 / 落盘相关字段聚合于此。 */
  io: {
    /** 源代码扫描根目录（相对 root）。 */
    sourceDir: 'src',
    /** 主语言文件工作目录（generate / merge 读写此目录），与现有 locale 文件一致。 */
    localesDir: 'src/locale',
    /**
     * export 模式的发布目录。运行时 loadLocaleMessages 从这里加载语言包。
     * 未配置时禁用 export 命令；automatic 流程会跳过 export 步骤。
     */
    exportDir: 'public/locale',
    // 可选：自定义译文 override 目录，仅在 CLI --custom 时启用。
    // customDir: 'src/locale-custom',

    /** 文件扫描 include glob（相对 root 匹配）。React 项目用 tsx/jsx/ts/js。 */
    include: ['**/*.tsx', '**/*.jsx', '**/*.ts', '**/*.js'],
    /**
     * 排除目录与文件：单段名（如 'node_modules'）走 literal 匹配，
     * 含 `*` / `?` 的模式走 picomatch glob 匹配。默认值已额外排除
     * *.config.* / 测试 / Storybook 等，这里再追加项目特有目录。
     */
    exclude: ['node_modules', 'dist', 'dist-electron', 'build', '.git', 'public', 'electron'],

    /**
     * 语言文件序列化格式：
     *   'flat'   : { "layout.systemTitle": "管理系统" }
     *   'nested' : { "layout": { "systemTitle": "管理系统" } } —— 要求 separator='.'
     * 本项目现有 locale 文件为嵌套结构，故用 'nested'。
     */
    format: 'nested',
    /** JSON 缩进字符数，默认 2。 */
    indent: 2,
    /** 转换后是否过 Prettier 美化，保持与项目格式一致。 */
    prettify: true,
  },

  // ---- Keys ---------------------------------------------------------------
  /** i18n key 的派生（前缀） + 兜底（fallback） + 复用（reuse）聚合于此。 */
  keys: {
    /** 段分隔符。'nested' 模式下必须为 '.'。 */
    separator: '.',
    /** 前缀派生策略（四选一：'path' | 'fixed' | 'custom' | 'rules'）。 */
    prefix: {
      /** 'path'：从 anchor 之后的目录段派生前缀（最常用）。 */
      strategy: 'path',
      /**
       * anchor 目录名，定位前缀起点。例（anchor='src'，无 skip/take）：
       *   src/views/Demo/index.tsx → ['views', 'demo']
       *   生成 key 形如 views.demo.xxx，与现有 layout.* 风格一致。
       */
      anchor: 'src',
      // 可选：跳过 anchor 之后前 N 段（剥离 views / pages 这类壳目录）
      // skip: 0,
      // 可选：保留 N 段（0 = 不限制）
      // take: 0,
      // 可选：把文件名（去扩展名）作为前缀最后一段
      // includeFile: false,
      // 可选：index.* 处理：'collapse-to-parent'（默认）将 Demo/index.tsx 折叠为 demo
      // indexFile: 'collapse-to-parent',
    },
    // 可选：语义部分兜底（LLM 失败 / --skip-llm 时使用）。
    // extend=true 时与内置 18 条常用词映射合并（确认 / 取消 / 删除 ...）。
    // fallback: {
    //   extend: true,
    //   mappings: { 自定义术语: 'customTerm' },
    // },
    // 可选：doctor 跳过的动态 key（避免 t(prefix + name) 误报 missing-key / orphan-key）
    // dynamicKeyAllowlist: ['layout.', /^views\.\w+\.dynamic/],
  },

  // ---- 词表（可选）-------------------------------------------------------
  /**
   * 命中条目直接采用词表译文，跳过 LLM 调用。适合品牌词、固定 UI 标签等高频术语。
   * 未配置 file 即禁用。多目标可按语言独立设译文：{ "提交": { "en-US": "Submit" } }。
   */
  // glossary: {
  //   file: 'src/locale/glossary.json',
  //   override: 'always',
  //   normalize: true,
  // },

  // ---- LLM ----------------------------------------------------------------
  /**
   * LLM 配置。shared 的字段作为 idGeneration / translation 的默认值，任务级可单独覆盖。
   * 本项目使用 DeepSeek（OpenAI 兼容）。API Key 从 .env 的 LLM_API_KEY 注入，不入仓库。
   */
  llm: {
    /** 共享基线：idGeneration / translation 未覆盖时使用这些值。 */
    shared: {
      /** API Key，从环境变量注入（见项目根 .env，已加入 .gitignore）。 */
      apiKey: process.env.LLM_API_KEY,
      /** 模型名。DeepSeek 通用对话模型。 */
      model: 'deepseek-chat',
      /** DeepSeek 的 OpenAI 兼容端点。 */
      baseURL: 'https://api.deepseek.com',
      /** 单次请求超时（毫秒），默认 60000。 */
      timeout: 60000,
      /** 失败最大重试次数，默认 2。 */
      maxRetries: 2,
      /** 采样温度，越低越稳定，默认 0.1。 */
      temperature: 0.1,
    },
    /** 语义化 ID 生成任务：可与翻译任务独立调优并发与批量。 */
    idGeneration: {
      /** 并发请求数，默认 5。 */
      concurrency: 5,
      /** 单批条目数，默认 30。 */
      batchSize: 30,
      /** 批次间最小间隔（毫秒），规避限流，默认 500。 */
      throttleMs: 500,
    },
    /** 翻译任务。 */
    translation: {
      concurrency: 5,
      batchSize: 30,
      throttleMs: 500,
    },
  },
});
