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
        <g className="kolam__line" stroke="currentColor" strokeWidth={1.6} fill="none" strokeLinecap="round">
          {[0, 45, 90, 135].map((a) => (
            <ellipse key={a} cx={100} cy={100} rx={72} ry={26} transform={`rotate(${a} 100 100)`} />
          ))}
          <circle cx={100} cy={100} r={20} />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <path
              key={`p${a}`}
              d="M100 80 Q114 66 100 50 Q86 66 100 80 Z"
              transform={`rotate(${a} 100 100)`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

export const Kolam = memo(KolamBase);
