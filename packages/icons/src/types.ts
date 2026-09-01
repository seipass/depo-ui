import type { SVGProps } from 'react';

export type IconSize = 'sm' | 'md' | 'lg';

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'children' | 'color' | 'title'> & {
  size?: IconSize;
  label?: string;
  decorative?: boolean;
};
