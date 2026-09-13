import { memo } from 'react';
import { Blossom } from './Blossom';
import { seeded } from './rng';

type Props = {
  /** Number of swags across the span. */
  swags?: number;
  seed?: number;
  className?: string;
};

/**
 * Mango-leaf thoranam — the string of leaves hung across a doorway.
 * Spans the full width of its container and dips between fixings.
 */
function ThoranamBase({ swags = 5, seed = 7, className = '' }: Props) {
  const rand = seeded(seed);
  const W = 1200;
  const H = 120;
  const step = W / swags;

  return (
    <div className={`thoranam u-decor ${className}`} aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="presentation">
        <path
          d={Array.from({ length: swags }, (_, i) => {
            const x0 = i * step;
            return `${i === 0 ? `M ${x0} 8` : ''} Q ${x0 + step / 2} 62 ${x0 + step} 8`;
          }).join(' ')}
          stroke="var(--c-leaf-deep)"
          strokeWidth={2.5}
          fill="none"
          opacity={0.8}
        />
      </svg>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="thoranam__leaves" role="presentation">
        {Array.from({ length: swags }, (_, i) =>
          Array.from({ length: 11 }, (_, l) => {
            const t = (l + 0.5) / 11;
            const x0 = i * step;
            const x = quad(x0, x0 + step / 2, x0 + step, t);
            const y = quad(8, 62, 8, t);
            const lean = (t - 0.5) * 46 + (rand() - 0.5) * 12;
            const len = 26 + rand() * 14;
            return (
              <g key={`${i}-${l}`} transform={`translate(${x} ${y}) rotate(${lean})`}>
                <path
                  d={`M0 0 Q ${len * 0.34} ${len * 0.42} 0 ${len} Q ${-len * 0.34} ${len * 0.42} 0 0 Z`}
                  fill={l % 3 === 0 ? 'var(--c-leaf-deep)' : 'var(--c-leaf)'}
                />
                <path d={`M0 2 L0 ${len - 3}`} stroke="var(--c-leaf-deep)" strokeWidth={0.7} opacity={0.6} />
              </g>
            );
          }),
        )}
        {Array.from({ length: swags + 1 }, (_, i) => (
          <Blossom key={`m${i}`} variant="marigold" x={i * step} y={10} size={20} rotate={i * 37} opacity={0.9} />
        ))}
      </svg>
    </div>
  );
}

function quad(p0: number, p1: number, p2: number, t: number): number {
  const u = 1 - t;
  return u * u * p0 + 2 * u * t * p1 + t * t * p2;
}

export const Thoranam = memo(ThoranamBase);
