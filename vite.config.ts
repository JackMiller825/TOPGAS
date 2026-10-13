import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Project-site base for https://jackmiller825.github.io/TOPGAS/
export default defineConfig({
  plugins: [react()],
  base: '/TOPGAS/',
})
