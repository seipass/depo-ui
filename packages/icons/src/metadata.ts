export type IconCategory = 'actions' | 'navigation' | 'status' | 'objects' | 'system';
export type IconDirection = 'none' | 'mirror';

export const iconMetadata = {
  check: {
    category: 'status',
    direction: 'none',
    status: 'stable',
  },
  'chevron-down': {
    category: 'navigation',
    direction: 'none',
    status: 'stable',
  },
  close: {
    category: 'actions',
    direction: 'none',
    status: 'stable',
  },
} as const satisfies Record<
  string,
  { category: IconCategory; direction: IconDirection; status: 'stable' }
>;

export type IconName = keyof typeof iconMetadata;
