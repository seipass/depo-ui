import { componentClassNames } from '../../shared/index.js';
import type { TextInputProps } from './TextInput.types.js';
import { textInputClassName } from './TextInput.styles.js';

export function TextInput({
  className,
  size = 'md',
  invalid = false,
  disabled = false,
  ref,
  ...props
}: TextInputProps) {
  return (
    <input
      {...props}
      aria-invalid={invalid || undefined}
      className={componentClassNames(textInputClassName, className)}
      data-dui-control=""
      data-dui-text-input=""
      data-invalid={invalid ? 'true' : undefined}
      data-size={size}
      disabled={disabled}
      ref={ref}
    />
  );
}
