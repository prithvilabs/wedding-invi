import { memo } from 'react';
import { Blossom } from './Blossom';
import { seeded } from './rng';

type Props = {
  side?: 'left' | 'right';
  /** Carved stone, or a pillar wrapped in flowers for the mandapam. */
  dressed?: boolean;
  height?: string;
  width?: number;
  seed?: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * A carved mandapam pillar — square shaft, corbel bracket, lotus
 * capital. When `dressed`, it is bound in jasmine the way pillars are
 * wrapped for a wedding.
 */
function PillarBase({
  side = 'left',
  dressed = false,
  height = '100%',
  width = 130,
  seed = 3,
  className = '',
  style,
}: Props) {
  const rand = seeded(seed);
  const W = 130;
  const H = 900;

  return (
    <div
      className={`pillar pillar--${side} u-decor ${className}`}
      style={{ height, width, ...style }}
      aria-hidden="true"
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" fill="none" role="presentation">
        <defs>
          <linearGradient id={`stone-${seed}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--c-beige)" />
            <stop offset="24%" stopColor="var(--c-ivory)" />
            <stop offset="62%" stopColor="var(--c-cream)" />
            <stop offset="100%" stopColor="var(--c-sand)" />
          </linearGradient>
        </defs>

        {/* Capital and corbel */}
        <rect x={4} y={0} width={122} height={26} fill={`url(#stone-${seed})`} />
        <path d="M14 26 L112 26 L100 54 L26 54 Z" fill={`url(#stone-${seed})`} />
        <rect x={20} y={54} width={86} height={14} fill="var(--c-sand)" opacity={0.6} />

        {/* Lotus band */}
        <g fill="var(--c-cream)" stroke="var(--c-sand)" strokeWidth={0.8}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M${26 + i * 15} 68 q7.5 -13 15 0 z`} />
          ))}
        </g>

        {/* Shaft with carved panels */}
        <rect x={30} y={80} width={70} height={H - 150} fill={`url(#stone-${seed})`} />
        <rect x={30} y={80} width={9} height={H - 150} fill="var(--c-ivory)" opacity={0.75} />
        <rect x={91} y={80} width={9} height={H - 150} fill="var(--c-sand)" opacity={0.5} />
        {Array.from({ length: 7 }, (_, i) => {
          const y = 130 + i * 108;
          return (
            <g key={i} opacity={0.42}>
              <rect x={44} y={y} width={42} height={72} stroke="var(--c-sand)" strokeWidth={1.1} fill="none" />
              <path
                d={`M65 ${y + 12} q16 14 0 30 q-16 -16 0 -30 z`}
                fill="var(--c-sand)"
                opacity={0.55}
              />
              <path d={`M52 ${y + 52} h26 M56 ${y + 60} h18`} stroke="var(--c-sand)" strokeWidth={1} />
            </g>
          );
        })}

        {/* Base plinth */}
        <rect x={22} y={H - 70} width={86} height={22} fill={`url(#stone-${seed})`} />
        <rect x={10} y={H - 48} width={110} height={30} fill={`url(#stone-${seed})`} />
        <rect x={10} y={H - 48} width={110} height={30} fill="var(--c-navy)" opacity={0.07} />

        {/* Jasmine binding, spiralling down the shaft */}
        {dressed && (
          <g className="pillar__dressing">
            <path
              d={Array.from({ length: 9 }, (_, i) => {
                const y = 96 + i * ((H - 200) / 9);
                return `${i === 0 ? 'M 34' : 'Q 96'} ${y} ${i === 0 ? '' : `34 ${y + (H - 200) / 18}`}`;
              }).join(' ')}
              stroke="var(--c-leaf)"
              strokeWidth={1.4}
              fill="none"
              opacity={0.5}
            />
            {Array.from({ length: 34 }, (_, i) => {
              const t = i / 33;
              const y = 96 + t * (H - 210);
              const x = 65 + Math.sin(t * Math.PI * 9) * 33;
              const r = rand();
              return (
                <Blossom
                  key={i}
                  variant={r > 0.9 ? 'bluebell' : r > 0.78 ? 'bud' : 'jasmine'}
                  x={x}
                  y={y}
                  size={13 + rand() * 8}
                  rotate={rand() * 360}
                />
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}

export const Pillar = memo(PillarBase);
