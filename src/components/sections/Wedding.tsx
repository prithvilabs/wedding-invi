import { Scene, SceneContent, SceneLayer } from '../ui/Scene';
import { Reveal } from '../ui/Reveal';
import { Pillar } from '../scenery/Pillar';
import { FloralArch } from '../scenery/FloralArch';
import { JasmineGarland } from '../scenery/JasmineGarland';
import { KuthuVilakku } from '../scenery/KuthuVilakku';
import { FlowerCluster } from '../scenery/FlowerCluster';
import { Thoranam } from '../scenery/Thoranam';
import { Kolam } from '../scenery/Kolam';
import { Petals } from '../scenery/Petals';
import { Haze } from '../scenery/Haze';
import { useParallax } from '../../hooks/useParallax';
import { useReveal } from '../../hooks/useReveal';
import { events } from '../../data/wedding';

/**
 * The mandapam — the grandest room in the house.
 *
 * Everything the site has been building towards is standing here at
 * once: dressed pillars, a full arch, garlands to the floor, four
 * lamps, a kolam at the threshold. The date carries the scene.
 *
 * The ceremony details are not invented. `detailsPlaceholder` holds
 * the family's exact words until there are real ones.
 */
export function Wedding() {
  const hallRef = useParallax<HTMLDivElement>({ speed: -0.14, zoom: 0.05, maxShift: 150 });
  const garlandRef = useParallax<HTMLDivElement>({ speed: 0.26, maxShift: 240, disableBelow: 600 });
  const { ref: archRef, revealed: archBuilt } = useReveal<HTMLDivElement>({ threshold: 0.15 });
  const { ref: kolamRef, revealed: kolamIn } = useReveal<HTMLDivElement>({ threshold: 0.4 });

  return (
    <Scene id="wedding" light="ceremony" label="The wedding" className="wedding">
      <SceneLayer depth="back">
        <Haze from="top" tone="blue" strength={0.7} />
        <Haze from="centre" tone="warm" strength={0.5} />
      </SceneLayer>

      <SceneLayer depth="architecture" stage>
        <div ref={hallRef} className="wedding__hall u-layer">
          <Pillar side="left" dressed seed={113} width={150} className="wedding__pillar" />
          <Pillar side="right" dressed seed={127} width={150} className="wedding__pillar" />
          <div ref={archRef} className="wedding__arch-holder">
            <FloralArch palette="jasmine" density={78} seed={131} built={archBuilt} />
          </div>
        </div>
        <Thoranam swags={7} seed={137} />
      </SceneLayer>

      <SceneLayer depth="mid" stage className="wedding__lamps">
        <KuthuVilakku height={260} phase={0} className="wedding__lamp wedding__lamp--far-left" />
        <KuthuVilakku height={200} phase={0.8} className="wedding__lamp wedding__lamp--left" />
        <KuthuVilakku height={200} phase={1.6} className="wedding__lamp wedding__lamp--right" />
        <KuthuVilakku height={260} phase={2.4} className="wedding__lamp wedding__lamp--far-right" />
      </SceneLayer>

      <SceneLayer depth="front" stage>
        <div ref={garlandRef} className="wedding__drape u-layer">
          {/* Positioned along the flanks only — the centre of the
              mandapam is kept clear for the date. */}
          {[2, 9, 16, 84, 91, 98].map((left, i) => (
            <JasmineGarland
              key={left}
              strands={4}
              length={280 + (i % 3) * 120}
              width={110}
              seed={140 + i}
              accent={i % 2 === 0 ? 'both' : 'blue'}
              style={{ left: `${left}%`, translate: '-50% 0' }}
            />
          ))}
        </div>
        <FlowerCluster count={26} seed={149} palette="mixed" size={260} className="wedding__cluster wedding__cluster--left" />
        <FlowerCluster count={26} seed={151} palette="ivory" size={260} className="wedding__cluster wedding__cluster--right" />
        <Petals count={12} seed={157} />
      </SceneLayer>

      <SceneContent className="wedding__content">
        <Reveal as="h2" variant="fade" className="u-eyebrow">
          {events.wedding.label}
        </Reveal>

        <Reveal as="p" variant="rise" delay={180} className="wedding__date u-display">
          <time dateTime={events.wedding.dateISO}>{events.wedding.dateDisplay}</time>
        </Reveal>

        <Reveal variant="fade" delay={340} className="wedding__long">
          <p className="u-label">{events.wedding.dateLong}</p>
        </Reveal>

        <Reveal variant="settle" delay={480} className="wedding__pending">
          <span className="wedding__rule" aria-hidden="true" />
          {/* Placeholder — replace only when the family confirms. */}
          <p className="wedding__pending-text u-display">{events.wedding.detailsPlaceholder}</p>
          <span className="wedding__rule" aria-hidden="true" />
        </Reveal>

        <div ref={kolamRef} className="wedding__threshold">
          <Kolam size={240} drawn={kolamIn} />
        </div>
      </SceneContent>

      <Haze from="bottom" tone="warm" strength={0.6} />
    </Scene>
  );
}
