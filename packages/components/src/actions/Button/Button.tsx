import { componentClassNames } from '../../shared/index.js';
import type { ButtonProps } from './Button.types.js';
import { buttonClassName } from './Button.styles.js';

export function Button({
  children,
  className,
  variant = 'solid',
  size = 'md',
  tone = 'primary',
  disabled = false,
  loading = false,
  loadingLabel,
  type = 'button',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      {...props}
      aria-busy={loading || undefined}
      className={componentClassNames(buttonClassName, className)}
      data-disabled={isDisabled ? 'true' : undefined}
      data-dui-button=""
      data-loading={loading ? 'true' : undefined}
      data-size={size}
      data-tone={tone}
      data-variant={variant}
      disabled={isDisabled}
      type={type}
    >
      {loading ? (loadingLabel ?? children) : children}
    </button>
  );
}
