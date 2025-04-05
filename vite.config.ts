import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0', // Allow external connections
    port: 5173,      // Explicit port declaration
    allowedHosts: [
      'a0b3b1f59529442f1b09ad60ed23f65d-1326241879.eu-central-1.elb.amazonaws.com',
      'localhost' // Keep localhost for local development
    ],
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true // Changed from 'all' to boolean true
  }
});