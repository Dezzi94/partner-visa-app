/// <reference types="node" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react({
    jsxRuntime: 'automatic'
  })],
  base: '/',
  server: {
    port: 5173,
    host: true,
    strictPort: false,
    hmr: {
      overlay: false,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', '@mui/material', '@emotion/react', '@emotion/styled'],
        },
      },
    },
    target: 'esnext',
    minify: 'terser',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'react-is': path.resolve(__dirname, 'node_modules/react-is'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
      '@mui/x-date-pickers',
      '@mui/x-date-pickers/AdapterDateFns',
      'date-fns',
      'html2canvas',
      'jspdf',
      'prop-types',
      'react-is'
    ],
    exclude: ['@mui/material/utils'],
    esbuildOptions: {
      target: 'es2020',
      define: {
        global: 'globalThis',
      },
      supported: {
        bigint: true,
      },
    },
  },
})

