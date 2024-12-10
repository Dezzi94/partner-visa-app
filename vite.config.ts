/// <reference types="node" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
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
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
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
        'react-is',
        '@supabase/supabase-js'
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
    define: {
      // Pass environment variables to the client
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
    },
  }
});

