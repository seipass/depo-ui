export type OverlayPlacement = 'top' | 'right' | 'bottom' | 'left';

export type OverlayPosition = {
  position: 'fixed';
  insetBlockStart: number;
  insetInlineStart: number;
  maxInlineSize: number;
};

export function getOverlayPosition(
  anchor: DOMRect,
  content: DOMRect,
  placement: OverlayPlacement = 'bottom',
  offset = 8,
): OverlayPosition {
  const viewportInlineSize =
    typeof window === 'undefined' ? Number.MAX_SAFE_INTEGER : window.innerWidth;
  const viewportBlockSize =
    typeof window === 'undefined' ? Number.MAX_SAFE_INTEGER : window.innerHeight;
  let insetBlockStart = anchor.bottom + offset;
  let insetInlineStart = anchor.left;

  if (placement === 'top') insetBlockStart = anchor.top - content.height - offset;
  if (placement === 'right') {
    insetBlockStart = anchor.top;
    insetInlineStart = anchor.right + offset;
  }
  if (placement === 'left') {
    insetBlockStart = anchor.top;
    insetInlineStart = anchor.left - content.width - offset;
  }

  if (insetBlockStart + content.height > viewportBlockSize) {
    insetBlockStart = Math.max(offset, anchor.top - content.height - offset);
  }
  if (insetInlineStart + content.width > viewportInlineSize) {
    insetInlineStart = Math.max(offset, viewportInlineSize - content.width - offset);
  }
  if (insetInlineStart < 0) insetInlineStart = offset;

  return {
    position: 'fixed',
    insetBlockStart,
    insetInlineStart,
    maxInlineSize: Math.max(0, viewportInlineSize - offset * 2),
  };
}
