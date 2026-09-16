import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@r': '/src/routing',
      '@styles': '/src/styles',
      '@font': '/src/fonts',
      '@assets': '/src/assets',
      '@api': '/src/api', 
      '@utils': '/src/utils',
    }
  },
})
