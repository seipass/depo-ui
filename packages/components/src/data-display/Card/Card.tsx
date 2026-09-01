import { componentClassNames } from '../../shared/index.js';
import type { CardProps } from './Card.types.js';
import { cardClassName } from './Card.styles.js';

export function Card({ children, className, ...props }: CardProps) {
  return (
    <article {...props} className={componentClassNames(cardClassName, className)} data-dui-card="">
      {children}
    </article>
  );
}
