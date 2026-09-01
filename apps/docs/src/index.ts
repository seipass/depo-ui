import navigation from '../navigation.json';

export type DocsNavigationItem = (typeof navigation)[number];

export const docsNavigation = navigation;

export const docsSite = {
  name: 'Depo UI',
  description:
    'A reusable design system for SaaS, dashboards, administration tools, and data-heavy Web applications.',
  generatedReference: 'tooling/docs-generator/generate.mjs',
} as const;

export const docsHref = (path: DocsNavigationItem['path']): string => path;
