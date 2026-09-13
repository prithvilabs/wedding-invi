import { memo } from 'react';

type Props = {
  /** Which way the light falls into the scene. */
  from?: 'top' | 'bottom' | 'left' | 'right' | 'centre';
  tone?: 'brass' | 'warm' | 'ivory';
  strength?: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Atmospheric haze. This is what separates the layers optically:
 * distant architecture sits behind it and loses contrast, foreground
 * flowers sit in front of it and stay sharp.
 */
function HazeBase({ from = 'bottom', tone = 'warm', strength = 1, className = '', style }: Props) {
  return (
    <div
      className={`haze haze--${from} haze--${tone} u-decor ${className}`}
      style={{ '--haze-strength': strength, ...style } as React.CSSProperties}
      aria-hidden="true"
    />
  );
}

export const Haze = memo(HazeBase);
