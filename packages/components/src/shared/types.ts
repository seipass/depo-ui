import type { ComponentPropsWithRef, ReactNode } from 'react';

export type ComponentVariant = 'solid' | 'soft' | 'outline' | 'ghost' | 'link';
export type ComponentSize = 'sm' | 'md' | 'lg';
export type ComponentTone = 'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

export type CommonComponentProps = {
  variant?: ComponentVariant;
  size?: ComponentSize;
  tone?: ComponentTone;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children?: ReactNode;
};

export type ButtonElementProps = ComponentPropsWithRef<'button'>;
export type InputElementProps = ComponentPropsWithRef<'input'>;
export type TextareaElementProps = ComponentPropsWithRef<'textarea'>;

export function componentClassNames(...names: Array<string | false | null | undefined>) {
  return names.filter(Boolean).join(' ');
}

export function componentData(value: boolean | undefined) {
  return value ? 'true' : undefined;
}
