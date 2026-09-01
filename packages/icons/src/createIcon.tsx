import type { ReactNode } from 'react';
import { iconMetadata, type IconName } from './metadata.js';
import type { IconProps } from './types.js';

type CreateIconOptions = {
  name: IconName;
  children: ReactNode;
};

export function createIcon({ name, children }: CreateIconOptions) {
  const Icon = ({ size = 'md', label, decorative, className, ...props }: IconProps) => {
    const isDecorative = decorative ?? !label;
    const hasAccessibleName = Boolean(label?.trim());
    const shouldHide = isDecorative || !hasAccessibleName;

    return (
      <svg
        {...props}
        aria-hidden={shouldHide ? true : undefined}
        aria-label={shouldHide ? undefined : label}
        className={['dui-icon', `dui-icon-${size}`, className].filter(Boolean).join(' ')}
        data-dui-icon={name}
        data-dui-icon-direction={iconMetadata[name].direction}
        data-dui-icon-size={size}
        focusable="false"
        role={shouldHide ? undefined : 'img'}
        viewBox="0 0 24 24"
      >
        {children}
      </svg>
    );
  };

  Icon.displayName = `${name.replace(/(^|-)([a-z])/g, (_, _separator, letter: string) =>
    letter.toUpperCase(),
  )}Icon`;
  return Icon;
}
