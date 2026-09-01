import { useStableId } from '@depo-ui/accessibility';
import { componentClassNames } from '../../shared/index.js';
import type { ErrorStateProps } from './ErrorState.types.js';
import { errorStateClassName } from './ErrorState.styles.js';

export function ErrorState({ title, children, action, className, ...props }: ErrorStateProps) {
  const titleId = useStableId('error-state-title');
  return (
    <section
      {...props}
      aria-labelledby={titleId}
      className={componentClassNames(errorStateClassName, className)}
      data-dui-error-state=""
      role="alert"
    >
      <h2 id={titleId}>{title}</h2>
      {children ? <div>{children}</div> : null}
      {action ? <div>{action}</div> : null}
    </section>
  );
}
