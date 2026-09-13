import { Scene, SceneContent, SceneLayer } from '../ui/Scene';
import { Reveal } from '../ui/Reveal';
import { Gopuram } from '../scenery/Gopuram';
import { FlowerCluster } from '../scenery/FlowerCluster';
import { Haze } from '../scenery/Haze';
import { useReveal } from '../../hooks/useReveal';
import { travel, travelNote } from '../../data/wedding';

/**
 * Getting there.
 *
 * Night, architecture in silhouette, and a single road drawn across
 * the scene as it arrives. No cards: each item is a line on that
 * road, so the section reads as part of the venue rather than as a
 * panel of logistics dropped into it.
 */
export function Travel() {
  const { ref: roadRef, revealed: roadDrawn } = useReveal<HTMLDivElement>({ threshold: 0.25 });

  return (
    <Scene id="travel" light="night" label="Travel" className="travel">
      <SceneLayer depth="back">
        <Haze from="top" tone="blue" strength={1} />
      </SceneLayer>

      <SceneLayer depth="architecture" stage>
        <div className="travel__skyline u-layer" data-depth="back">
          <Gopuram depth={2} tiers={6} className="travel__tower travel__tower--a" />
          <Gopuram depth={1} tiers={7} className="travel__tower travel__tower--b" />
          <Gopuram depth={2} tiers={5} className="travel__tower travel__tower--c" />
        </div>
      </SceneLayer>

      <SceneLayer depth="front" stage>
        <FlowerCluster count={18} seed={193} palette="blue" size={200} className="travel__cluster travel__cluster--left" />
        <FlowerCluster count={16} seed={197} palette="ivory" size={180} className="travel__cluster travel__cluster--right" />
      </SceneLayer>

      <SceneContent className="travel__content">
        <Reveal as="h2" variant="fade" className="u-eyebrow">
          Coming to Hosur
        </Reveal>

        <Reveal as="p" variant="rise" delay={140} className="travel__note u-display">
          {travelNote}
        </Reveal>

        <div ref={roadRef} className={`travel__road ${roadDrawn ? 'is-drawn' : ''}`}>
          <svg viewBox="0 0 4 400" preserveAspectRatio="none" aria-hidden="true">
            <path className="travel__road-line" d="M2 0 L2 400" stroke="currentColor" strokeWidth="1.4" />
          </svg>

          <dl className="travel__list">
            {travel.map((item, i) => (
              <Reveal key={item.key} variant="settle" delay={i * 160} className="travel__item">
                <span className="travel__marker" aria-hidden="true" />
                <dt className="travel__label u-label">{item.label}</dt>
                {/* Placeholder until confirmed — edit `travel` in
                    src/data/wedding.ts, no layout change needed. */}
                <dd className="travel__value u-display">{item.value}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </SceneContent>

      <Haze from="bottom" tone="blue" strength={0.7} />
    </Scene>
  );
}
