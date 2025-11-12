import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { VitePWA } from 'vite-plugin-pwa' // REMOVED - PWA disabled

export default defineConfig({
  plugins: [
    react(),
    // PWA plugin disabled - regular web app only
  ],
  define: {
    'process.env': {}
  },
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ai-vendor': ['@google/generative-ai'],
          'ui-vendor': ['lucide-react']
        }
      }
    }
  }
})
