export const wcag22AaTags = ['wcag2a', 'wcag2aa'];

export const axeOptions = {
  runOnly: {
    type: 'tag',
    values: wcag22AaTags,
  },
};

export const stableCandidateAxeOptions = {
  ...axeOptions,
  rules: {
    'color-contrast': { enabled: true },
    'duplicate-id-aria': { enabled: true },
    'focus-order-semantics': { enabled: true },
  },
};
