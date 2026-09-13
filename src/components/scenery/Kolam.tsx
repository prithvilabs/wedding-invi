import { memo } from 'react';

type Props = {
  size?: number;
  /** Draws the kolam on as the section arrives, as if being laid by hand. */
  drawn?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * A pulli kolam — dot lattice with a continuous looping line around it.
 * Drawn rather than placed: the stroke traces itself when the scene
 * arrives, the way rice flour is actually laid at a threshold.
 */
function KolamBase({ size = 260, drawn = false, className = '', style }: Props) {
  const dots: Array<[number, number]> = [];
  for (let r = 0; r < 5; r++) {
    const count = 5 - Math.abs(r - 2) * 2 + 2;
    for (let c = 0; c < count; c++) {
      dots.push([100 + (c - (count - 1) / 2) * 30, 40 + r * 30]);
    }
  }

  return (
    <div
      className={`kolam u-decor ${drawn ? 'is-drawn' : ''} ${className}`}
      style={{ width: size, height: size, ...style }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" fill="none" role="presentation">
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.9} fill="currentColor" opacity={0.45} />
        ))}
        <g className="kolam__line" stroke="currentColor" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Outer ring of loops — the line turns around each edge dot
              and comes back, the way a sikku kolam is actually drawn. */}
          {Array.from({ length: 12 }, (_, i) => (
            <path
              key={`o${i}`}
              d="M100 26 Q116 44 100 62 Q84 44 100 26 Z"
              transform={`rotate(${i * 30} 100 100)`}
            />
          ))}
          {/* Inner lotus */}
          {Array.from({ length: 8 }, (_, i) => (
            <path
              key={`i${i}`}
              d="M100 62 Q113 78 100 92 Q87 78 100 62 Z"
              transform={`rotate(${i * 45} 100 100)`}
            />
          ))}
          <circle cx={100} cy={100} r={9} />
          <circle cx={100} cy={100} r={3.4} />
        </g>
      </svg>
    </div>
  );
}

export const Kolam = memo(KolamBase);
