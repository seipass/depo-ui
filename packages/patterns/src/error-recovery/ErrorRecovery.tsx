import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Button, ErrorState, Link } from '@depo-ui/components';

export type ErrorRecoveryProps = Omit<
  ComponentPropsWithoutRef<'section'>,
  'children' | 'className'
> & {
  title: ReactNode;
  message: ReactNode;
  onRetry?: () => void;
  retryLabel?: ReactNode;
  alternative?: ReactNode;
  className?: string;
};

export function ErrorRecovery({
  title,
  message,
  onRetry,
  retryLabel = 'Retry',
  alternative,
  className,
  ...props
}: ErrorRecoveryProps) {
  return (
    <section {...props} className={className} data-dui-pattern="error-recovery">
      <ErrorState
        action={
          <>
            {onRetry ? <Button onClick={onRetry}>{retryLabel}</Button> : null}
            {alternative ? <Link href="/">{alternative}</Link> : null}
          </>
        }
        title={title}
      >
        {message}
      </ErrorState>
    </section>
  );
}
