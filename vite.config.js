import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import savePatternPlugin from './vite-plugin-save-pattern.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), savePatternPlugin()],
})
