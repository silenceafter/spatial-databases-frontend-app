import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Настройка прокси для /api → бэкенд
    proxy: {
      '/api': {
        target: 'http://localhost:5091',  // ASP.NET Core
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'), // опционально
      },
    },
  },
})
