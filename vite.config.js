import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react({ jsxRuntime: 'automatic', babel: { parserOpts: { plugins: ['jsx'] } } })],
  base: './',
  build: { outDir: 'dist' },
  esbuild: { charset: 'utf8' }
});
