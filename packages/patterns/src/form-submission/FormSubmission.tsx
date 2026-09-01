import { useId, type ComponentPropsWithoutRef, type FormEvent, type ReactNode } from 'react';
import { Button, InlineMessage } from '@depo-ui/components';

export type FormSubmissionProps = Omit<
  ComponentPropsWithoutRef<'form'>,
  'children' | 'className' | 'onSubmit'
> & {
  children?: ReactNode;
  status?: 'idle' | 'editing' | 'submitting' | 'success' | 'error';
  submitLabel?: ReactNode;
  errorMessage?: ReactNode;
  successMessage?: ReactNode;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  className?: string;
};

export function FormSubmission({
  children,
  status = 'idle',
  submitLabel = 'Save',
  errorMessage,
  successMessage,
  onSubmit,
  className,
  ...props
}: FormSubmissionProps) {
  const messageId = useId();
  const isSubmitting = status === 'submitting';
  const hasMessage = Boolean(errorMessage || successMessage);
  return (
    <form
      {...props}
      aria-busy={isSubmitting || undefined}
      aria-describedby={hasMessage ? messageId : undefined}
      className={className}
      data-dui-pattern="form-submission"
      data-state={status}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(event);
      }}
    >
      {children}
      <div data-dui-pattern-actions="">
        <Button disabled={isSubmitting} loading={isSubmitting} type="submit">
          {submitLabel}
        </Button>
      </div>
      {errorMessage ? (
        <InlineMessage id={messageId} title="Could not save" tone="danger">
          {errorMessage}
        </InlineMessage>
      ) : successMessage ? (
        <InlineMessage id={messageId} title="Saved" tone="success">
          {successMessage}
        </InlineMessage>
      ) : null}
    </form>
  );
}
