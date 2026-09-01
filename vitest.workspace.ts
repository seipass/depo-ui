import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: 'phase0',
    include: [
      'testing/**/*.test.{ts,tsx}',
      'packages/**/src/**/*.test.{ts,tsx}',
      'apps/**/src/**/*.test.{ts,tsx}',
    ],
  },
});
