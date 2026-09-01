import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appDirectory = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(appDirectory, '../..');
const navigation = JSON.parse(readFileSync(path.join(appDirectory, 'navigation.json'), 'utf8'));
const componentRoot = path.join(repoRoot, 'specs/components');
const patternRoot = path.join(repoRoot, 'specs/patterns');

const jsonNames = (directory) =>
  readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => entry.name.slice(0, -'.json'.length));

const slugify = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();

const componentCategories = readdirSync(componentRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => ({
    category: entry.name,
    items: jsonNames(path.join(componentRoot, entry.name))
      .sort()
      .map((name) => {
        const slug = slugify(name);
        return `generated/components/${entry.name}/${slug}-api`;
      }),
  }))
  .sort((left, right) => left.category.localeCompare(right.category));

const componentItems = componentCategories.flatMap(({ category, items }) => [
  {
    type: 'category',
    label: category,
    link: { type: 'doc', id: 'components/components' },
    items,
  },
]);

export default {
  docsSidebar: [
    { type: 'doc', id: 'guides/getting-started', label: navigation[0].label },
    { type: 'doc', id: 'foundations/foundations', label: navigation[1].label },
    {
      type: 'category',
      label: navigation[2].label,
      link: { type: 'doc', id: 'components/components' },
      items: componentItems,
    },
    {
      type: 'category',
      label: navigation[3].label,
      link: { type: 'doc', id: 'patterns/patterns' },
      items: [
        ...jsonNames(patternRoot)
          .sort()
          .map((name) => `generated/patterns/${name}`),
      ],
    },
    { type: 'doc', id: 'accessibility/accessibility', label: navigation[4].label },
    { type: 'doc', id: 'content-design/content-design', label: navigation[5].label },
    { type: 'doc', id: 'api/api', label: navigation[6].label },
    { type: 'doc', id: 'examples/examples', label: navigation[7].label },
    { type: 'doc', id: 'releases/releases', label: navigation[8].label },
    { type: 'doc', id: 'migration/migration', label: navigation[9].label },
  ],
};
