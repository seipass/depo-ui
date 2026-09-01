import { componentClassNames } from '../../shared/index.js';
import type { NumberInputProps } from './NumberInput.types.js';
import { numberInputClassName } from './NumberInput.styles.js';

export function NumberInput({
  className,
  size = 'md',
  invalid = false,
  disabled = false,
  ref,
  ...props
}: NumberInputProps) {
  return (
    <input
      {...props}
      aria-invalid={invalid || undefined}
      className={componentClassNames(numberInputClassName, className)}
      data-dui-control=""
      data-dui-number-input=""
      data-invalid={invalid ? 'true' : undefined}
      data-size={size}
      disabled={disabled}
      inputMode="decimal"
      ref={ref}
      type="number"
    />
  );
}
