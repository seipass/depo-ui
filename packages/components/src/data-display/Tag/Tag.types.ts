import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { ComponentSize, ComponentTone } from '../../shared/types.js';

export type TagProps = Omit<ComponentPropsWithRef<'span'>, 'children' | 'className'> & {
  children?: ReactNode;
  className?: string;
  size?: ComponentSize;
  tone?: ComponentTone;
  removable?: boolean;
  removeLabel?: string;
  onRemove?: () => void;
};
