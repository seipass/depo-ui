import { componentClassNames } from '../../shared/index.js';
import type { ProgressBarProps } from './ProgressBar.types.js';
import { progressBarClassName } from './ProgressBar.styles.js';

export function ProgressBar({ className, value, label = 'Progress', ...props }: ProgressBarProps) {
  const boundedValue = value === undefined ? undefined : Math.max(0, Math.min(100, value));
  return (
    <div
      {...props}
      aria-label={label}
      aria-valuemax={boundedValue === undefined ? undefined : 100}
      aria-valuemin={boundedValue === undefined ? undefined : 0}
      aria-valuenow={boundedValue}
      className={componentClassNames(progressBarClassName, className)}
      data-dui-progress=""
      data-indeterminate={boundedValue === undefined ? 'true' : undefined}
      role="progressbar"
    >
      <div
        className="dui-progress-value"
        style={boundedValue === undefined ? undefined : { inlineSize: `${boundedValue}%` }}
      />
    </div>
  );
}
