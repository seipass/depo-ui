import type { ComponentPropsWithRef } from 'react';
import type { ComponentSize } from '../../shared/types.js';

export type AvatarProps = Omit<ComponentPropsWithRef<'span'>, 'children' | 'className'> & {
  className?: string;
  src?: string;
  alt?: string;
  label?: string;
  initials?: string;
  size?: ComponentSize;
};
