/// <reference types="vitest/globals" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'node_modules/',
        'dist/',
        'src/main.tsx',
        'src/vitest.setup.ts',
        '**/*.d.ts',
        'vite.config.ts',
        'vitest.config.ts',
        'tailwind.config.ts',
        'eslint.config.*',
      ],
    },
  },
});
