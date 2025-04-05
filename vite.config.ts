import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Disable sourcemaps in production
    sourcemap: process.env.NODE_ENV !== 'production',
    // Optimize chunks
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['lodash', 'axios'],
        },
      },
    },
  },
  // Critical: Disable HMR in production
  define: {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
    'import.meta.env.PROD': JSON.stringify(true),
  },
});