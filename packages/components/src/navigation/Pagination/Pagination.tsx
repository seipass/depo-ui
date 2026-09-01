import { componentClassNames } from '../../shared/index.js';
import type { PaginationProps } from './Pagination.types.js';
import { paginationClassName } from './Pagination.styles.js';

function getVisiblePages(page: number, pageCount: number) {
  if (pageCount <= 7) return Array.from({ length: Math.max(pageCount, 0) }, (_, i) => i + 1);
  const pages = new Set([1, pageCount, page, page - 1, page + 1]);
  return Array.from(pages)
    .filter((item) => item >= 1 && item <= pageCount)
    .sort((a, b) => a - b);
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  label = 'Pagination',
  previousLabel = 'Previous',
  nextLabel = 'Next',
  className,
  ref,
  ...props
}: PaginationProps) {
  const pages = getVisiblePages(page, pageCount);
  return (
    <nav
      {...props}
      aria-label={label}
      className={componentClassNames(paginationClassName, className)}
      data-dui-pagination=""
      ref={ref}
    >
      <ul>
        <li>
          <button
            aria-label={previousLabel}
            disabled={page <= 1}
            onClick={() => onPageChange?.(page - 1)}
            type="button"
          >
            {previousLabel}
          </button>
        </li>
        {pages.map((item, index) => {
          const previous = pages[index - 1];
          const needsGap = previous !== undefined && item - previous > 1;
          return (
            <li className="dui-pagination-page" key={item}>
              {needsGap ? <span aria-hidden="true">…</span> : null}
              <button
                aria-current={item === page ? 'page' : undefined}
                aria-label={`Page ${item}`}
                onClick={() => onPageChange?.(item)}
                type="button"
              >
                {item}
              </button>
            </li>
          );
        })}
        <li>
          <button
            aria-label={nextLabel}
            disabled={page >= pageCount}
            onClick={() => onPageChange?.(page + 1)}
            type="button"
          >
            {nextLabel}
          </button>
        </li>
      </ul>
    </nav>
  );
}
