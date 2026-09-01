import { componentClassNames } from '../../shared/index.js';
import type { SpinnerProps } from './Spinner.types.js';
import { spinnerClassName } from './Spinner.styles.js';

export function Spinner({ className, label = 'Loading', ...props }: SpinnerProps) {
  return (
    <span
      {...props}
      aria-label={label}
      className={componentClassNames(spinnerClassName, className)}
      data-dui-spinner=""
      role="status"
    />
  );
}
