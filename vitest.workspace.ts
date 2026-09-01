import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: 'workspace',
    include: [
      'testing/**/*.test.{ts,tsx,mts,mjs,js,cjs}',
      'packages/**/src/**/*.test.{ts,tsx,mts,mjs,js,cjs}',
      'apps/**/src/**/*.test.{ts,tsx,mts,mjs,js,cjs}',
      'tooling/**/*.test.{ts,tsx,mts,mjs,js,cjs}',
    ],
  },
});
