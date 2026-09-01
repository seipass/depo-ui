import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

const nodeGlobals = {
  URL: 'readonly',
  console: 'readonly',
  process: 'readonly',
};

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.docusaurus/**',
      'coverage/**',
      'test-results/**',
      'playwright-report/**',
      'apps/visual-tests/snapshots/**',
      'PLAN.md',
      'hi.md',
      '配色',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,tsx}'],
    languageOptions: {
      globals: nodeGlobals,
    },
    rules: {
      'no-console': 'off',
    },
  },
);
