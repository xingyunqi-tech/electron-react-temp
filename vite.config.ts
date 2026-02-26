import path from 'node:path';
import UnoCSS from 'unocss/vite';
import react from '@vitejs/plugin-react';
import { rmSync } from 'node:fs';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import type { PluginOption } from 'vite';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import { devServer } from './config/devServer';
import pkg from './package.json';
import AutoImport from 'unplugin-auto-import/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { codeInspectorPlugin } from 'code-inspector-plugin';
import mkcert from 'vite-plugin-mkcert';
import legacy from '@vitejs/plugin-legacy';
import viteCompression from 'vite-plugin-compression';
import { sentryVitePlugin } from '@sentry/vite-plugin';

/**
 * 现代浏览器兼容性填充
 */
const modernLegacyPolyfills = [
  'core-js/es/array/at',
  'core-js/es/array/find-last',
  'core-js/es/array/find-last-index',
  'core-js/es/array/to-reversed',
  'core-js/es/array/to-sorted',
  'core-js/es/array/to-spliced',
  'core-js/es/typed-array/at',
  'core-js/es/typed-array/find-last',
  'core-js/es/typed-array/find-last-index',
  'core-js/es/typed-array/to-reversed',
  'core-js/es/typed-array/to-sorted',
  'core-js/es/string/replace-all',
  'core-js/es/object/has-own',
  'core-js/es/promise/any',
];

/**
 * 生成插件
 * @param mode - 模式
 * @returns 插件
 */
// ESM-only packages used in main/preload process — must be bundled, not externalized
const esmDeps = ['electron-store'];

function generatePlugins(mode: string): PluginOption[] {
  const isServe = mode === 'serve';
  const isBuild = mode === 'build';
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;

  const plugins: PluginOption[] = [
    UnoCSS(),
    react(),
    AutoImport({
      resolvers: [
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
    }),
    Icons({
      autoInstall: true,
      compiler: 'jsx',
    }),
    codeInspectorPlugin({
      bundler: 'vite',
    }),
    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: 'electron/main/index.ts',
        onstart(options) {
          if (process.env.VSCODE_DEBUG) {
            console.log(/* For `.vscode/.debug.script.mjs` */ '[startup] Electron App');
          } else {
            options.startup();
          }
        },
        vite: {
          build: {
            sourcemap,
            minify: isBuild,
            outDir: 'dist-electron/main',
            rollupOptions: {
              external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}).filter(
                dep => !esmDeps.includes(dep),
              ),
            },
          },
        },
      },
      {
        entry: 'electron/preload/index.ts',
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
          // instead of restarting the entire Electron App.
          options.reload();
        },
        vite: {
          build: {
            sourcemap: sourcemap ? 'inline' : undefined, // #332
            minify: isBuild,
            outDir: 'dist-electron/preload',
            rollupOptions: {
              external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}).filter(
                dep => !esmDeps.includes(dep),
              ),
            },
          },
        },
      },
    ]),
    // Use Node.js API in the Renderer-process
    renderer(),
  ];

  if (isBuild) {
    plugins.push(
      legacy({
        targets: ['defaults', 'not IE 11'],
        additionalLegacyPolyfills: modernLegacyPolyfills,
        additionalModernPolyfills: modernLegacyPolyfills,
      }),
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
        deleteOriginFile: false,
      }),
    );

    if (process.env.VITE_UPLOAD_TO_SENTRY) {
      plugins.push(
        sentryVitePlugin({
          org: process.env.VITE_SENTRY_ORG,
          project: process.env.VITE_SENTRY_PROJECT,
          authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
          telemetry: false,
        }),
      );
    }
    if (process.env.VITE_ENABLE_ANALYZER) {
      plugins.push(
        visualizer({
          title: 'Vite Bundle Visualizer',
          open: true,
          brotliSize: true,
          gzipSize: true,
          sourcemap: false,
          template: 'treemap',
          filename: 'dist/analyzer.html',
        }),
      );
    }
  } else {
    if (process.env.VITE_ENABLE_HTTPS) {
      plugins.push(mkcert());
    }
  }

  return plugins;
}

export default ({ mode }: { mode: string }) => {
  const isBuild = mode === 'build';
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  if (isBuild) {
    rmSync('dist-electron', { recursive: true, force: true });
  }

  return defineConfig({
    /** 开发服务器配置 */
    server: devServer(),
    /** 插件配置 */
    plugins: generatePlugins(mode),
    /** 路径别名配置 */
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    /** css配置 */
    css: {
      preprocessorOptions: {
        /** 配置全局scss */
        scss: {
          // additionalData: '@use "@/styles/index.scss" as *;',
        },
      },
      /** 开发环境启用sourcemap */
      devSourcemap: true,
    },
    /** 构建配置 */
    build: {
      /** 生产环境开启sourcemap */
      sourcemap: true,
      /** 内联资源限制 */
      assetsInlineLimit: 4 * 1024,
      /** 打包目录名称 */
      outDir: 'dist',
      /** 资源目录名称 */
      assetsDir: 'static/assets',
      /** CSS开启代码分割 */
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          /** 最小拆分大小 */
          experimentalMinChunkSize: 100 * 1024,
          /** 手动拆分chunks */
          manualChunks: {
            'utils-vendor': ['lodash-es', 'dayjs', 'axios'],
            'react-vendor': ['react', 'react-dom', 'react-router-dom', '@reduxjs/toolkit', 'react-redux'],
          },
          /** 入口文件名称 */
          entryFileNames: `static/js/[name].[hash].js`,
          /** 分块文件名称 */
          chunkFileNames: `static/js/[name].[hash].js`,
          /** 资源文件名称 */
          assetFileNames: ({ names }) => {
            const fileName = names?.[0] ?? '';
            if (/\.(css)$/.test(fileName)) {
              return 'static/css/[name].[hash].[ext]';
            }
            if (/\.(woff|woff2|eot|ttf|otf)$/.test(fileName)) {
              return 'static/fonts/[name].[hash].[ext]';
            }
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(fileName)) {
              return 'static/img/[name].[hash].[ext]';
            }
            return 'static/assets/[name].[hash].[ext]';
          },
        },
      },
    },
    clearScreen: false,
  });
};
