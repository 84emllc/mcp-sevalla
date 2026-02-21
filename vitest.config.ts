import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 5_000,
    include: ['tests/**/*.test.ts'],
    sequence: {
      concurrent: false,
    },
  },
});
