import { componentClassNames } from '../../shared/index.js';
import type { BadgeProps } from './Badge.types.js';
import { badgeClassName } from './Badge.styles.js';

export function Badge({
  children,
  className,
  size = 'md',
  tone = 'neutral',
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={componentClassNames(badgeClassName, className)}
      data-dui-badge=""
      data-size={size}
      data-tone={tone}
    >
      {children}
    </span>
  );
}
