import { defineConfig, presetWind3, presetAttributify } from 'unocss';
import transformerDirectives from '@unocss/transformer-directives';

export default defineConfig({
  presets: [presetWind3(), presetAttributify()],
  transformers: [transformerDirectives()],
  content: {
    filesystem: ['./src/**/*.{vue,ts,tsx}', './index.html'],
  },
  theme: {
    colors: {},
  },
  safelist: [],
});
