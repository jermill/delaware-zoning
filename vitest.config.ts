import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Test environment
    environment: 'jsdom',
    
    // Setup files
    setupFiles: ['./tests/setup.ts'],
    
    // Global test settings
    globals: true,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.*',
        '.next/',
        'dist/',
        'scripts/',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.test.tsx',
      ],
      // Thresholds for coverage
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 50,
        statements: 60,
      },
    },
    
    // Test file patterns
    include: ['tests/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['node_modules', '.next', 'dist'],
    
    // Test timeout
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Reporter
    reporters: ['verbose'],
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/middleware': path.resolve(__dirname, './src/middleware'),
      '@/types': path.resolve(__dirname, './src/types'),
    },
  },
});
