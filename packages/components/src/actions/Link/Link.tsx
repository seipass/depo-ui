import { componentClassNames } from '../../shared/index.js';
import type { LinkProps } from './Link.types.js';
import { linkClassName } from './Link.styles.js';

export function Link({
  children,
  className,
  variant = 'link',
  size = 'md',
  tone = 'primary',
  disabled = false,
  onClick,
  ...props
}: LinkProps) {
  return (
    <a
      {...props}
      aria-disabled={disabled || undefined}
      className={componentClassNames(linkClassName, className)}
      data-disabled={disabled ? 'true' : undefined}
      data-dui-link=""
      data-size={size}
      data-tone={tone}
      data-variant={variant}
      onClick={disabled ? undefined : onClick}
      tabIndex={disabled ? -1 : props.tabIndex}
    >
      {children}
    </a>
  );
}
