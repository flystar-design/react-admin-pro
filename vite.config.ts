import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import legacy from '@vitejs/plugin-legacy';
import { resolve } from 'node:path';

/**
 * 打包输出目录
 */
export const OUTPUT_DIR = 'dist';

// https://vitejs.dev/config/
export default defineConfig(() => {
  const root = process.cwd();
  return {
    plugins: [react(), legacy()],
    root: root,
    resolve: {
      alias: {
        '/@': resolve('./src')
      }
    },
    server: {
      host: true
    },
    build: {
      target: 'es2020',
      cssTarget: 'chrome61',
      outDir: OUTPUT_DIR,
      brotliSize: false,
      chunkSizeWarningLimit: 2000
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    },
    optimizeDeps: {
      include: ['lodash-es']
    }
  };
});
