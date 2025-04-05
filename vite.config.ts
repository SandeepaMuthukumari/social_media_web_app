import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react({
      // Additional React plugin configuration
      jsxRuntime: 'automatic',
      babel: {
        plugins: [
          ['babel-plugin-styled-components', {
            ssr: false,
            displayName: true,
            fileName: false
          }]
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true, // Prevent fallback to another port if 5173 is taken
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173
    },
    allowedHosts: [
      'a0b3b1f59529442f1b09ad60ed23f65d-1326241879.eu-central-1.elb.amazonaws.com',
      'localhost'
    ],
    watch: {
      usePolling: true // Important for Docker/Kubernetes environments
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true, // Recommended for debugging
    chunkSizeWarningLimit: 1000, // Adjust based on your needs
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'], // Add core dependencies
    exclude: ['your-large-library'] // Exclude problematic packages
  }
});