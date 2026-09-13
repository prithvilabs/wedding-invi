import { Scene, SceneContent, SceneLayer } from '../ui/Scene';
import { Reveal } from '../ui/Reveal';
import { FloralArch } from '../scenery/FloralArch';
import { Pillar } from '../scenery/Pillar';
import { KuthuVilakku } from '../scenery/KuthuVilakku';
import { JasmineGarland } from '../scenery/JasmineGarland';
import { FlowerCluster } from '../scenery/FlowerCluster';
import { Gopuram } from '../scenery/Gopuram';
import { Kolam } from '../scenery/Kolam';
import { Petals } from '../scenery/Petals';
import { Haze } from '../scenery/Haze';
import { useParallax } from '../../hooks/useParallax';
import { useReveal } from '../../hooks/useReveal';
import { couple, events, finale, rsvp } from '../../data/wedding';

/**
 * The invitation itself.
 *
 * The camera has come all the way through the venue and now stands
 * in front of a blue-and-ivory arch with the names on it. Everything
 * is at its warmest here: the arch builds bloom by bloom, the names
 * arrive one at a time, and the date lands last — the same order as
 * the hero, closing the loop.
 */
export function Finale() {
  const archHolderRef = useParallax<HTMLDivElement>({ speed: -0.12, zoom: 0.04, maxShift: 120 });
  const foreRef = useParallax<HTMLDivElement>({ speed: 0.3, maxShift: 220, disableBelow: 600 });
  const { ref: archRef, revealed: archBuilt } = useReveal<HTMLDivElement>({ threshold: 0.12 });
  const { ref: kolamRef, revealed: kolamIn } = useReveal<HTMLDivElement>({ threshold: 0.35 });

  return (
    <Scene id="rsvp" light="finale" label="The invitation" className="finale">
      <SceneLayer depth="back" stage>
        <Gopuram depth={2} tiers={7} className="finale__tower finale__tower--left" />
        <Gopuram depth={2} tiers={6} className="finale__tower finale__tower--right" />
        <Haze from="top" tone="blue" strength={0.75} />
        <Haze from="centre" tone="warm" strength={0.6} />
      </SceneLayer>

      <SceneLayer depth="architecture" stage>
        <div ref={archHolderRef} className="finale__hall u-layer">
          <Pillar side="left" dressed seed={229} width={130} className="finale__pillar" />
          <Pillar side="right" dressed seed={233} width={130} className="finale__pillar" />
          <div ref={archRef} className="finale__arch-holder">
            <FloralArch palette="roses" density={84} seed={239} built={archBuilt} />
          </div>
        </div>
      </SceneLayer>

      <SceneLayer depth="mid" stage className="finale__lamps">
        <KuthuVilakku height={280} phase={0} className="finale__lamp finale__lamp--left" />
        <KuthuVilakku height={280} phase={1.9} className="finale__lamp finale__lamp--right" />
      </SceneLayer>

      <SceneLayer depth="front" stage>
        <div ref={foreRef} className="finale__foreground u-layer">
          <JasmineGarland strands={5} length={380} width={160} seed={241} accent="both" className="finale__garland finale__garland--left" />
          <JasmineGarland strands={5} length={340} width={160} seed={251} accent="blue" className="finale__garland finale__garland--right" />
          <FlowerCluster count={28} seed={257} palette="mixed" size={280} className="finale__cluster finale__cluster--left" />
          <FlowerCluster count={28} seed={263} palette="ivory" size={280} className="finale__cluster finale__cluster--right" />
        </div>
        <Petals count={14} seed={269} />
      </SceneLayer>

      <SceneContent className="finale__content">
        <Reveal variant="fade" className="finale__eyebrow">
          <p className="u-eyebrow">{finale.eyebrow}</p>
        </Reveal>

        <h2 className="finale__names">
          <Reveal as="span" variant="rise" delay={180} className="finale__name u-display">
            {couple.one}
          </Reveal>
          <Reveal as="span" variant="fade" delay={440} className="finale__amp u-display">
            <span aria-hidden="true">{couple.ampersand}</span>
            <span className="u-visually-hidden">and</span>
          </Reveal>
          <Reveal as="span" variant="rise" delay={700} className="finale__name u-display">
            {couple.two}
          </Reveal>
        </h2>

        <Reveal variant="fade" delay={980} className="finale__date">
          <span className="finale__rule" aria-hidden="true" />
          <p className="u-label">
            <time dateTime={events.wedding.dateISO}>{events.wedding.dateDisplay}</time>
          </p>
          <span className="finale__rule" aria-hidden="true" />
        </Reveal>

        <Reveal as="p" variant="fade" delay={1150} className="finale__closing u-serif-body">
          {finale.closing}
        </Reveal>

        {/* RSVP — intentionally not wired up. There is no form here
            because there is nothing to submit to yet; when there is,
            it replaces the status line and nothing else moves. */}
        <Reveal variant="settle" delay={200} className="finale__rsvp">
          <p className="u-eyebrow finale__rsvp-eyebrow">{rsvp.eyebrow}</p>
          <h3 className="finale__rsvp-title u-display">{rsvp.title}</h3>
          <p className="finale__rsvp-body">{rsvp.body}</p>
          <p className="finale__rsvp-status u-label" role="status">
            {rsvp.status}
          </p>
        </Reveal>

        <div ref={kolamRef} className="finale__threshold">
          <Kolam size={220} drawn={kolamIn} />
        </div>
      </SceneContent>

      <Haze from="bottom" tone="warm" strength={0.5} />
    </Scene>
  );
}
