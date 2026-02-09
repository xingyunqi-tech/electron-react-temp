import path from 'node:path';
import UnoCSS from 'unocss/vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { rmSync } from 'node:fs';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import type { PluginOption } from 'vite';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import { devServer } from './config/devServer';
import pkg from './package.json';
import { VueMcp } from 'vite-plugin-vue-mcp';
import AutoImport from 'unplugin-auto-import/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
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

function generatePlugins(mode: string): PluginOption[] {
  const isServe = mode === 'serve';
  const isBuild = mode === 'build';
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;

  const plugins: PluginOption[] = [
    UnoCSS(),
    vue(),
    vueJsx(),
    VueMcp(),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        // 自动导入图标组件
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep'],
        }),
      ],
    }),
    Icons({
      autoInstall: true,
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
              external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
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
              external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
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
        verbose: true, // 是否在控制台输出压缩结果
        disable: false, // 是否禁用压缩
        threshold: 10240, // 体积大于阈值时才会被压缩，单位为 b，默认为 10kb
        algorithm: 'gzip', // 压缩算法
        ext: '.gz', // 生成的压缩包后缀
        deleteOriginFile: false, // 是否删除原文件
      }),
    );

    if (process.env.VITE_UPLOAD_TO_SENTRY) {
      plugins.push(
        // 上传到sentry平台
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
        // 打包产物分析
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
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  rmSync('dist-electron', { recursive: true, force: true });

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
        scss: {
          // 配置全局scss
          // additionalData: '@use "@/styles/index.scss" as *;',
        },
      },
      devSourcemap: true, // 开发环境启用sourcemap
    },
    /** 构建配置 */
    build: {
      sourcemap: true, // 生成 sourcemap
      assetsInlineLimit: 4 * 1024, // 内联资源限制
      outDir: 'dist', // 打包目录名称
      assetsDir: 'static/assets', // 资源目录名称
      cssCodeSplit: true, // CSS 代码分割
      rollupOptions: {
        output: {
          experimentalMinChunkSize: 100 * 1024, // 最小拆分大小
          manualChunks: {
            'utils-vendor': ['lodash-es', 'dayjs', 'axios'],
            'vue-vendor': ['vue', 'vue-router', 'vue-i18n', 'pinia', 'pinia-plugin-persistedstate'],
          },
          entryFileNames: `static/js/[name].[hash].js`, // 入口文件名称
          chunkFileNames: `static/js/[name].[hash].js`, // 分块文件名称
          assetFileNames: ({ names }) => {
            // 资源文件名称
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
