import { memo } from 'react';

type Props = {
  /** Height of the lamp in CSS pixels. */
  height?: number;
  /** Staggers the flicker between the two lamps of a pair. */
  phase?: number;
  /** The pool of warm light the lamp throws onto nearby flowers. */
  glow?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Brass kuthu vilakku. The flame is a real light source in this scene:
 * it flickers, and it warms everything within its radius — which is
 * what makes the surrounding blue read as cold evening air rather
 * than as a colour choice.
 */
function KuthuVilakkuBase({ height = 320, phase = 0, glow = true, className = '', style }: Props) {
  const W = 120;
  const H = 400;

  return (
    <div
      className={`vilakku u-decor ${className}`}
      style={{ height, aspectRatio: `${W} / ${H}`, '--flame-phase': `${phase}s`, ...style } as React.CSSProperties}
      aria-hidden="true"
    >
      {glow && <span className="vilakku__pool" />}
      <svg viewBox={`0 0 ${W} ${H}`} fill="none" role="presentation">
        <defs>
          <linearGradient id={`brass-${phase}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--c-gold-deep)" />
            <stop offset="28%" stopColor="var(--c-gold-soft)" />
            <stop offset="52%" stopColor="var(--c-gold)" />
            <stop offset="78%" stopColor="var(--c-brass)" />
            <stop offset="100%" stopColor="var(--c-gold-deep)" />
          </linearGradient>
          <radialGradient id={`flame-${phase}`} cx="50%" cy="62%" r="60%">
            <stop offset="0%" stopColor="var(--c-flame-core)" />
            <stop offset="45%" stopColor="var(--c-flame)" />
            <stop offset="100%" stopColor="var(--c-marigold)" stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* Tiered base — the stacked discs of a temple lamp */}
        <ellipse cx={60} cy={386} rx={54} ry={12} fill="var(--c-gold-deep)" opacity={0.9} />
        <path d="M14 386 Q60 368 106 386 L98 370 Q60 356 22 370 Z" fill={`url(#brass-${phase})`} />
        <ellipse cx={60} cy={362} rx={40} ry={9} fill={`url(#brass-${phase})`} />
        <ellipse cx={60} cy={344} rx={30} ry={7} fill={`url(#brass-${phase})`} />

        {/* Shaft with turned rings */}
        <path d="M52 344 L54 150 L66 150 L68 344 Z" fill={`url(#brass-${phase})`} />
        {[320, 282, 244, 206, 170].map((y, i) => (
          <ellipse key={y} cx={60} cy={y} rx={i % 2 ? 15 : 19} ry={i % 2 ? 4.5 : 6} fill={`url(#brass-${phase})`} />
        ))}

        {/* Oil bowl with five wick spouts */}
        <path d="M22 146 Q60 178 98 146 L92 130 Q60 142 28 130 Z" fill={`url(#brass-${phase})`} />
        <ellipse cx={60} cy={130} rx={34} ry={11} fill="var(--c-gold-soft)" />
        <ellipse cx={60} cy={130} rx={26} ry={7.5} fill="var(--c-gold-deep)" opacity={0.55} />
        {[-34, -20, 20, 34].map((dx) => (
          <path key={dx} d={`M${60 + dx} 132 l${dx < 0 ? -8 : 8} -6 l${dx < 0 ? 3 : -3} 7 Z`} fill="var(--c-gold-deep)" />
        ))}

        {/* Annam — the swan finial above the bowl */}
        <path
          d="M60 116 Q48 110 50 98 Q52 88 60 88 Q68 88 70 98 Q72 110 60 116 Z"
          fill={`url(#brass-${phase})`}
        />

        {/* Flame */}
        <g className="vilakku__flame">
          <ellipse cx={60} cy={74} rx={13} ry={22} fill={`url(#flame-${phase})`} opacity={0.55} />
          <path
            d="M60 44 Q71 62 68 76 Q66 90 60 92 Q54 90 52 76 Q49 62 60 44 Z"
            fill={`url(#flame-${phase})`}
          />
          <path d="M60 60 Q65 72 63 80 Q61 87 60 88 Q59 87 57 80 Q55 72 60 60 Z" fill="var(--c-flame-core)" />
        </g>
      </svg>
    </div>
  );
}

export const KuthuVilakku = memo(KuthuVilakkuBase);
