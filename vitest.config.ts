// this vitest config file is for single unit test.when debug a test in IDE. Could not load with vite.config.mts.so
// add this to enable vite test suite script(see vitest-setup.ts)
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
  }
});
