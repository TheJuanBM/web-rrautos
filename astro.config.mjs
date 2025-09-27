// @ts-check
import { defineConfig } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'

import cloudflare from '@astrojs/cloudflare'

// https://astro.build/config
export default defineConfig({
  site: 'https://rrautos.club',
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
    format: 'file',
  },
  compressHTML: true,
  adapter: cloudflare({
    imageService: 'compile',
  }),
})
