import { Scene, SceneContent, SceneLayer } from '../ui/Scene';
import { Reveal } from '../ui/Reveal';
import { FlowerCluster } from '../scenery/FlowerCluster';
import { Haze } from '../scenery/Haze';
import { ceremonies, ceremoniesNote } from '../../data/wedding';

/**
 * A quick reference, laid out like a page of an invitation card
 * itself: two confirmed dates, in order, with nothing between them
 * invented. This is deliberately not a breakdown of named rituals —
 * see the note above `ceremonies` in src/data/wedding.ts for why —
 * so it stays honest even though it stays short.
 */
export function Ceremonies() {
  return (
    <Scene id="ceremonies" light="daylight" label="At a glance" className="ceremonies">
      <SceneLayer depth="back">
        <Haze from="centre" tone="ivory" strength={0.6} />
      </SceneLayer>

      <SceneLayer depth="front">
        <FlowerCluster count={12} seed={311} palette="mixed" size={200} className="ceremonies__cluster ceremonies__cluster--left" />
        <FlowerCluster count={12} seed={317} palette="ivory" size={200} className="ceremonies__cluster ceremonies__cluster--right" />
      </SceneLayer>

      <SceneContent className="ceremonies__content">
        <Reveal as="h2" variant="fade" className="u-eyebrow">
          At a glance
        </Reveal>

        <ol className="ceremonies__list">
          {ceremonies.map((c, i) => (
            <Reveal key={c.id} as="li" variant="rise" delay={i * 160} className="ceremonies__item">
              <span className="ceremonies__number u-display" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="ceremonies__body">
                <p className="ceremonies__label u-label">{c.label}</p>
                <p className="ceremonies__date u-display">
                  <time dateTime={c.dateISO}>{c.dateDisplay}</time>
                </p>
                <p className="ceremonies__place">{c.place}</p>
                <p className="ceremonies__detail u-label">{c.detail}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal as="p" variant="fade" delay={480} className="ceremonies__note u-label">
          {ceremoniesNote}
        </Reveal>
      </SceneContent>
    </Scene>
  );
}
