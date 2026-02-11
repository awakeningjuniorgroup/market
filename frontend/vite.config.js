import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // ✅ permet à React Router de gérer les routes sans reload
    historyApiFallback: true
  },
  build: {
    // optionnel : utile pour Render/Netlify/Vercel
    outDir: 'dist'
  }
})
