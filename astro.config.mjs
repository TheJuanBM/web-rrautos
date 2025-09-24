// @ts-check
import { defineConfig } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['astro'],
            utils: ['src/utils/index.ts'],
          },
          assetFileNames: assetInfo => {
            const name = assetInfo.name || 'asset'
            const info = name.split('.')
            const ext = info[info.length - 1]
            if (/\.(css)$/.test(name)) {
              return `css/[name]-[hash].${ext}`
            }
            if (/\.(js|ts)$/.test(name)) {
              return `js/[name]-[hash].${ext}`
            }
            return `assets/[name]-[hash].${ext}`
          },
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
        },
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      cssMinify: true,
      reportCompressedSize: false,
    },
  },
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
    format: 'file',
  },
  compressHTML: true,
  server: {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
})
