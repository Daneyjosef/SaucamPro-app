import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-framer';
          }
          if (id.includes('node_modules/recharts')) {
            return 'vendor-charts';
          }
          if (id.includes('node_modules/zustand') || id.includes('node_modules/@tanstack/react-query')) {
            return 'vendor-state';
          }
          if (id.includes('node_modules/axios') || id.includes('node_modules/date-fns') || id.includes('node_modules/react-hot-toast')) {
            return 'vendor-utils';
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
    cssMinify: true,
    target: 'es2020',
  },
  server: {
    port: 5173,
    open: false,
  },
})

