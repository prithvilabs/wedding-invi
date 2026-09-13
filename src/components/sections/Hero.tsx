import { useEffect, useState } from 'react';
import { Scene, SceneContent, SceneLayer } from '../ui/Scene';
import { ScrollIndicator } from '../layout/ScrollIndicator';
import { Lamplight } from '../scenery/Lamplight';
import { Silk } from '../scenery/Silk';
import { FlowerCluster } from '../scenery/FlowerCluster';
import { Haze } from '../scenery/Haze';
import { Bokeh } from '../scenery/Bokeh';
import { Petals } from '../scenery/Petals';
import { useParallax } from '../../hooks/useParallax';
import { couple, wedding } from '../../data/wedding';

/**
 * The hero, composed as a wedding poster rather than as a page.
 *
 * Depth is built optically, not out of props: a silk ground that
 * barely moves, haze to separate it from the middle distance,
 * out-of-focus lamplight in the plane behind the type, jasmine
 * gathered into the two lower corners in front of it, and the names
 * held dead still on the one plane that never drifts.
 *
 * Nothing here is a picture of a mandapam. It is the light and the
 * cloth of one, which is what a photograph of the real thing would
 * have given us anyway.
 */
export function Hero({ begin }: { begin: boolean }) {
  const [stage, setStage] = useState(0);

  /* Seven beats, and the order is the order you would actually take
     a room in: the light, then the cloth, then the flowers, then
     the people. CSS holds every duration, so none of this renders
     more than seven times in total. */
  useEffect(() => {
    if (!begin) return;
    const marks = [0, 260, 560, 880, 1220, 1560, 1900];
    const timers = marks.map((ms, i) => window.setTimeout(() => setStage(i + 1), ms));
    return () => timers.forEach(window.clearTimeout);
  }, [begin]);

  /* Five planes, five speeds. Every value is small — the largest is
     under a fifth of the scroll distance — because parallax that can
     be noticed as parallax has already gone too far. */
  const groundRef = useParallax<HTMLDivElement>({ speed: -0.05, maxShift: 70 });
  const clothRef = useParallax<HTMLDivElement>({ speed: -0.1, zoom: 0.03, maxShift: 110 });
  const lightRef = useParallax<HTMLDivElement>({ speed: -0.14, maxShift: 130, disableBelow: 600 });
  const flowersRef = useParallax<HTMLDivElement>({ speed: 0.15, maxShift: 180, disableBelow: 600 });
  const nearRef = useParallax<HTMLDivElement>({ speed: 0.2, maxShift: 200, disableBelow: 900 });

  return (
    <Scene
      id="hero"
      light="dawn"
      full
      label={`${couple.one} and ${couple.two}`}
      className={`hero stage-${stage}`}
    >
      {/* Furthest: the wall the morning is falling on. */}
      <SceneLayer depth="back">
        <div ref={groundRef} className="hero__ground u-layer" />
        <Bokeh count={6} seed={4} />
        <Haze from="top" tone="ivory" strength={0.85} />
      </SceneLayer>

      {/* The cloth the whole composition is cut from. */}
      <SceneLayer depth="architecture">
        <div ref={clothRef} className="hero__cloth u-layer">
          <Silk tone="kumkum" strength={0.28} angle={14} />
        </div>
      </SceneLayer>

      {/* Lamplight, low and to both sides, out of step with itself. */}
      <SceneLayer depth="mid">
        <div ref={lightRef} className="hero__light u-layer">
          <Lamplight from="bottom-left" strength={0.6} spread={1.05} phase={0} />
          <Lamplight from="bottom-right" strength={0.34} spread={0.8} phase={4.1} />
        </div>
      </SceneLayer>

      {/* Jasmine and marigold, gathered at the corners the way flowers
          are actually banked at the foot of a stage. */}
      <SceneLayer depth="front">
        <div ref={flowersRef} className="hero__flowers u-layer">
          <FlowerCluster count={26} seed={14} palette="ivory" size={300} className="hero__cluster hero__cluster--left" />
          <FlowerCluster count={22} seed={27} palette="warm" size={270} className="hero__cluster hero__cluster--right" />
        </div>
        <div ref={nearRef} className="hero__near u-layer">
          <FlowerCluster count={14} seed={44} palette="mixed" size={340} className="hero__cluster hero__cluster--near" />
        </div>
        <Petals count={9} seed={6} tone="jasmine" />
      </SceneLayer>

      <Haze from="bottom" tone="warm" strength={0.5} />

      <SceneContent className="hero__content">
        <p className="hero__eyebrow u-eyebrow">{couple.headline}</p>

        <h1 className="hero__names">
          <span className="hero__name u-display">{couple.one}</span>
          <span className="hero__amp" aria-hidden="true">
            <span className="hero__amp-mark">{couple.ampersand}</span>
          </span>
          <span className="u-visually-hidden">and</span>
          <span className="hero__name u-display">{couple.two}</span>
        </h1>

        <p className="hero__date u-label">
          <time dateTime={wedding.dateISO}>{wedding.dateLong}</time>
        </p>

        <ScrollIndicator />
      </SceneContent>
    </Scene>
  );
}
