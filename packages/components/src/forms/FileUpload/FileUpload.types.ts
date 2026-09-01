import type { ComponentPropsWithRef, ReactNode } from 'react';

export type FileUploadProps = Omit<
  ComponentPropsWithRef<'input'>,
  'children' | 'className' | 'onChange'
> & {
  label: ReactNode;
  hint?: ReactNode;
  accept?: string;
  multiple?: boolean;
  onFilesChange?: (files: readonly File[]) => void;
  errorMessage?: ReactNode;
  progress?: number;
  loading?: boolean;
  className?: string;
};
