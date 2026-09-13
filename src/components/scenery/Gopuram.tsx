import { memo } from 'react';

type Props = {
  /** Further towers sit lighter and hazier — aerial perspective. */
  depth?: 0 | 1 | 2;
  tiers?: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * A gopuram in silhouette. Stacked, tapering tiers with a kalasam
 * ridge — never detailed, always distance.
 */
function GopuramBase({ depth = 1, tiers = 6, className = '', style }: Props) {
  const W = 360;
  const H = 420;
  const baseW = 300;
  const topW = 128;

  return (
    <div
      className={`gopuram gopuram--d${depth} u-decor ${className}`}
      style={style}
      aria-hidden="true"
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax meet" fill="none" role="presentation">
        <g fill="currentColor">
          {Array.from({ length: tiers }, (_, i) => {
            const t = i / tiers;
            const tNext = (i + 1) / tiers;
            const w = baseW - (baseW - topW) * t;
            const wNext = baseW - (baseW - topW) * tNext;
            const h = H / (tiers + 1.6);
            const y = H - 28 - (i + 1) * h;
            return (
              <g key={i}>
                <path
                  d={`M${W / 2 - w / 2} ${y + h} L${W / 2 - wNext / 2} ${y} L${W / 2 + wNext / 2} ${y} L${W / 2 + w / 2} ${y + h} Z`}
                />
                <rect x={W / 2 - wNext / 2 - 6} y={y - 7} width={wNext + 12} height={9} />
                {/* Kalasam finials along the tier ridge */}
                {(() => {
                  const n = Math.max(3, 7 - i);
                  return Array.from({ length: n }, (_, k) => {
                    const x = W / 2 - wNext / 2 + ((k + 0.5) / n) * wNext;
                    return <ellipse key={k} cx={x} cy={y - 11} rx={4.2} ry={7} />;
                  });
                })()}
              </g>
            );
          })}
          {/* Doorway */}
          <path d={`M${W / 2 - 34} ${H - 28} L${W / 2 - 34} ${H - 108} Q${W / 2} ${H - 146} ${W / 2 + 34} ${H - 108} L${W / 2 + 34} ${H - 28} Z`} opacity={0.55} />
          <rect x={20} y={H - 28} width={W - 40} height={28} />
        </g>
      </svg>
    </div>
  );
}

export const Gopuram = memo(GopuramBase);
