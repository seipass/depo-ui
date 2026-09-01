import { componentClassNames, useControllableState } from '../../shared/index.js';
import type { SegmentOption, SegmentedControlProps } from './SegmentedControl.types.js';
import { segmentedControlClassName } from './SegmentedControl.styles.js';

export function SegmentedControl({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  size = 'md',
  tone = 'primary',
  ariaLabel = 'Options',
  className,
  ref,
  ...props
}: SegmentedControlProps) {
  const firstEnabled = options.find((option) => !option.disabled)?.value ?? '';
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue: defaultValue ?? firstEnabled,
    onChange: onValueChange,
  });

  return (
    <div
      {...props}
      aria-label={ariaLabel}
      className={componentClassNames(segmentedControlClassName, className)}
      data-dui-segmented-control=""
      data-size={size}
      data-tone={tone}
      ref={ref}
      role="group"
    >
      {options.map((option: SegmentOption) => (
        <button
          aria-checked={option.value === value}
          className="dui-segment"
          data-selected={option.value === value ? 'true' : undefined}
          disabled={option.disabled}
          key={option.value}
          onClick={() => setValue(option.value)}
          role="radio"
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
