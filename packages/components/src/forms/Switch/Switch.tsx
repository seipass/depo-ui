import { componentClassNames } from '../../shared/index.js';
import type { SwitchProps } from './Switch.types.js';
import { switchClassName } from './Switch.styles.js';

export function Switch({
  children,
  className,
  size = 'md',
  tone = 'primary',
  invalid = false,
  disabled = false,
  ref,
  ...props
}: SwitchProps) {
  return (
    <label className={componentClassNames(switchClassName, className)} data-dui-switch="">
      <input
        {...props}
        aria-invalid={invalid || undefined}
        data-invalid={invalid ? 'true' : undefined}
        data-size={size}
        data-tone={tone}
        disabled={disabled}
        ref={ref}
        role="switch"
        type="checkbox"
      />
      <span>{children}</span>
    </label>
  );
}
