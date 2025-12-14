
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // @ts-ignore
  const env = loadEnv(mode, '.', '')

  return {
    base: '/', 
    plugins: [react()],
    define: {
      global: 'globalThis',
      'process.env': {
        API_KEY: env.API_KEY || '',
        VITE_YOUTUBE_API_KEY: env.VITE_YOUTUBE_API_KEY || '',
        VITE_YOUTUBE_CHANNEL_ID: env.VITE_YOUTUBE_CHANNEL_ID || '',
        RESEND_API_KEY: env.RESEND_API_KEY || ''
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'esbuild',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('@google/genai')) {
                return 'vendor-ai';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              // Generic vendor chunk for everything else to keep main bundle small
              return 'vendor-libs';
            }
          }
        }
      }
    },
    server: {
      host: true
    }
  }
})
