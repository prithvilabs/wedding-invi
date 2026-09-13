import { memo } from 'react';
import { Blossom, type BlossomVariant } from './Blossom';
import { seeded } from './rng';

type Props = {
  /** Number of hanging strings in the bunch. */
  strands?: number;
  /** Height of the longest strand, in CSS pixels. */
  length?: number;
  /** Width the bunch occupies. */
  width?: number;
  /** Varies the arrangement between instances. */
  seed?: number;
  /** Occasional blue and marigold notes threaded through the white. */
  accent?: 'none' | 'blue' | 'warm' | 'both';
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Hanging mallipoo. Each strand sways on its own period and phase so
 * the bunch never pulses in unison — the difference between a real
 * garland moving in a draught and a decorative loop.
 */
function JasmineGarlandBase({
  strands = 5,
  length = 420,
  width = 120,
  seed = 1,
  accent = 'none',
  className = '',
  style,
}: Props) {
  const rand = seeded(seed);

  const strandData = Array.from({ length: strands }, (_, i) => {
    const x = strands === 1 ? width / 2 : (i / (strands - 1)) * (width - 18) + 9;
    const len = length * (0.55 + rand() * 0.45);
    const drift = (rand() - 0.5) * 14;
    const flowers = Math.max(6, Math.round(len / 15));
    const period = 6.5 + rand() * 5;
    const delay = -rand() * period;
    const amplitude = 1.1 + rand() * 1.6;
    return { x, len, drift, flowers, period, delay, amplitude, seed: seed * 31 + i };
  });

  return (
    <div
      className={`garland u-decor ${className}`}
      style={{ width, height: length, ...style }}
      aria-hidden="true"
    >
      <svg
        width={width}
        height={length}
        viewBox={`0 0 ${width} ${length}`}
        fill="none"
        role="presentation"
      >
        {strandData.map((s, i) => {
          const strandRand = seeded(s.seed);
          const path = `M ${s.x} 0 Q ${s.x + s.drift} ${s.len * 0.55} ${s.x + s.drift * 1.5} ${s.len}`;
          return (
            <g
              key={i}
              className="garland__strand"
              style={
                {
                  '--sway-period': `${s.period}s`,
                  '--sway-delay': `${s.delay}s`,
                  '--sway-amplitude': `${s.amplitude}deg`,
                  transformOrigin: `${s.x}px 0px`,
                } as React.CSSProperties
              }
            >
              <path d={path} stroke="var(--c-leaf)" strokeWidth={1.1} opacity={0.55} />
              {Array.from({ length: s.flowers }, (_, f) => {
                const t = (f + 0.5) / s.flowers;
                // Quadratic Bézier evaluated so flowers sit on the string,
                // not merely near it.
                const px = quad(s.x, s.x + s.drift, s.x + s.drift * 1.5, t);
                const py = quad(0, s.len * 0.55, s.len, t);
                const r = strandRand();
                const variant: BlossomVariant =
                  r > 0.92 && (accent === 'blue' || accent === 'both')
                    ? 'bluebell'
                    : r > 0.95 && (accent === 'warm' || accent === 'both')
                      ? 'kanakambaram'
                      : r > 0.82
                        ? 'bud'
                        : 'jasmine';
                return (
                  <Blossom
                    key={f}
                    variant={variant}
                    x={px}
                    y={py}
                    size={7 + strandRand() * 5}
                    rotate={strandRand() * 360}
                    opacity={0.9 + strandRand() * 0.1}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function quad(p0: number, p1: number, p2: number, t: number): number {
  const u = 1 - t;
  return u * u * p0 + 2 * u * t * p1 + t * t * p2;
}

export const JasmineGarland = memo(JasmineGarlandBase);
