import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['sun.jpg', 'favicon.ico'],
      manifest: {
        name: 'Find Your Inner Peace',
        short_name: 'Inner Peace',
        description: 'Your Personal Wellness Journey Companion - Track nutrition, meditation, sleep, and achieve inner peace',
        theme_color: '#6366f1',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'sun.jpg',
            sizes: '64x64',
            type: 'image/jpeg'
          },
          {
            src: 'sun.jpg',
            sizes: '192x192',
            type: 'image/jpeg'
          },
          {
            src: 'sun.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any'
          },
          {
            src: 'sun.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'maskable'
          }
        ],
        categories: ['health', 'lifestyle', 'wellness'],
        shortcuts: [
          {
            name: 'Dashboard',
            short_name: 'Dashboard',
            description: 'View your wellness dashboard',
            url: '/dashboard',
            icons: [{ src: 'sun.jpg', sizes: '192x192', type: 'image/jpeg' }]
          },
          {
            name: 'Nutrition',
            short_name: 'Nutrition',
            description: 'Track your nutrition',
            url: '/body/nutrition',
            icons: [{ src: 'sun.jpg', sizes: '192x192', type: 'image/jpeg' }]
          },
          {
            name: 'Meditation',
            short_name: 'Meditation',
            description: 'Start meditation practice',
            url: '/mind/practices',
            icons: [{ src: 'sun.jpg', sizes: '192x192', type: 'image/jpeg' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/api\.resend\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'resend-api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 5 // 5 minutes
              }
            }
          },
          {
            urlPattern: /^https:\/\/generativelanguage\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'gemini-api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 // 1 hour
              }
            }
          }
        ],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
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
