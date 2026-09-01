import { InlineMessage } from '../InlineMessage/index.js';
import type { BannerProps } from './Banner.types.js';

export function Banner(props: BannerProps) {
  return <InlineMessage {...props} data-dui-banner="" />;
}
