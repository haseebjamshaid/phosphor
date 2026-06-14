import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// GitHub Pages serves project sites under /<repo>/, so production assets must be
// prefixed with '/phosphor/'. Local dev stays at '/' for a normal localhost experience.
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/phosphor/' : '/',
  plugins: [react()],
  // Force a single copy of three — a transitive dep (stats-gl) pulls an older
  // version, and two three instances break instanceof checks in postprocessing.
  resolve: { dedupe: ['three'] },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.{test,spec}.ts', 'src/**/*.d.ts'],
    },
  },
}))
