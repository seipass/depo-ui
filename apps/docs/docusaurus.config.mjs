import { fileURLToPath } from 'node:url';

const configDirectory = fileURLToPath(new URL('.', import.meta.url));

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Depo UI',
  tagline: 'A dependable design system for Web applications',
  favicon: undefined,
  url: 'https://depo-ui.invalid',
  baseUrl: '/',
  organizationName: 'depo-ui',
  projectName: 'design-system',
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  trailingSlash: false,
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  staticDirectories: ['static'],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'content',
          routeBasePath: 'docs',
          sidebarPath: './sidebars.mjs',
          showLastUpdateTime: false,
          showLastUpdateAuthor: false,
          includeCurrentVersion: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],
  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Depo UI',
      items: [
        { type: 'docSidebar', sidebarId: 'docsSidebar', label: 'Docs', position: 'left' },
        { to: '/docs/components', label: 'Components', position: 'left' },
        { to: '/docs/patterns', label: 'Patterns', position: 'left' },
        { to: '/docs/examples', label: 'Examples', position: 'left' },
        {
          href: 'https://github.com/depo-ui/design-system',
          label: 'Repository',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        { title: 'Explore', items: [{ label: 'Components', to: '/docs/components' }] },
        { title: 'Quality', items: [{ label: 'Accessibility', to: '/docs/accessibility' }] },
        { title: 'Operations', items: [{ label: 'Releases', to: '/docs/releases' }] },
      ],
      copyright: `Copyright ${new Date().getFullYear()} Depo UI contributors.`,
    },
    metadata: [{ name: 'theme-color', content: 'var(--dui-color-bg-canvas)' }],
  },
  customFields: {
    configDirectory,
  },
};

export default config;
