/// <reference types="vitest/config" />
// Tells TypeScript that defineConfig() also accepts Vitest's `test` options below.
// Without it, `tsc -b` (used by typecheck and build) rejects the `test` block.
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
