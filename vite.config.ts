import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: '/',
    publicDir: 'public',
    plugins: [react()],
    resolve: {
      dedupe: ['react', 'react-dom'] // <- fix principale per createContext undefined
    },
    define: {
      global: 'globalThis',
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY || ''),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''),
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
              if (id.includes('@google/genai')) return 'vendor-ai';
              if (id.includes('lucide-react')) return 'vendor-icons';
              return 'vendor-libs'; // React incluso qui
            }
          }
        }
      }
    },
    server: { host: true }
  }
})