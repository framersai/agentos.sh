import { defineConfig } from 'vitest/config';
import path from 'node:path';

/**
 * Vitest configuration for unit tests of pure helpers (no DOM).
 *
 * Scope is intentionally narrow: only test files under `lib/**` are picked
 * up. Component tests would need a DOM environment and a different config;
 * out of scope for this SEO-helper-focused setup.
 */
export default defineConfig({
  test: {
    include: ['lib/**/__tests__/**/*.test.ts'],
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
