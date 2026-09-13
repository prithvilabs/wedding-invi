import { Scene, SceneContent, SceneLayer } from '../ui/Scene';
import { Reveal } from '../ui/Reveal';
import { FloralArch } from '../scenery/FloralArch';
import { KuthuVilakku } from '../scenery/KuthuVilakku';
import { FlowerCluster } from '../scenery/FlowerCluster';
import { JasmineGarland } from '../scenery/JasmineGarland';
import { Bokeh } from '../scenery/Bokeh';
import { Haze } from '../scenery/Haze';
import { useParallax } from '../../hooks/useParallax';
import { useReveal } from '../../hooks/useReveal';
import { events } from '../../data/wedding';

/**
 * Evening.
 *
 * The same vocabulary as the ceremony, dressed up and turned down:
 * white roses instead of only jasmine, muted royal-blue drapery, and
 * the lamps now carrying most of the light because the daylight has
 * gone. The venue is the one confirmed fact here, so it is set as
 * the largest thing in the scene after the date.
 */
export function Reception() {
  const drapeRef = useParallax<HTMLDivElement>({ speed: -0.16, maxShift: 140 });
  const foreRef = useParallax<HTMLDivElement>({ speed: 0.24, maxShift: 200, disableBelow: 600 });
  const { ref: archRef, revealed: archBuilt } = useReveal<HTMLDivElement>({ threshold: 0.18 });

  return (
    <Scene id="reception" light="evening" label="The reception" className="reception">
      <SceneLayer depth="back">
        <Bokeh count={11} seed={163} />
        <Haze from="top" tone="blue" strength={1} />
      </SceneLayer>

      {/* Muted royal-blue fabric, falling behind the arch */}
      <SceneLayer depth="architecture" stage>
        <div ref={drapeRef} className="reception__drapery u-layer">
          <svg viewBox="0 0 1200 700" preserveAspectRatio="none" role="presentation">
            {Array.from({ length: 9 }, (_, i) => (
              <path
                key={i}
                d={`M${i * 150} 0 Q${i * 150 + 62} 330 ${i * 150 + 22} 700 L${i * 150 + 150} 700 Q${i * 150 + 110} 330 ${i * 150 + 150} 0 Z`}
                fill={i % 2 ? 'var(--c-blue-muted)' : 'var(--c-navy)'}
                opacity={i % 2 ? 0.5 : 0.62}
              />
            ))}
          </svg>
        </div>
        <div ref={archRef} className="reception__arch-holder">
          <FloralArch palette="roses" density={72} seed={167} built={archBuilt} />
        </div>
      </SceneLayer>

      <SceneLayer depth="mid" stage className="reception__lamps">
        <KuthuVilakku height={230} phase={0.5} className="reception__lamp reception__lamp--left" />
        <KuthuVilakku height={230} phase={2.1} className="reception__lamp reception__lamp--right" />
      </SceneLayer>

      <SceneLayer depth="front" stage>
        <div ref={foreRef} className="reception__foreground u-layer">
          <JasmineGarland strands={3} length={260} width={110} seed={173} accent="blue" className="reception__garland reception__garland--left" />
          <JasmineGarland strands={3} length={230} width={110} seed={179} accent="blue" className="reception__garland reception__garland--right" />
          <FlowerCluster count={26} seed={181} palette="ivory" size={280} className="reception__cluster reception__cluster--left" />
          <FlowerCluster count={22} seed={191} palette="blue" size={250} className="reception__cluster reception__cluster--right" />
        </div>
      </SceneLayer>

      <SceneContent className="reception__content">
        <Reveal as="h2" variant="fade" className="u-eyebrow">
          {events.reception.label}
        </Reveal>

        <Reveal as="p" variant="rise" delay={160} className="reception__date u-display">
          <time dateTime={events.reception.dateISO}>{events.reception.dateDisplay}</time>
        </Reveal>

        <Reveal variant="rise" delay={320} className="reception__venue">
          <span className="reception__venue-name u-display">{events.reception.venue}</span>
          <span className="reception__venue-city u-label">{events.reception.city}</span>
        </Reveal>

        <Reveal variant="fade" delay={460}>
          <p className="reception__pending u-label">{events.reception.detailsPlaceholder}</p>
        </Reveal>
      </SceneContent>

      <Haze from="bottom" tone="blue" strength={0.9} />
    </Scene>
  );
}
