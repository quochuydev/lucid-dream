import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { imagetools } from 'vite-imagetools'

export default defineConfig({
  // Relative base: works at any /REPOSITORY/ subpath without knowing its name.
  base: './',
  plugins: [react(), tailwindcss(), imagetools()],
})
