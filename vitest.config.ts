import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  test: {
    // 测试环境配置
    environment: 'jsdom',
    // 全局API支持
    globals: true,
    // 测试文件匹配模式
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    // 排除文件
    exclude: ['node_modules', 'dist', 'dist-electron', '.idea', '.git', '.cache'],
    // 测试设置文件
    setupFiles: ['./tests/setup.ts'],
    // 服务器配置
    server: {
      deps: {
        // 内联以避免CSS导入问题
        inline: ['element-plus'],
      },
    },
    // 测试覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        'dist-electron/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
        '**/build/**',
        'deploy/',
        'scripts/',
        '.claude/',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
