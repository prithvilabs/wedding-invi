import { memo } from 'react';

/**
 * Every flower on the page, defined once.
 *
 * Drawn inline, a jasmine head is eleven SVG elements, and the site
 * wants hundreds of them; at that node count the browser spends its
 * whole frame budget rasterising petals. Defined here and instanced
 * with `<use>`, each flower costs one node instead of eleven.
 *
 * Fills stay as custom properties so they resolve against each
 * `<use>` site — a flower takes its colour from the room it is
 * standing in, which is what stops a garland looking pasted on.
 */
function BlossomSpriteBase() {
  return (
    <svg className="blossom-sprite" aria-hidden="true" focusable="false" width="0" height="0">
      <defs>
        {/* Mallipoo — jasmine. Six narrow petals, a warm centre. */}
        <g id="bl-jasmine">
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <ellipse key={a} cy={-5.4} rx={2.05} ry={5.1} transform={`rotate(${a})`} fill="var(--c-jasmine)" stroke="var(--c-jasmine-shade)" strokeWidth={0.28} />
          ))}
          {[30, 150, 270].map((a) => (
            <ellipse key={a} cy={-4.2} rx={1.5} ry={3.9} transform={`rotate(${a})`} fill="var(--c-ivory)" opacity={0.85} />
          ))}
          <circle r={1.75} fill="var(--c-turmeric)" opacity={0.55} />
          <circle r={0.85} fill="var(--c-brass)" opacity={0.6} />
        </g>

        {/* Sevvanthi — marigold. The one flower a Tamil wedding has by the kilo. */}
        <g id="bl-marigold">
          <circle r={7.6} fill="var(--c-marigold)" opacity={0.32} />
          {Array.from({ length: 14 }, (_, i) => (
            <ellipse key={i} cy={-4.9} rx={1.5} ry={3.1} transform={`rotate(${i * 25.7})`} fill="var(--c-marigold)" />
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <ellipse key={`i${i}`} cy={-2.6} rx={1.25} ry={2.3} transform={`rotate(${i * 40 + 18})`} fill="var(--c-turmeric)" opacity={0.9} />
          ))}
        </g>

        {/* Kanakambaram — slender firecracker-orange trumpet. */}
        <g id="bl-kanakambaram">
          {[0, 72, 144, 216, 288].map((a) => (
            <path key={a} d="M0 0 L-1.7 -6.4 Q0 -8.6 1.7 -6.4 Z" transform={`rotate(${a})`} fill="var(--c-kanakambaram)" />
          ))}
          <circle r={1.2} fill="var(--c-turmeric)" />
        </g>

        {/* Arali — the quiet pink note. Small, five-petalled, never dominant. */}
        <g id="bl-arali">
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cy={-4.2} rx={2.5} ry={4.2} transform={`rotate(${a})`} fill="var(--c-blush-deep)" stroke="var(--c-magenta)" strokeWidth={0.26} opacity={0.92} />
          ))}
          <circle r={1.6} fill="var(--c-blush)" />
          <circle r={0.7} fill="var(--c-turmeric)" opacity={0.7} />
        </g>

        {/* Rose — concentric whorls, cream in the shadowed core. */}
        <g id="bl-rose">
          <circle r={9.4} fill="var(--c-jasmine-shade)" opacity={0.5} />
          {[0, 45, 90, 135].map((a) => (
            <ellipse key={a} rx={9.2} ry={5.6} transform={`rotate(${a})`} fill="var(--c-jasmine)" opacity={0.94} />
          ))}
          {[20, 80, 140, 200, 260, 320].map((a) => (
            <ellipse key={a} cy={-3.3} rx={3.2} ry={4.3} transform={`rotate(${a})`} fill="var(--c-ivory)" stroke="var(--c-jasmine-shade)" strokeWidth={0.22} />
          ))}
          <circle r={2.5} fill="var(--c-paper)" />
          <circle r={1.15} fill="var(--c-sandal)" opacity={0.8} />
        </g>

        {/* An unopened bud — what keeps a garland from looking machine-strung. */}
        <g id="bl-bud">
          <ellipse rx={2.1} ry={4} fill="var(--c-jasmine)" stroke="var(--c-jasmine-shade)" strokeWidth={0.3} />
          <path d="M0 3.4 L0 6.4" stroke="var(--c-leaf)" strokeWidth={0.75} strokeLinecap="round" />
          <ellipse cy={4.6} rx={1.5} ry={0.85} fill="var(--c-leaf)" opacity={0.8} />
        </g>

        {/* Mango leaf — the thoranam leaf, used singly rather than strung. */}
        <g id="bl-leaf">
          <path d="M0 0 Q9 15 0 33 Q-9 15 0 0 Z" fill="var(--c-leaf)" />
          <path d="M0 2 L0 30" stroke="var(--c-leaf-deep)" strokeWidth={0.5} opacity={0.5} />
        </g>
      </defs>
    </svg>
  );
}

export const BlossomSprite = memo(BlossomSpriteBase);
