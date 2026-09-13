import { Scene, SceneContent, SceneLayer } from '../ui/Scene';
import { Reveal } from '../ui/Reveal';
import { Pillar } from '../scenery/Pillar';
import { FlowerCluster } from '../scenery/FlowerCluster';
import { Thoranam } from '../scenery/Thoranam';
import { KuthuVilakku } from '../scenery/KuthuVilakku';
import { Haze } from '../scenery/Haze';
import { useParallax } from '../../hooks/useParallax';
import { families, familiesIntro } from '../../data/wedding';

/**
 * Symmetry, because that is how the families are seated.
 *
 * Two matched sides under one thoranam. Names are left to the family
 * to supply — nothing here is invented, and the layout holds its
 * composition whether a side lists nobody or four elders.
 */
export function Families() {
  const archRef = useParallax<HTMLDivElement>({ speed: -0.12, maxShift: 110 });

  return (
    <Scene id="families" light="daylight" label="The families" className="families">
      <SceneLayer depth="back">
        <Haze from="centre" tone="ivory" strength={0.7} />
      </SceneLayer>

      <SceneLayer depth="architecture" stage>
        <div ref={archRef} className="families__hall u-layer">
          <Pillar side="left" seed={71} width={110} className="families__pillar" />
          <Pillar side="right" seed={77} width={110} className="families__pillar" />
        </div>
        <Thoranam swags={8} seed={83} />
      </SceneLayer>

      <SceneLayer depth="front" stage>
        <FlowerCluster count={20} seed={89} palette="ivory" size={210} className="families__cluster families__cluster--left" />
        <FlowerCluster count={20} seed={97} palette="blue" size={210} className="families__cluster families__cluster--right" />
      </SceneLayer>

      <SceneContent className="families__content">
        <Reveal as="h2" variant="fade" className="u-eyebrow">
          With the blessings of
        </Reveal>

        <Reveal as="p" variant="rise" delay={160} className="families__intro u-display">
          {familiesIntro}
        </Reveal>

        <div className="families__grid">
          {families.map((family, i) => (
            <Reveal key={family.side} variant="rise" delay={280 + i * 140} className="families__side">
              <span className="families__ornament" aria-hidden="true">
                <KuthuVilakku height={110} phase={i * 1.1} glow={false} />
              </span>
              <p className="families__label u-label">{family.side}</p>
              <p className="families__for u-display">{family.forWhom}</p>

              {family.names.length > 0 ? (
                <ul className="families__names">
                  {family.names.map((name) => (
                    <li key={name} className="families__name u-display">
                      {name}
                    </li>
                  ))}
                </ul>
              ) : (
                /* Placeholder, not filler — replace `names` in
                   src/data/wedding.ts and this disappears. */
                <p className="families__pending u-label">{family.note}</p>
              )}
            </Reveal>
          ))}
        </div>
      </SceneContent>
    </Scene>
  );
}
