import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // Hỗ trợ deploy GitHub Pages / static hosting
  server: {
    port: 5173,
    open: true
  }
})
