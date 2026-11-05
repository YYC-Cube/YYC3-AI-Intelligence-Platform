import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * GitHub Pages 为纯静态托管，不支持 SPA history fallback。
 * 构建后复制 index.html 为 404.html，保证 /client、/enterprise 等深链刷新可用。
 */
function spaFallbackPlugin(): Plugin {
  return {
    name: 'yyc3-spa-404-fallback',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        fs.copyFileSync(indexFile, path.join(distDir, '404.html'));
      }
    },
  };
}

export default defineConfig({
  esbuild: {
    drop: ['console', 'debugger'],
  },
  plugins: [
    react(),
    spaFallbackPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      // 仅预缓存应用外壳；图片走 runtimeCaching，避免首装下载 ~5MB 静态图
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'YYC3 · AI Intelligence Platform',
        short_name: 'YYC3 · AI',
        description:
          'Enterprise-grade analytics and intelligence platform for mobile app developers - AI-powered insights for App Store Optimization, market intelligence, and competitive analysis',
        theme_color: '#0C70F2',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'any',
        scope: '/',
        start_url: '/',
        categories: ['business', 'productivity', 'analytics'],
        lang: 'zh-CN',
        dir: 'ltr',
        icons: [
          { src: '/yyc3-icons/pwa/icon-72x72.png', sizes: '72x72', type: 'image/png' },
          { src: '/yyc3-icons/pwa/icon-96x96.png', sizes: '96x96', type: 'image/png' },
          { src: '/yyc3-icons/pwa/icon-128x128.png', sizes: '128x128', type: 'image/png' },
          { src: '/yyc3-icons/pwa/icon-144x144.png', sizes: '144x144', type: 'image/png' },
          { src: '/yyc3-icons/pwa/icon-152x152.png', sizes: '152x152', type: 'image/png' },
          {
            src: '/yyc3-icons/pwa/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          { src: '/yyc3-icons/webp/icon-192x192.webp', sizes: '192x192', type: 'image/webp' },
          { src: '/yyc3-icons/pwa/icon-384x384.png', sizes: '384x384', type: 'image/png' },
          {
            src: '/yyc3-icons/pwa/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
          { src: '/yyc3-icons/webp/icon-512x512.webp', sizes: '512x512', type: 'image/webp' },
        ],
        shortcuts: [
          { name: 'Dashboard', url: '/client', description: 'Go to main dashboard' },
          { name: 'ASO', url: '/client/aso', description: 'Open ASO optimization' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24,
              },
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /https:\/\/fonts\.googleapis\.com/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\//i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'unsplash-images',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.(?:js|css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  server: {
    port: 3200,
    host: true,
    open: true,
  },
  preview: {
    port: 3200,
    host: true,
  },
  build: {
    outDir: 'dist',
    // 生产默认不产出 sourcemap：dist 会直传 GitHub Pages，公开 .map 等同于公开源码。
    // 需要排查线上问题时用 `SOURCE_MAP=true pnpm build` 本地构建。
    sourcemap: process.env.SOURCE_MAP === 'true' ? true : false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }
          // 精确分包：避免 `includes('react')` 把 react-router / react-hook-form /
          // @radix-ui/react-* 全部吸入同一 chunk（曾导致 react-vendor 728KB + 循环依赖）
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) {
            return 'react-core';
          }
          if (/node_modules\/(react-router|react-router-dom|@remix-run)\//.test(id)) {
            return 'router-vendor';
          }
          if (/node_modules\/@radix-ui\//.test(id)) {
            return 'radix-vendor';
          }
          if (/node_modules\/(recharts|d3-[a-z-]+|victory-[a-z-]+)\//.test(id)) {
            return 'charts-vendor';
          }
          if (/node_modules\/(framer-motion|motion-dom|motion-utils)\//.test(id)) {
            return 'motion-vendor';
          }
          if (/node_modules\/(react-hook-form|@hookform)\//.test(id)) {
            return 'forms-vendor';
          }
          if (/node_modules\/(date-fns|dayjs)\//.test(id)) {
            return 'date-utils';
          }
          return 'vendor';
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 500,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'lucide-react'],
  },
});
