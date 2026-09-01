import { componentClassNames } from '../../shared/index.js';
import type { TextareaProps } from './Textarea.types.js';
import { textareaClassName } from './Textarea.styles.js';

export function Textarea({
  className,
  size = 'md',
  invalid = false,
  disabled = false,
  ref,
  ...props
}: TextareaProps) {
  return (
    <textarea
      {...props}
      aria-invalid={invalid || undefined}
      className={componentClassNames(textareaClassName, className)}
      data-dui-control=""
      data-dui-textarea=""
      data-invalid={invalid ? 'true' : undefined}
      data-size={size}
      disabled={disabled}
      ref={ref}
    />
  );
}
