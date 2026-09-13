import { memo } from 'react';

/**
 * Every flower in the venue, defined once.
 *
 * Drawn inline, a jasmine head is eleven SVG elements; the site wants
 * thousands of them, and at ~45,000 nodes the browser spends its whole
 * frame budget rasterising petals. Defined here and instanced with
 * `<use>`, each flower costs one node instead of eleven.
 *
 * Fills stay as custom properties: they resolve against each `<use>`
 * site's inherited context, so a flower still takes its colour from
 * the room it is standing in.
 */
function BlossomSpriteBase() {
  return (
    <svg className="blossom-sprite" aria-hidden="true" focusable="false" width="0" height="0">
      <defs>
        {/* Jasmine — mallipoo. Six narrow petals, a warm centre. */}
        <g id="bl-jasmine">
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <ellipse key={a} cy={-5.4} rx={2.05} ry={5.1} transform={`rotate(${a})`} fill="var(--c-jasmine)" stroke="var(--c-jasmine-shade)" strokeWidth={0.28} />
          ))}
          {[30, 150, 270].map((a) => (
            <ellipse key={a} cy={-4.2} rx={1.5} ry={3.9} transform={`rotate(${a})`} fill="var(--c-ivory)" opacity={0.85} />
          ))}
          <circle r={1.75} fill="var(--c-gold-soft)" />
          <circle r={0.85} fill="var(--c-gold)" opacity={0.7} />
        </g>

        {/* White rose — concentric whorls, cream in the shadowed core. */}
        <g id="bl-rose">
          <circle r={9.4} fill="var(--c-jasmine-shade)" opacity={0.55} />
          {[0, 45, 90, 135].map((a) => (
            <ellipse key={a} rx={9.2} ry={5.6} transform={`rotate(${a})`} fill="var(--c-jasmine)" opacity={0.94} />
          ))}
          {[20, 80, 140, 200, 260, 320].map((a) => (
            <ellipse key={a} cy={-3.3} rx={3.2} ry={4.3} transform={`rotate(${a})`} fill="var(--c-ivory)" stroke="var(--c-jasmine-shade)" strokeWidth={0.22} />
          ))}
          <circle r={2.5} fill="var(--c-cream)" />
          <circle r={1.15} fill="var(--c-beige)" opacity={0.8} />
        </g>

        {/* The quiet blue note — small, five-petalled, never dominant. */}
        <g id="bl-bluebell">
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cy={-4.2} rx={2.5} ry={4.2} transform={`rotate(${a})`} fill="var(--c-blue-powder)" stroke="var(--c-blue-dusty)" strokeWidth={0.3} />
          ))}
          <circle r={1.6} fill="var(--c-blue-mist)" />
          <circle r={0.7} fill="var(--c-gold-soft)" opacity={0.75} />
        </g>

        {/* Marigold — used sparingly, as a single warm accent. */}
        <g id="bl-marigold">
          <circle r={7.6} fill="var(--c-marigold)" opacity={0.35} />
          {Array.from({ length: 14 }, (_, i) => (
            <ellipse key={i} cy={-4.9} rx={1.5} ry={3.1} transform={`rotate(${i * 25.7})`} fill="var(--c-marigold)" />
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <ellipse key={`i${i}`} cy={-2.6} rx={1.25} ry={2.3} transform={`rotate(${i * 40 + 18})`} fill="var(--c-gold-soft)" opacity={0.9} />
          ))}
        </g>

        {/* Kanakambaram — slender trumpet, firecracker orange. */}
        <g id="bl-kanakambaram">
          {[0, 72, 144, 216, 288].map((a) => (
            <path key={a} d="M0 0 L-1.7 -6.4 Q0 -8.6 1.7 -6.4 Z" transform={`rotate(${a})`} fill="var(--c-kanakambaram)" />
          ))}
          <circle r={1.2} fill="var(--c-marigold)" />
        </g>

        {/* An unopened bud — what keeps a garland from looking machine-made. */}
        <g id="bl-bud">
          <ellipse rx={2.1} ry={4} fill="var(--c-jasmine)" stroke="var(--c-jasmine-shade)" strokeWidth={0.3} />
          <path d="M0 3.4 L0 6.4" stroke="var(--c-leaf)" strokeWidth={0.75} strokeLinecap="round" />
          <ellipse cy={4.6} rx={1.5} ry={0.85} fill="var(--c-leaf)" opacity={0.8} />
        </g>

        {/* A single leaf, used along garlands and around clusters. */}
        <g id="bl-leaf">
          <path d="M0 0 Q11 15 0 32 Q-11 15 0 0 Z" fill="var(--c-leaf)" />
        </g>
      </defs>
    </svg>
  );
}

export const BlossomSprite = memo(BlossomSpriteBase);
