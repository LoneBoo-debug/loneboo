
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carichiamo le variabili dal file .env (per sviluppo) 
  // e le uniamo a process.env (per produzione/Vercel)
  // FIX: Cast process to any to avoid TypeScript error for cwd() in environments where the global process type is restricted
  const env = loadEnv(mode, (process as any).cwd(), '')

  return {
    base: '/',
    publicDir: 'public',
    plugins: [react()],
    define: {
      global: 'globalThis',
      // FIX: Garantiamo che API_KEY sia letta prioritariamente dalle variabili di sistema (Vercel)
      // o dal file .env se presenti.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY || ''),
      'process.env.VITE_YOUTUBE_API_KEY': JSON.stringify(env.VITE_YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY || ''),
      'process.env.VITE_YOUTUBE_CHANNEL_ID': JSON.stringify(env.VITE_YOUTUBE_CHANNEL_ID || process.env.VITE_YOUTUBE_CHANNEL_ID || ''),
      'process.env.RESEND_API_KEY': JSON.stringify(env.RESEND_API_KEY || process.env.RESEND_API_KEY || '')
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
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
