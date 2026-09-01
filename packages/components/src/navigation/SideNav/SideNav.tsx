import { componentClassNames } from '../../shared/index.js';
import type { SideNavItem, SideNavProps } from './SideNav.types.js';
import { sideNavClassName } from './SideNav.styles.js';

export function SideNav({
  items,
  label = 'Side navigation',
  className,
  ref,
  ...props
}: SideNavProps) {
  return (
    <nav
      {...props}
      aria-label={label}
      className={componentClassNames(sideNavClassName, className)}
      data-dui-side-nav=""
      ref={ref}
    >
      <ul>
        {items.map((item: SideNavItem) => (
          <li key={item.id}>
            <a
              aria-current={item.current ? 'page' : undefined}
              aria-disabled={item.disabled || undefined}
              data-current={item.current ? 'true' : undefined}
              data-disabled={item.disabled ? 'true' : undefined}
              href={item.disabled ? undefined : item.href}
              tabIndex={item.disabled ? -1 : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
