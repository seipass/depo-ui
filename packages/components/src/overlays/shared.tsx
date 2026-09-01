import { useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react';
import { getOverlayPosition, type OverlayPlacement } from '@depo-ui/utilities';

export function usePositionedOverlay(
  anchorRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  open: boolean,
  placement: OverlayPlacement,
) {
  const [style, setStyle] = useState<CSSProperties>();

  useLayoutEffect(() => {
    if (!open || !anchorRef.current || !contentRef.current) return undefined;
    const update = () => {
      const position = getOverlayPosition(
        anchorRef.current!.getBoundingClientRect(),
        contentRef.current!.getBoundingClientRect(),
        placement,
      );
      setStyle(position);
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [anchorRef, contentRef, open, placement]);

  return style;
}
