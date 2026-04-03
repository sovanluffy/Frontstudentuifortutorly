import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // When you fetch('/api/...'), Vite redirects it to Render
      '/api': {
        target: 'https://toturhub-dev.onrender.com',
        changeOrigin: true,
        secure: false, // Helps if there are SSL issues with dev environments
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})