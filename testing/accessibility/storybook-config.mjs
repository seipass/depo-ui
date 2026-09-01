import { stableCandidateAxeOptions } from './axe-config.mjs';

/** Shared parameters for the Storybook a11y addon when the Docs app wires it in. */
export const storybookA11yParameters = Object.freeze({
  a11y: {
    options: stableCandidateAxeOptions,
    test: 'error',
  },
});
