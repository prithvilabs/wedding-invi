import { useEffect, useState } from 'react';
import { Scene, SceneContent, SceneLayer } from '../ui/Scene';
import { ScrollIndicator } from '../layout/ScrollIndicator';
import { Pillar } from '../scenery/Pillar';
import { Gopuram } from '../scenery/Gopuram';
import { JasmineGarland } from '../scenery/JasmineGarland';
import { FloralArch } from '../scenery/FloralArch';
import { KuthuVilakku } from '../scenery/KuthuVilakku';
import { FlowerCluster } from '../scenery/FlowerCluster';
import { Thoranam } from '../scenery/Thoranam';
import { Haze } from '../scenery/Haze';
import { Bokeh } from '../scenery/Bokeh';
import { Petals } from '../scenery/Petals';
import { useParallax } from '../../hooks/useParallax';
import { couple, events } from '../../data/wedding';

/**
 * The entrance.
 *
 * The camera stands at the mouth of the mandapam: towers behind,
 * pillars either side, a floral arch overhead, lamps at the feet of
 * the frame. The venue arrives before the names do — architecture,
 * then flowers, then light, then the couple — because that is the
 * order in which you would actually notice a room.
 */
export function Hero() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Ten beats, slow. Each beat unlocks the next tier of the
    // composition; CSS holds the timing so nothing re-renders.
    const timers = [120, 700, 1250, 1850, 2450, 3050, 3700, 4350, 5000, 5650].map((ms, i) =>
      window.setTimeout(() => setStage(i + 1), ms),
    );
    return () => timers.forEach(window.clearTimeout);
  }, []);

  const farRef = useParallax<HTMLDivElement>({ speed: -0.08, maxShift: 90 });
  const midRef = useParallax<HTMLDivElement>({ speed: -0.16, zoom: 0.04, maxShift: 140 });
  const nearRef = useParallax<HTMLDivElement>({ speed: 0.18, maxShift: 200, disableBelow: 600 });
  const foreRef = useParallax<HTMLDivElement>({ speed: 0.34, maxShift: 260, disableBelow: 900 });

  return (
    <Scene id="hero" light="entrance" full label="Prithvi Raj and Harshini" className={`hero stage-${stage}`}>
      {/* Distance: the temple skyline, held behind the haze */}
      <SceneLayer depth="back">
        <div ref={farRef} className="hero__skyline u-layer">
          <Gopuram depth={2} tiers={7} className="hero__gopuram hero__gopuram--left" />
          <Gopuram depth={2} tiers={6} className="hero__gopuram hero__gopuram--right" />
        </div>
        <Bokeh count={7} seed={4} />
        <Haze from="top" tone="blue" strength={0.9} />
      </SceneLayer>

      {/* The hall: pillars and the arch the camera will pass through */}
      <SceneLayer depth="architecture">
        <div ref={midRef} className="hero__hall u-layer">
          <Pillar side="left" dressed seed={12} width={140} className="hero__pillar" />
          <Pillar side="right" dressed seed={19} width={140} className="hero__pillar" />
          <FloralArch palette="jasmine" density={70} seed={23} built={stage >= 3} className="hero__arch" />
        </div>
        <Thoranam swags={6} seed={31} />
      </SceneLayer>

      {/* Lamplight, and the flowers it reaches */}
      <SceneLayer depth="mid" className="hero__lamps">
        <KuthuVilakku height={320} phase={0} className="hero__lamp hero__lamp--left" />
        <KuthuVilakku height={320} phase={1.7} className="hero__lamp hero__lamp--right" />
      </SceneLayer>

      {/* Foreground: jasmine hanging into frame, flowers at the corners */}
      <SceneLayer depth="front">
        <div ref={nearRef} className="hero__foliage u-layer">
          <JasmineGarland strands={6} length={480} width={190} seed={2} accent="blue" className="hero__garland hero__garland--left" />
          <JasmineGarland strands={6} length={430} width={190} seed={8} accent="both" className="hero__garland hero__garland--right" />
          <FlowerCluster count={30} seed={14} palette="ivory" size={300} className="hero__cluster hero__cluster--left" />
          <FlowerCluster count={26} seed={27} palette="blue" size={270} className="hero__cluster hero__cluster--right" />
        </div>
        <div ref={foreRef} className="hero__near u-layer">
          <FlowerCluster count={18} seed={44} palette="mixed" size={340} className="hero__cluster hero__cluster--near" />
        </div>
        <Petals count={10} seed={6} />
      </SceneLayer>

      <Haze from="bottom" tone="warm" strength={0.55} />

      <SceneContent className="hero__content">
        <p className="hero__eyebrow u-eyebrow">{couple.togetherWith}</p>

        <h1 className="hero__names">
          <span className="hero__name u-display">{couple.one}</span>
          <span className="hero__amp u-display" aria-hidden="true">
            {couple.ampersand}
          </span>
          <span className="u-visually-hidden">and</span>
          <span className="hero__name u-display">{couple.two}</span>
        </h1>

        <p className="hero__date u-label">
          <time dateTime={events.wedding.dateISO}>{events.wedding.dateDisplay}</time>
        </p>

        <ScrollIndicator />
      </SceneContent>
    </Scene>
  );
}
