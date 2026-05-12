import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3869,
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 100
    }
  },
  build: {
    outDir: "../public",
    emptyOutDir: true,
  }
})