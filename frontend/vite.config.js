import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/debate': 'http://localhost:8000',
      '/presets': 'http://localhost:8000',
    }
  }
})
