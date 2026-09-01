import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { useDescriptionIds } from '@depo-ui/accessibility';
import { componentClassNames } from './types.js';

export type FieldControlProps = {
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
};

export function FieldControl({
  children,
  id,
  describedBy,
  invalid,
  required,
}: {
  children: ReactNode;
  id: string;
  describedBy?: string;
  invalid: boolean;
  required: boolean;
}) {
  if (!isValidElement(children)) return <>{children}</>;
  const child = children as ReactElement<FieldControlProps>;
  return cloneElement(child, {
    id: child.props.id ?? id,
    'aria-describedby':
      [child.props['aria-describedby'], describedBy].filter(Boolean).join(' ') || undefined,
    'aria-invalid': invalid || child.props['aria-invalid'] || undefined,
    'aria-required': required || child.props['aria-required'] || undefined,
  });
}

export function useFieldDescription({
  id,
  description,
  errorMessage,
}: {
  id?: string;
  description?: ReactNode;
  errorMessage?: ReactNode;
}) {
  const ids = useDescriptionIds({
    id,
    hasDescription: Boolean(description),
    hasError: Boolean(errorMessage),
  });
  return ids;
}

export function fieldMessageClassName(kind: 'description' | 'error') {
  return componentClassNames('dui-field-message', `dui-field-message-${kind}`);
}
