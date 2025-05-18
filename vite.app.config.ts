import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@assets': path.resolve(__dirname, './client/src/assets'),
      '@components': path.resolve(__dirname, './client/src/components'),
      '@hooks': path.resolve(__dirname, './client/src/hooks'),
      '@lib': path.resolve(__dirname, './client/src/lib'),
      '@pages': path.resolve(__dirname, './client/src/pages'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
});