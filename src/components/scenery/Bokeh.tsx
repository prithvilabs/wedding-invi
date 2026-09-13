import { memo, useMemo } from 'react';
import { seeded } from './rng';

type Props = {
  count?: number;
  seed?: number;
  className?: string;
};

/**
 * Out-of-focus lamplight. Part of the depth-of-field rather than a
 * particle effect: these only ever appear in the blurred planes of a
 * scene, and they breathe rather than move.
 */
function BokehBase({ count = 9, seed = 33, className = '' }: Props) {
  const lights = useMemo(() => {
    const rand = seeded(seed);
    return Array.from({ length: count }, () => ({
      x: rand() * 100,
      y: rand() * 100,
      size: 40 + rand() * 120,
      opacity: 0.1 + rand() * 0.22,
      duration: 9 + rand() * 11,
      delay: -rand() * 14,
      warm: rand() > 0.45,
    }));
  }, [count, seed]);

  return (
    <div className={`bokeh u-decor ${className}`} aria-hidden="true">
      {lights.map((l, i) => (
        <span
          key={i}
          className={`bokeh__light ${l.warm ? 'is-warm' : 'is-cool'}`}
          style={
            {
              left: `${l.x}%`,
              top: `${l.y}%`,
              width: l.size,
              height: l.size,
              opacity: l.opacity,
              '--bokeh-duration': `${l.duration}s`,
              '--bokeh-delay': `${l.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export const Bokeh = memo(BokehBase);
