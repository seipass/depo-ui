import type { ReactNode } from 'react';
import { classNames, primitiveClasses } from './styles.js';

export type IconProps = {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  decorative?: boolean;
  className?: string;
};

export function Icon({ children, size = 'md', label, decorative, className }: IconProps) {
  const isDecorative = decorative ?? !label;
  const hasAccessibleName = Boolean(label?.trim());
  const shouldHide = isDecorative || !hasAccessibleName;
  return (
    <span
      aria-hidden={shouldHide ? true : undefined}
      aria-label={shouldHide ? undefined : label}
      className={classNames(primitiveClasses.icon, className)}
      data-dui-icon=""
      data-dui-icon-size={size}
      role={shouldHide ? undefined : 'img'}
    >
      {children}
    </span>
  );
}
