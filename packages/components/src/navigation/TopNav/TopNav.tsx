import { componentClassNames } from '../../shared/index.js';
import type { SideNavItem } from '../SideNav/SideNav.types.js';
import type { TopNavProps } from './TopNav.types.js';
import { topNavClassName } from './TopNav.styles.js';

export function TopNav({
  brand,
  items,
  actions,
  label = 'Primary navigation',
  className,
  ref,
  ...props
}: TopNavProps) {
  return (
    <header
      {...props}
      className={componentClassNames(topNavClassName, className)}
      data-dui-top-nav=""
      ref={ref}
    >
      <a className="dui-top-nav-brand" href="/">
        {brand}
      </a>
      <nav aria-label={label}>
        <ul>
          {items.map((item: SideNavItem) => (
            <li key={item.id}>
              <a
                aria-current={item.current ? 'page' : undefined}
                aria-disabled={item.disabled || undefined}
                href={item.disabled ? undefined : item.href}
                tabIndex={item.disabled ? -1 : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {actions ? <div className="dui-top-nav-actions">{actions}</div> : null}
    </header>
  );
}
