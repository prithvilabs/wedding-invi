import { memo } from 'react';

type Props = {
  /** 0…1. Anything above ~0.35 stops reading as paper and starts reading as noise. */
  strength?: number;
  className?: string;
};

/**
 * Paper grain.
 *
 * The single cheapest thing that stops a screen looking like a
 * screen: real fibre under the ink. One fixed element, one static
 * turbulence texture, no animation — it costs a composite and
 * nothing else, and every flat colour above it stops being flat.
 */
function GrainBase({ strength = 0.22, className = '' }: Props) {
  return (
    <div
      className={`grain u-decor ${className}`}
      style={{ '--grain-strength': strength } as React.CSSProperties}
      aria-hidden="true"
    />
  );
}

export const Grain = memo(GrainBase);
