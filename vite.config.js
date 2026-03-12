import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'icons/*.svg'],
      manifest: {
        name: 'LamarYuk - Job Tracker',
        short_name: 'LamarYuk',
        description: 'Catat dan pantau perjalanan lamaran kerjamu',
        theme_color: '#f9a8d4',
        background_color: '#fffbf5',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60*60*24*365 } }
          },
          {
            urlPattern: /^https?:\/\/.*\/api\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'api-cache', networkTimeoutSeconds: 10, expiration: { maxEntries: 100, maxAgeSeconds: 60*60*24 } }
          }
        ]
      },
      devOptions: {
        enabled: true   // ← aktifkan PWA saat development juga
      }
    })
  ],
  server: {
    port: 5173,
    host: true,          // ← expose ke network, bisa diakses dari HP
    strictPort: true,
  }
});
