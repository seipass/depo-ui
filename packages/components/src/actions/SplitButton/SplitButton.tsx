import { ChevronDownIcon } from '@depo-ui/icons';
import { Button } from '../Button/index.js';
import { IconButton } from '../IconButton/index.js';
import { Menu } from '../../navigation/Menu/index.js';
import { componentClassNames } from '../../shared/index.js';
import type { SplitButtonProps } from './SplitButton.types.js';
import { splitButtonClassName } from './SplitButton.styles.js';

export function SplitButton({
  label,
  items,
  variant = 'solid',
  size = 'md',
  tone = 'primary',
  disabled = false,
  loading = false,
  menuLabel = 'More actions',
  className,
  onClick,
  ref,
  ...props
}: SplitButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <div
      {...props}
      className={componentClassNames(splitButtonClassName, className)}
      data-dui-split-button=""
      data-size={size}
      data-tone={tone}
      data-variant={variant}
      ref={ref}
    >
      <Button
        disabled={isDisabled}
        loading={loading}
        onClick={onClick}
        size={size}
        tone={tone}
        variant={variant}
      >
        {label}
      </Button>
      <Menu
        items={items}
        trigger={
          <IconButton
            disabled={isDisabled}
            label={menuLabel}
            size={size}
            tone={tone}
            variant="ghost"
          >
            <ChevronDownIcon aria-hidden="true" />
          </IconButton>
        }
      />
    </div>
  );
}
