import { memo, useMemo } from 'react';

type Props = {
  size?: number;
  /** Lays the kolam on stroke by stroke, the way rice flour is actually put down. */
  drawn?: boolean;
  /** Milliseconds before the first stroke. */
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
};

/** 3–5–7–5–3 pulli, the classic diamond lattice. */
const ROWS = [3, 5, 7, 5, 3];
const STEP = 21;
const CX = 100;
const CY = 100;

/**
 * A sikku kolam: pulli (dots) laid in a diamond lattice, with the
 * kambi — the line — woven around them.
 *
 * Deliberately *not* radial. A ring of petals around a centre is a
 * mandala, which belongs to a different tradition; a sikku kolam is
 * an interlaced line travelling around a dot grid, and the difference
 * is the whole point of having it here. The loops are rounded squares
 * set on the diagonal and overlapping their neighbours, which is what
 * produces the woven look when they cross.
 *
 * This is the only thing on the site that is literally drawn, and it
 * earns that because a kolam *is* a drawing — made of line, at a
 * threshold, by hand. So it is drawn on rather than faded in.
 */
function KolamBase({ size = 260, drawn = false, delay = 0, className = '', style }: Props) {
  const { dots, loops } = useMemo(() => {
    const dots: Array<[number, number]> = [];
    ROWS.forEach((count, r) => {
      for (let c = 0; c < count; c++) {
        dots.push([CX + (c - (count - 1) / 2) * STEP, CY + (r - (ROWS.length - 1) / 2) * STEP]);
      }
    });

    // A loop sits on each dot of the inner lattice. Overlapping at the
    // corners is what makes the line read as woven rather than stacked.
    const loops = dots.filter(([x, y]) => {
      const d = Math.abs(x - CX) / STEP + Math.abs(y - CY) / STEP;
      return d <= 2.01;
    });

    return { dots, loops };
  }, []);

  // A rounded square on the diagonal, sized to just reach its neighbours.
  const arm = STEP * 0.95;
  const bow = STEP * 0.52;
  const loop =
    `M 0 ${-arm} ` +
    `C ${bow} ${-arm + bow}, ${arm - bow} ${-bow}, ${arm} 0 ` +
    `C ${arm - bow} ${bow}, ${bow} ${arm - bow}, 0 ${arm} ` +
    `C ${-bow} ${arm - bow}, ${-arm + bow} ${bow}, ${-arm} 0 ` +
    `C ${-arm + bow} ${-bow}, ${-bow} ${-arm + bow}, 0 ${-arm} Z`;

  return (
    <div
      className={`kolam u-decor ${drawn ? 'is-drawn' : ''} ${className}`}
      style={{ width: size, height: size, '--kolam-delay': `${delay}ms`, ...style } as React.CSSProperties}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" fill="none" role="presentation">
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.5} fill="currentColor" opacity={0.4} />
        ))}

        <g
          className="kolam__line"
          stroke="currentColor"
          strokeWidth={1.35}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {loops.map(([x, y], i) => (
            <path
              key={i}
              pathLength={100}
              style={{ '--stroke-index': i } as React.CSSProperties}
              d={loop}
              transform={`translate(${x} ${y})`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

export const Kolam = memo(KolamBase);
