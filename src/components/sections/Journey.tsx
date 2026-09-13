import { Scene, SceneContent, SceneLayer } from '../ui/Scene';
import { Reveal } from '../ui/Reveal';
import { Gopuram } from '../scenery/Gopuram';
import { JasmineGarland } from '../scenery/JasmineGarland';
import { KuthuVilakku } from '../scenery/KuthuVilakku';
import { Bokeh } from '../scenery/Bokeh';
import { Haze } from '../scenery/Haze';
import { useParallax } from '../../hooks/useParallax';
import { journey } from '../../data/wedding';

/**
 * India ↔ USA.
 *
 * Not a map. Two lit environments at either end of a tall scene — a
 * gopuram skyline under lamplight, a cold grid of windows across the
 * water — and a line of light that travels between them as the
 * visitor scrolls. The line is drawn by the scene's own progress, so
 * the journey advances exactly as far as the visitor has come: it
 * reaches across, it returns, and by the foot of the scene both
 * skylines are standing in the same blue air.
 */
export function Journey() {
  const indiaRef = useParallax<HTMLDivElement>({ speed: -0.18, maxShift: 150 });
  const usaRef = useParallax<HTMLDivElement>({ speed: -0.1, maxShift: 130 });
  const garlandRef = useParallax<HTMLDivElement>({ speed: 0.3, maxShift: 220, disableBelow: 900 });

  return (
    <Scene id="journey" light="night" label="India and USA" className="journey">
      <SceneLayer depth="back">
        <Bokeh count={12} seed={101} />
        <Haze from="top" tone="blue" strength={1} />
      </SceneLayer>

      {/* The line of light, drawn by scroll */}
      <SceneLayer depth="mid" className="journey__wire">
        <svg viewBox="0 0 1000 1400" preserveAspectRatio="xMidYMid slice" fill="none" role="presentation">
          <defs>
            <linearGradient id="wire-glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--c-gold-soft)" />
              <stop offset="48%" stopColor="var(--c-blue-powder)" />
              <stop offset="100%" stopColor="var(--c-gold)" />
            </linearGradient>
          </defs>
          {/* The path it will take, barely visible until travelled */}
          <path className="journey__wire-ghost" d={WIRE} stroke="var(--c-blue-french)" strokeWidth="1.4" opacity="0.22" />
          {/* The journey itself */}
          <path className="journey__wire-live" d={WIRE} stroke="url(#wire-glow)" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      </SceneLayer>

      {/* India: warm, lamplit, built of towers */}
      <SceneLayer depth="architecture" className="journey__end journey__end--india">
        <div ref={indiaRef} className="journey__skyline u-layer">
          <Gopuram depth={1} tiers={7} className="journey__tower journey__tower--a" />
          <Gopuram depth={0} tiers={5} className="journey__tower journey__tower--b" />
          <Gopuram depth={2} tiers={6} className="journey__tower journey__tower--c" />
        </div>
        <KuthuVilakku height={150} phase={0.4} className="journey__lamp" />
      </SceneLayer>

      {/* USA: cool, distant, a grid of lit windows */}
      <SceneLayer depth="architecture" className="journey__end journey__end--usa">
        <div ref={usaRef} className="journey__city u-layer">
          <svg viewBox="0 0 900 420" preserveAspectRatio="xMidYMax meet" role="presentation">
            {CITY.map((b, i) => (
              <g key={i}>
                <rect x={b.x} y={420 - b.h} width={b.w} height={b.h} fill="currentColor" />
                {Array.from({ length: Math.floor(b.h / 26) }, (_, r) =>
                  Array.from({ length: Math.max(1, Math.floor(b.w / 18)) }, (_, c) => (
                    <rect
                      key={`${r}-${c}`}
                      x={b.x + 6 + c * 18}
                      y={420 - b.h + 12 + r * 26}
                      width={7}
                      height={11}
                      fill="var(--c-blue-mist)"
                      opacity={(i * 7 + r * 3 + c * 5) % 4 === 0 ? 0.55 : 0.16}
                    />
                  )),
                )}
              </g>
            ))}
          </svg>
        </div>
      </SceneLayer>

      <SceneLayer depth="front">
        <div ref={garlandRef} className="journey__foreground u-layer">
          <JasmineGarland strands={4} length={300} width={140} seed={107} accent="blue" className="journey__garland" />
        </div>
      </SceneLayer>

      <SceneContent className="journey__content">
        <Reveal variant="fade">
          <p className="u-eyebrow journey__eyebrow">{journey.eyebrow}</p>
        </Reveal>
        <Reveal as="h2" variant="curtain" delay={140} className="journey__title u-display">
          {journey.title}
        </Reveal>

        {/* Each place is named where it actually stands in the scene:
            India up among the towers, USA down among the windows. The
            beats fall between them, along the line of light. */}
        <Reveal variant="rise" delay={260} className="journey__place journey__place--origin">
          <span className="journey__place-name u-display">{journey.origin.name}</span>
          <span className="journey__place-caption u-label">{journey.origin.caption}</span>
        </Reveal>

        <ol className="journey__beats">
          {journey.beats.map((beat, i) => (
            <Reveal key={beat.key} as="li" variant="settle" delay={i * 140} className="journey__beat">
              <span className="journey__beat-label u-label">{beat.label}</span>
              <p className="journey__beat-line u-serif-body">{beat.line}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal variant="rise" delay={200} className="journey__place journey__place--destination">
          <span className="journey__place-name u-display">{journey.destination.name}</span>
          <span className="journey__place-caption u-label">{journey.destination.caption}</span>
        </Reveal>
      </SceneContent>

      <Haze from="bottom" tone="blue" strength={0.85} />
    </Scene>
  );
}

/* Out from India, across, and back again — ending where it started,
   which is the whole point of the section. */
const WIRE =
  'M 210 180 C 470 240 780 320 800 520 C 818 700 520 760 430 880 C 350 990 460 1120 520 1240';

const CITY = [
  { x: 40, w: 70, h: 190 },
  { x: 120, w: 54, h: 290 },
  { x: 184, w: 86, h: 150 },
  { x: 280, w: 62, h: 340 },
  { x: 352, w: 74, h: 220 },
  { x: 436, w: 50, h: 386 },
  { x: 496, w: 80, h: 178 },
  { x: 586, w: 58, h: 268 },
  { x: 654, w: 88, h: 132 },
  { x: 752, w: 66, h: 236 },
  { x: 828, w: 44, h: 168 },
];
