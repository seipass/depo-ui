import { useStableId } from '@depo-ui/accessibility';
import { componentClassNames } from '../../shared/index.js';
import type { EmptyStateProps } from './EmptyState.types.js';
import { emptyStateClassName } from './EmptyState.styles.js';

export function EmptyState({ title, children, action, className, ...props }: EmptyStateProps) {
  const titleId = useStableId('empty-state-title');
  return (
    <section
      {...props}
      aria-labelledby={titleId}
      className={componentClassNames(emptyStateClassName, className)}
      data-dui-empty-state=""
    >
      <h2 id={titleId}>{title}</h2>
      {children ? <div>{children}</div> : null}
      {action ? <div>{action}</div> : null}
    </section>
  );
}
