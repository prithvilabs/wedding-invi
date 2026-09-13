import { memo } from 'react';

export type BlossomVariant =
  | 'jasmine'
  | 'rose'
  | 'arali'
  | 'marigold'
  | 'kanakambaram'
  | 'bud'
  | 'leaf';

type Props = {
  variant: BlossomVariant;
  /** Placement within the parent SVG's user space. */
  x: number;
  y: number;
  size: number;
  rotate?: number;
  opacity?: number;
};

/**
 * One flower head, placed in SVG user space.
 *
 * This is an instance of a shape defined once in `<BlossomSprite>` —
 * one node on the page rather than eleven. Mount the sprite once at
 * the root or these render as nothing.
 */
function BlossomBase({ variant, x, y, size, rotate = 0, opacity = 1 }: Props) {
  return (
    <use
      href={`#bl-${variant}`}
      transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rotate.toFixed(1)}) scale(${(size / 10).toFixed(3)})`}
      opacity={opacity === 1 ? undefined : opacity}
    />
  );
}

export const Blossom = memo(BlossomBase);
