import { useControllableState } from '../../shared/index.js';
import type { SliderProps } from './Slider.types.js';
import { sliderClassName } from './Slider.styles.js';

export function Slider({
  label,
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  invalid = false,
  className,
  disabled = false,
  ref,
  ...props
}: SliderProps) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  return (
    <label className={sliderClassName} data-dui-slider="">
      <span>{label}</span>
      <input
        {...props}
        aria-invalid={invalid || undefined}
        aria-label={typeof label === 'string' ? label : undefined}
        className={className}
        data-invalid={invalid ? 'true' : undefined}
        disabled={disabled}
        max={max}
        min={min}
        onChange={(event) => setValue(event.target.valueAsNumber)}
        ref={ref}
        step={step}
        type="range"
        value={value}
      />
      <output>{value}</output>
    </label>
  );
}
