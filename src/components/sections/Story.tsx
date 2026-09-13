import { Scene, SceneContent, SceneLayer } from '../ui/Scene';
import { Reveal } from '../ui/Reveal';
import { JasmineGarland } from '../scenery/JasmineGarland';
import { FlowerCluster } from '../scenery/FlowerCluster';
import { KuthuVilakku } from '../scenery/KuthuVilakku';
import { Kolam } from '../scenery/Kolam';
import { Haze } from '../scenery/Haze';
import { useParallax } from '../../hooks/useParallax';
import { useReveal } from '../../hooks/useReveal';
import { story } from '../../data/wedding';

/**
 * The quiet room.
 *
 * After the entrance the camera steps into somewhere much stiller.
 * Almost nothing here moves; the type carries the scene, and the
 * flowers stay at the edges of the frame where they belong.
 */
export function Story() {
  const drapeRef = useParallax<HTMLDivElement>({ speed: -0.2, maxShift: 160, disableBelow: 600 });
  const cornerRef = useParallax<HTMLDivElement>({ speed: 0.14, maxShift: 120, disableBelow: 900 });
  const { ref: kolamRef, revealed: kolamIn } = useReveal<HTMLDivElement>({ threshold: 0.3 });

  return (
    <Scene id="story" light="ivory" label="Their story" className="story">
      <SceneLayer depth="back">
        <Haze from="centre" tone="ivory" strength={0.8} />
      </SceneLayer>

      <SceneLayer depth="mid" stage>
        <div ref={drapeRef} className="story__drape u-layer">
          <JasmineGarland strands={4} length={340} width={130} seed={51} className="story__garland story__garland--left" />
          <JasmineGarland strands={3} length={280} width={110} seed={57} accent="blue" className="story__garland story__garland--right" />
        </div>
        <KuthuVilakku height={210} phase={0.9} className="story__lamp" />
      </SceneLayer>

      <SceneLayer depth="front" stage>
        <div ref={cornerRef} className="story__corner u-layer">
          <FlowerCluster count={20} seed={63} palette="ivory" size={240} className="story__cluster" />
        </div>
      </SceneLayer>

      <SceneContent className="story__content">
        <Reveal as="h2" variant="fade" className="u-eyebrow story__eyebrow">
          Their story
        </Reveal>

        <div className="story__beats">
          {story.map((beat, i) => (
            <article key={beat.eyebrow} className="story__beat">
              <Reveal variant="fade" delay={0} className="story__beat-eyebrow">
                <span className="u-label">{beat.eyebrow}</span>
              </Reveal>
              <Reveal as="p" variant="focus" delay={140} className="story__line u-display">
                {beat.line}
              </Reveal>
              {i < story.length - 1 && <span className="story__rule" aria-hidden="true" />}
            </article>
          ))}
        </div>

        <div ref={kolamRef} className="story__threshold">
          <Kolam size={200} drawn={kolamIn} />
        </div>
      </SceneContent>
    </Scene>
  );
}
