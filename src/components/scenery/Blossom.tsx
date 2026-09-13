import { memo } from 'react';

export type BlossomVariant =
  | 'jasmine'
  | 'rose'
  | 'bluebell'
  | 'marigold'
  | 'kanakambaram'
  | 'bud';

type Props = {
  variant: BlossomVariant;
  /** Placement within the parent SVG's user space. */
  x: number;
  y: number;
  size: number;
  rotate?: number;
  opacity?: number;
};

/**
 * A single flower head, drawn in SVG user space. Every flower in the
 * site — garlands, arches, clusters, pillars — is made of these, so
 * lighting and scale stay consistent across the whole venue.
 */
function BlossomBase({ variant, x, y, size, rotate = 0, opacity = 1 }: Props) {
  const s = size / 10;
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}
      opacity={opacity}
    >
      {variant === 'jasmine' && <Jasmine />}
      {variant === 'rose' && <Rose />}
      {variant === 'bluebell' && <Bluebell />}
      {variant === 'marigold' && <Marigold />}
      {variant === 'kanakambaram' && <Kanakambaram />}
      {variant === 'bud' && <Bud />}
    </g>
  );
}

/* Jasmine — mallipoo. Six narrow petals, a warm centre, a cool
   underside where the lamplight does not reach. */
function Jasmine() {
  return (
    <g>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse
          key={a}
          cx={0}
          cy={-5.4}
          rx={2.05}
          ry={5.1}
          transform={`rotate(${a})`}
          fill="var(--c-jasmine)"
          stroke="var(--c-jasmine-shade)"
          strokeWidth={0.28}
        />
      ))}
      {[30, 150, 270].map((a) => (
        <ellipse
          key={a}
          cx={0}
          cy={-4.2}
          rx={1.5}
          ry={3.9}
          transform={`rotate(${a})`}
          fill="var(--c-ivory)"
          opacity={0.85}
        />
      ))}
      <circle r={1.75} fill="var(--c-gold-soft)" />
      <circle r={0.85} fill="var(--c-gold)" opacity={0.7} />
    </g>
  );
}

/* White rose — concentric whorls, cream in the shadowed core. */
function Rose() {
  return (
    <g>
      <circle r={9.4} fill="var(--c-jasmine-shade)" opacity={0.55} />
      {[0, 45, 90, 135].map((a) => (
        <ellipse
          key={a}
          rx={9.2}
          ry={5.6}
          transform={`rotate(${a})`}
          fill="var(--c-jasmine)"
          opacity={0.94}
        />
      ))}
      {[20, 80, 140, 200, 260, 320].map((a) => (
        <ellipse
          key={a}
          cx={0}
          cy={-3.3}
          rx={3.2}
          ry={4.3}
          transform={`rotate(${a})`}
          fill="var(--c-ivory)"
          stroke="var(--c-jasmine-shade)"
          strokeWidth={0.22}
        />
      ))}
      <circle r={2.5} fill="var(--c-cream)" />
      <circle r={1.15} fill="var(--c-beige)" opacity={0.8} />
    </g>
  );
}

/* The quiet blue note — small, five-petalled, never dominant. */
function Bluebell() {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx={0}
          cy={-4.2}
          rx={2.5}
          ry={4.2}
          transform={`rotate(${a})`}
          fill="var(--c-blue-powder)"
          stroke="var(--c-blue-dusty)"
          strokeWidth={0.3}
        />
      ))}
      <circle r={1.6} fill="var(--c-blue-mist)" />
      <circle r={0.7} fill="var(--c-gold-soft)" opacity={0.75} />
    </g>
  );
}

/* Marigold — used sparingly, as a single warm accent. */
function Marigold() {
  return (
    <g>
      <circle r={7.6} fill="var(--c-marigold)" opacity={0.35} />
      {Array.from({ length: 14 }, (_, i) => (
        <ellipse
          key={i}
          cx={0}
          cy={-4.9}
          rx={1.5}
          ry={3.1}
          transform={`rotate(${i * 25.7})`}
          fill="var(--c-marigold)"
        />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <ellipse
          key={`i${i}`}
          cx={0}
          cy={-2.6}
          rx={1.25}
          ry={2.3}
          transform={`rotate(${i * 40 + 18})`}
          fill="var(--c-gold-soft)"
          opacity={0.9}
        />
      ))}
    </g>
  );
}

/* Kanakambaram — slender trumpet, firecracker orange. */
function Kanakambaram() {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((a) => (
        <path
          key={a}
          d="M0 0 L-1.7 -6.4 Q0 -8.6 1.7 -6.4 Z"
          transform={`rotate(${a})`}
          fill="var(--c-kanakambaram)"
        />
      ))}
      <circle r={1.2} fill="var(--c-marigold)" />
    </g>
  );
}

/* An unopened bud — what keeps a garland from looking machine-made. */
function Bud() {
  return (
    <g>
      <ellipse rx={2.1} ry={4} fill="var(--c-jasmine)" stroke="var(--c-jasmine-shade)" strokeWidth={0.3} />
      <path d="M0 3.4 L0 6.4" stroke="var(--c-leaf)" strokeWidth={0.75} strokeLinecap="round" />
      <ellipse cx={0} cy={4.6} rx={1.5} ry={0.85} fill="var(--c-leaf)" opacity={0.8} />
    </g>
  );
}

export const Blossom = memo(BlossomBase);
