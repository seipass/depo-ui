import { componentClassNames, useControllableState } from '../../shared/index.js';
import type { ToggleButtonProps } from './ToggleButton.types.js';
import { toggleButtonClassName } from './ToggleButton.styles.js';

export function ToggleButton({
  children,
  className,
  variant = 'outline',
  size = 'md',
  tone = 'neutral',
  disabled = false,
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  ref,
  ...props
}: ToggleButtonProps) {
  const [pressed, setPressed] = useControllableState({
    value: pressedProp,
    defaultValue: defaultPressed,
    onChange: onPressedChange,
  });
  return (
    <button
      {...props}
      aria-pressed={pressed}
      className={componentClassNames(toggleButtonClassName, className)}
      data-dui-toggle-button=""
      data-pressed={pressed ? 'true' : undefined}
      data-size={size}
      data-tone={tone}
      data-variant={variant}
      disabled={disabled}
      onClick={(event) => {
        props.onClick?.(event);
        if (!event.defaultPrevented) setPressed(!pressed);
      }}
      ref={ref}
      type={props.type ?? 'button'}
    >
      {children}
    </button>
  );
}
