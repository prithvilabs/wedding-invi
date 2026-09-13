import { memo } from 'react';
import { Blossom, type BlossomVariant } from './Blossom';
import { seeded } from './rng';

type Props = {
  count?: number;
  seed?: number;
  palette?: 'ivory' | 'blue' | 'warm' | 'mixed';
  size?: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * A gathered bunch of flowers — the kind tucked into a corner, at the
 * foot of a pillar, or along the edge of a frame. Grown outward from
 * a centre so it reads as one arrangement rather than scattered heads.
 */
function FlowerClusterBase({
  count = 26,
  seed = 5,
  palette = 'ivory',
  size = 220,
  className = '',
  style,
}: Props) {
  const rand = seeded(seed);
  const R = 100;

  const pick = (r: number): BlossomVariant => {
    switch (palette) {
      case 'blue':
        return r > 0.55 ? 'bluebell' : r > 0.9 ? 'bud' : 'jasmine';
      case 'warm':
        return r > 0.78 ? 'marigold' : r > 0.58 ? 'kanakambaram' : 'jasmine';
      case 'mixed':
        return r > 0.9 ? 'marigold' : r > 0.76 ? 'bluebell' : r > 0.56 ? 'rose' : 'jasmine';
      default:
        return r > 0.88 ? 'bluebell' : r > 0.66 ? 'rose' : r > 0.54 ? 'bud' : 'jasmine';
    }
  };

  return (
    <div
      className={`cluster u-decor ${className}`}
      style={{ width: size, height: size, ...style }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" fill="none" role="presentation">
        {Array.from({ length: Math.round(count * 0.6) }, (_, i) => {
          const a = rand() * Math.PI * 2;
          const d = rand() * R * 0.9;
          return (
            <path
              key={`leaf${i}`}
              d="M0 0 Q11 15 0 32 Q-11 15 0 0 Z"
              transform={`translate(${100 + Math.cos(a) * d} ${100 + Math.sin(a) * d}) rotate(${rand() * 360}) scale(${0.7 + rand() * 0.8})`}
              fill={rand() > 0.5 ? 'var(--c-leaf)' : 'var(--c-leaf-deep)'}
              opacity={0.55}
            />
          );
        })}
        {Array.from({ length: count }, (_, i) => {
          const a = rand() * Math.PI * 2;
          // sqrt keeps the bunch dense at the heart, airy at the edge.
          const d = Math.sqrt(rand()) * R * 0.86;
          return (
            <Blossom
              key={i}
              variant={pick(rand())}
              x={100 + Math.cos(a) * d}
              y={100 + Math.sin(a) * d * 0.82}
              size={9 + rand() * 12}
              rotate={rand() * 360}
              opacity={0.85 + rand() * 0.15}
            />
          );
        })}
      </svg>
    </div>
  );
}

export const FlowerCluster = memo(FlowerClusterBase);
