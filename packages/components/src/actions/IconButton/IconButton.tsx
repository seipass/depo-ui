import { componentClassNames } from '../../shared/index.js';
import type { IconButtonProps } from './IconButton.types.js';
import { iconButtonClassName } from './IconButton.styles.js';

export function IconButton({
  children,
  className,
  label,
  variant = 'ghost',
  size = 'md',
  tone = 'neutral',
  disabled = false,
  loading = false,
  type = 'button',
  ...props
}: IconButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      {...props}
      aria-busy={loading || undefined}
      aria-label={label}
      className={componentClassNames(iconButtonClassName, className)}
      data-disabled={isDisabled ? 'true' : undefined}
      data-dui-icon-button=""
      data-loading={loading ? 'true' : undefined}
      data-size={size}
      data-tone={tone}
      data-variant={variant}
      disabled={isDisabled}
      type={type}
    >
      {children}
    </button>
  );
}
