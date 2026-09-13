import { Scene, SceneContent, SceneLayer } from '../ui/Scene';
import { Reveal } from '../ui/Reveal';
import { Lamplight } from '../scenery/Lamplight';
import { FlowerCluster } from '../scenery/FlowerCluster';
import { noblePresence } from '../../data/wedding';

/**
 * One line, alone on the page.
 *
 * After four dark event cards the site needs to come back up into
 * the light, and the cheapest way to make a sentence feel ceremonial
 * is to give it a whole screen and no competition. The only other
 * thing here is lamplight rising behind it.
 */
export function Presence() {
  return (
    <Scene id="presence" light="brass" label="Awaiting your noble presence">
      <SceneLayer depth="back">
        <Lamplight from="bottom" strength={0.6} spread={1.35} phase={1.8} />
      </SceneLayer>
      <SceneLayer depth="front">
        <FlowerCluster count={12} seed={91} palette="warm" size={220} className="presence__flowers presence__flowers--left" />
        <FlowerCluster count={12} seed={97} palette="ivory" size={200} className="presence__flowers presence__flowers--right" />
      </SceneLayer>

      <SceneContent className="presence">
        <Reveal variant="focus">
          <h2 className="presence__title u-script">{noblePresence.title}</h2>
        </Reveal>
        <Reveal variant="rise" delay={240}>
          <p className="presence__line u-serif-body">{noblePresence.line}</p>
        </Reveal>
      </SceneContent>
    </Scene>
  );
}
