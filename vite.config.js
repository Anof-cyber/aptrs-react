import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    //include: ['@workspace/ckeditor5'],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      exclude: ['ckeditor5-custom-build']
    }
  },
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    silent: true,
    setupFiles: ['./tests/setup.ts']
  }
})
