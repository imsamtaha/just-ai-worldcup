import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/just-ai-worldcup/' : '/',
  plugins: [react()],
  build: {
    sourcemap: true,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          return id.includes('node_modules/react') || id.includes('node_modules/react-dom') ? 'react' : undefined;
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
  },
});
