import { useStableId } from './useStableId.js';

export type DescriptionIdOptions = {
  id?: string;
  descriptionId?: string;
  errorId?: string;
  describedBy?: string;
  hasDescription?: boolean;
  hasError?: boolean;
};

export type DescriptionIds = {
  id: string;
  descriptionId: string;
  errorId: string;
  describedBy?: string;
};

export function useDescriptionIds({
  id,
  descriptionId,
  errorId,
  describedBy,
  hasDescription = false,
  hasError = false,
}: DescriptionIdOptions = {}): DescriptionIds {
  const fieldId = useStableId('dui-field', id);
  const resolvedDescriptionId = descriptionId ?? `${fieldId}-description`;
  const resolvedErrorId = errorId ?? `${fieldId}-error`;
  const describedByIds = [
    describedBy,
    hasDescription ? resolvedDescriptionId : undefined,
    hasError ? resolvedErrorId : undefined,
  ].filter(Boolean);

  return {
    id: fieldId,
    descriptionId: resolvedDescriptionId,
    errorId: resolvedErrorId,
    describedBy: describedByIds.length > 0 ? describedByIds.join(' ') : undefined,
  };
}
