import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jseslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import importPlugin from 'eslint-plugin-import-x';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ==================== 架构约束：Views 隔离 ====================

/**
 * 获取 src/views 下的所有页面目录，生成互相隔离的规则
 * 页面模块之间禁止互相引用，强制通过路由通信
 */
function createViewsIsolationZones(viewsDir) {
  try {
    const dirs = fs
      .readdirSync(path.resolve(viewsDir), { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    const zones = [];
    for (let i = 0; i < dirs.length; i++) {
      for (let j = 0; j < dirs.length; j++) {
        if (i !== j) {
          zones.push({
            target: `./src/views/${dirs[i]}/**/*`,
            from: `./src/views/${dirs[j]}/**/*`,
            message: `views/${dirs[i]} 不能引用 views/${dirs[j]}，页面间应通过路由通信`,
          });
        }
      }
    }
    return zones;
  } catch {
    return [];
  }
}

/**
 * views 只能被 router 和 views 自身引用
 * （views 内部可以引用同模块内文件，跨模块引用由 isolation zones 约束）
 */
function createViewsImportRestriction() {
  return {
    target: './src/!(router|views)/**/*',
    from: './src/views/**/*',
    message: 'views 目录只能被 router 引用',
  };
}

const viewsIsolationZones = createViewsIsolationZones(path.join(__dirname, 'src/views'));

export default [
  // ==================== 基础推荐配置 ====================
  jseslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,

  // ==================== 全局配置 ====================
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.app.json',
        },
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-namespace': 'off',
    },
  },

  // ==================== React Hooks 配置 ====================
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },

  // ==================== 架构约束规则 ====================
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    plugins: {
      'import-x': importPlugin,
    },
    rules: {
      'import-x/no-restricted-paths': [
        'error',
        {
          zones: [
            // views 页面间互相隔离
            ...viewsIsolationZones,
            // views 只能被 router 引用
            createViewsImportRestriction(),
          ],
        },
      ],
    },
  },

  // ==================== 生成文件配置 ====================
  {
    files: ['src/api/generated/**/*'],
    rules: {
      '@typescript-eslint/no-redeclare': 'off',
    },
  },

  // ==================== 忽略文件配置 ====================
  {
    ignores: [
      'dist/**/*',
      'dist-electron/**/*',
      'release/**/*',
      'node_modules/**/*',
      'public/**/*',
      'coverage/**/*',
      'playwright-report/**/*',
      '.i18n-tools/**/*',
    ],
  },
];
