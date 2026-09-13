import { memo } from 'react';

type Props = {
  /** Where the light is standing. Nothing is drawn there — only its effect. */
  from?: 'bottom-left' | 'bottom-right' | 'bottom' | 'left' | 'right' | 'above';
  /** 0…1. How much of the room this source is carrying. */
  strength?: number;
  /** Radius of the pool of light, in viewport widths. */
  spread?: number;
  /** Seconds. Two sources in one room must never breathe in step. */
  phase?: number;
  /** A flame moves; a bulb does not. */
  flicker?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * A brass lamp, given as light rather than as an object.
 *
 * There is no vilakku on this page — no drawn lamp, no flame, no
 * brass. What there is instead is what a lamp actually does to a
 * room: a warm pool that falls off with distance, a faint bounce
 * off the surface it stands on, and a slow unsteadiness in the
 * whole of it, because an oil flame is never quite still.
 *
 * Three stacked radial gradients do the falloff — one tight and
 * near-white at the core, one wide and amber, one very wide and
 * almost gone — because a single gradient reads as a glow effect
 * and three read as distance. The flicker is on `opacity` and
 * `scale` only, so the whole thing lives on the compositor.
 */
function LamplightBase({
  from = 'bottom-left',
  strength = 0.7,
  spread = 0.9,
  phase = 0,
  flicker = true,
  className = '',
  style,
}: Props) {
  return (
    <div
      className={`lamplight lamplight--${from} ${flicker ? 'is-flickering' : ''} u-decor ${className}`}
      style={
        {
          '--lamp-strength': strength,
          '--lamp-spread': spread,
          '--lamp-phase': `${-phase}s`,
          ...style,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <span className="lamplight__core" />
      <span className="lamplight__pool" />
      <span className="lamplight__reach" />
      {/* What the light finds on the floor in front of it. */}
      <span className="lamplight__bounce" />
    </div>
  );
}

export const Lamplight = memo(LamplightBase);
