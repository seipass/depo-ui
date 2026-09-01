import { componentClassNames } from '../../shared/index.js';
import type { RadioProps } from './Radio.types.js';
import { radioClassName } from './Radio.styles.js';

export function Radio({
  children,
  className,
  size = 'md',
  tone = 'primary',
  invalid = false,
  disabled = false,
  ref,
  ...props
}: RadioProps) {
  return (
    <label className={componentClassNames(radioClassName, className)} data-dui-radio="">
      <input
        {...props}
        aria-invalid={invalid || undefined}
        data-invalid={invalid ? 'true' : undefined}
        data-size={size}
        data-tone={tone}
        disabled={disabled}
        ref={ref}
        type="radio"
      />
      <span>{children}</span>
    </label>
  );
}
