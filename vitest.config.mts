import pkgService, {defineVitestConfig} from '@ice/pkg';

export default defineVitestConfig(pkgService, {
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
  }
});
