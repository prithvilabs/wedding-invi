import { memo, useMemo } from 'react';
import { seeded } from './rng';
import { useReducedMotion } from '../../hooks/useReducedMotion';

type Props = {
  count?: number;
  seed?: number;
  /** Warm petals for lamplit scenes, cool for evening ones. */
  tone?: 'ivory' | 'blue';
  className?: string;
};

/**
 * Occasional falling petals. Deliberately few and slow — a dozen
 * petals drifting reads as a wedding; a hundred reads as confetti.
 * Each is a single composited element on a CSS keyframe, so the
 * whole effect costs nothing per frame on the main thread.
 */
function PetalsBase({ count = 12, seed = 21, tone = 'ivory', className = '' }: Props) {
  const reduced = useReducedMotion();

  const petals = useMemo(() => {
    const rand = seeded(seed);
    return Array.from({ length: count }, () => ({
      left: rand() * 100,
      size: 9 + rand() * 13,
      duration: 17 + rand() * 20,
      delay: -rand() * 34,
      drift: (rand() - 0.5) * 180,
      spin: 180 + rand() * 540,
      opacity: 0.35 + rand() * 0.45,
    }));
  }, [count, seed]);

  // Still air when motion is reduced: the petals simply aren't shed.
  if (reduced) return null;

  return (
    <div className={`petals petals--${tone} u-decor ${className}`} aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className="petals__petal u-layer"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 0.62,
              opacity: p.opacity,
              '--petal-duration': `${p.duration}s`,
              '--petal-delay': `${p.delay}s`,
              '--petal-drift': `${p.drift}px`,
              '--petal-spin': `${p.spin}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export const Petals = memo(PetalsBase);
