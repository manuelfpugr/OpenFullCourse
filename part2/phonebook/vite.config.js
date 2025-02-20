import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'https://openfullcoursep2.onrender.com',
        changeOrigin: true,
      },
    }
  },
})