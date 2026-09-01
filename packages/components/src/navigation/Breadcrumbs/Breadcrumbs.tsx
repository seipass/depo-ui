import { componentClassNames } from '../../shared/index.js';
import type { BreadcrumbItem, BreadcrumbsProps } from './Breadcrumbs.types.js';
import { breadcrumbsClassName } from './Breadcrumbs.styles.js';

export function Breadcrumbs({
  items,
  label = 'Breadcrumb',
  separator = '/',
  className,
  ref,
  ...props
}: BreadcrumbsProps) {
  return (
    <nav
      {...props}
      aria-label={label}
      className={componentClassNames(breadcrumbsClassName, className)}
      data-dui-breadcrumbs=""
      ref={ref}
    >
      <ol>
        {items.map((item: BreadcrumbItem, index) => (
          <li key={item.id}>
            {item.href && !item.current ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span aria-current={item.current ? 'page' : undefined}>{item.label}</span>
            )}
            {index < items.length - 1 ? (
              <span aria-hidden="true" className="dui-breadcrumb-separator">
                {separator}
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
