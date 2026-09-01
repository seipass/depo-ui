import { useId } from 'react';

const sanitizeId = (value: string) => value.replace(/:/g, '-');

export function useStableId(prefix = 'dui', explicitId?: string) {
  const reactId = useId();
  if (explicitId) return explicitId;
  return `${prefix}-${sanitizeId(reactId)}`;
}
