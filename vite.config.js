import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dotenv from 'dotenv';

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://pool.swypt.io/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        headers: {
          'x-api-key': '9900ca9c16becead5ac6dd3f6fa6b534',
          'x-api-secret': '70779dd4d5e39e71a2460d701ec6e9001b191c21765d40499eec29d660d3e31c'
        }
      }
    }
  },
  plugins: [
    tailwindcss(),
    react()
  ],
  define: {
    
  // eslint-disable-next-line no-undef
  'process.env.VITE_WALLET_CONNECT_PROJECT_ID': JSON.stringify(process.env.VITE_WALLET_CONNECT_PROJECT_ID),
  }
})
