import { memo } from 'react';
import { Blossom, type BlossomVariant } from './Blossom';
import { seeded } from './rng';

type Props = {
  /** 'jasmine' for the ceremony, 'roses' for the reception's evening arch. */
  palette?: 'jasmine' | 'roses' | 'blue';
  /** Flowers per side of the arch. */
  density?: number;
  seed?: number;
  /** Fills in as the scene arrives, as though being built. */
  built?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * The floral arch the camera passes through. Flowers are threaded
 * along the arch curve and staggered inwards from both feet, so when
 * it builds it reads as two hands working towards the crown.
 */
function FloralArchBase({
  palette = 'jasmine',
  density = 62,
  seed = 11,
  built = false,
  className = '',
  style,
}: Props) {
  const rand = seeded(seed);
  const W = 1000;
  const H = 620;

  const pick = (r: number): BlossomVariant => {
    if (palette === 'roses') return r > 0.86 ? 'bluebell' : r > 0.52 ? 'rose' : 'jasmine';
    if (palette === 'blue') return r > 0.58 ? 'bluebell' : r > 0.9 ? 'bud' : 'jasmine';
    return r > 0.9 ? 'bluebell' : r > 0.8 ? 'bud' : r > 0.74 ? 'rose' : 'jasmine';
  };

  const total = density * 2;

  return (
    <div
      className={`arch u-decor ${built ? 'is-built' : ''} ${className}`}
      style={style}
      aria-hidden="true"
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMin slice" fill="none" role="presentation">
        {/* The arch frame itself, in ivory */}
        <path
          d={`M120 ${H} L120 300 Q120 84 500 84 Q880 84 880 300 L880 ${H}`}
          stroke="var(--c-cream)"
          strokeWidth={13}
          opacity={0.18}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M120 ${H} L120 300 Q120 84 500 84 Q880 84 880 300 L880 ${H}`}
          stroke="var(--c-leaf)"
          strokeWidth={2.4}
          opacity={0.28}
          fill="none"
        />

        {Array.from({ length: total }, (_, i) => {
          // Interleave from both feet towards the crown.
          const fromLeft = i % 2 === 0;
          const rank = Math.floor(i / 2);
          const t = (rank + 0.5) / density;
          const p = archPoint(fromLeft ? t * 0.5 : 1 - t * 0.5, W, H);
          const r = rand();
          const spreadX = (rand() - 0.5) * 40;
          const spreadY = (rand() - 0.5) * 34;
          return (
            <g
              key={i}
              className="arch__bloom"
              style={{ '--bloom-delay': `${((i / total) * 1.15).toFixed(3)}s` } as React.CSSProperties}
            >
              <Blossom
                variant={pick(r)}
                x={p.x + spreadX}
                y={p.y + spreadY}
                size={11 + rand() * 13}
                rotate={rand() * 360}
                opacity={0.86 + rand() * 0.14}
              />
            </g>
          );
        })}

        {/* Foliage tucked behind the blooms */}
        {Array.from({ length: 34 }, (_, i) => {
          const p = archPoint((i + 0.5) / 26, W, H);
          const a = rand() * 360;
          return (
            <path
              key={`l${i}`}
              d="M0 0 Q9 12 0 26 Q-9 12 0 0 Z"
              transform={`translate(${p.x + (rand() - 0.5) * 34} ${p.y + (rand() - 0.5) * 30}) rotate(${a}) scale(${0.7 + rand() * 0.7})`}
              fill="var(--c-leaf)"
              opacity={0.5}
            />
          );
        })}
      </svg>
    </div>
  );
}

/** Walks the arch: up the left leg, over the crown, down the right. */
function archPoint(t: number, _W: number, H: number): { x: number; y: number } {
  const legShare = 0.26;
  if (t < legShare) {
    return { x: 120, y: H - (t / legShare) * (H - 300) };
  }
  if (t > 1 - legShare) {
    return { x: 880, y: H - ((1 - t) / legShare) * (H - 300) };
  }
  const u = (t - legShare) / (1 - legShare * 2);
  const a = Math.PI - u * Math.PI;
  return { x: 500 - Math.cos(a) * 380, y: 300 - Math.sin(a) * 216 };
}

export const FloralArch = memo(FloralArchBase);
