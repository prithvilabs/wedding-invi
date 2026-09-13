import { memo } from 'react';

type Props = {
  /** Which bolt of cloth. */
  tone?: 'kumkum' | 'brass' | 'leaf' | 'ivory';
  /** 0…1 */
  strength?: number;
  /** The zari runs across the weave; give it the angle of the drape. */
  angle?: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Kanchipuram silk as a surface, not a picture of one.
 *
 * Two crossed sets of very fine lines give the weave; a single wide
 * band of low-opacity light, drifting slowly across it, gives the
 * sheen that tells you the cloth is silk and not cotton. Both are
 * gradients on one element — no image, no mesh, nothing to decode.
 */
function SilkBase({ tone = 'kumkum', strength = 0.5, angle = 18, className = '', style }: Props) {
  return (
    <div
      className={`silk silk--${tone} u-decor ${className}`}
      style={{ '--silk-strength': strength, '--silk-angle': `${angle}deg`, ...style } as React.CSSProperties}
      aria-hidden="true"
    >
      <span className="silk__weave" />
      <span className="silk__sheen u-layer" />
    </div>
  );
}

export const Silk = memo(SilkBase);
