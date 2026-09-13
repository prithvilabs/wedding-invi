import { Scene, SceneContent, SceneLayer } from '../ui/Scene';
import { Reveal } from '../ui/Reveal';
import { Lamplight } from '../scenery/Lamplight';
import { Silk } from '../scenery/Silk';
import { Petals } from '../scenery/Petals';
import { FlowerCluster } from '../scenery/FlowerCluster';
import { Kolam } from '../scenery/Kolam';
import { whatsappUrl, shareText } from '../../lib/links';
import { couple, finale, gifts, wedding } from '../../data/wedding';

/**
 * The last page: the invitation itself, printed.
 *
 * Everything the site has been building towards is set here as it
 * would be on the card — the names large, the date under them, the
 * blessing under that — on ivory, in lamplight, with the kolam laid
 * at the foot of the page the way it is laid at a threshold.
 */
export function Finale() {
  return (
    <Scene id="finale" light="lamplit" full label="With joy">
      <SceneLayer depth="back">
        <Silk tone="ivory" strength={0.3} angle={12} />
        <Lamplight from="bottom-left" strength={0.66} spread={1.2} phase={0} />
        <Lamplight from="bottom-right" strength={0.5} spread={1} phase={4.8} />
      </SceneLayer>
      <SceneLayer depth="front">
        <FlowerCluster count={16} seed={120} palette="ivory" size={260} className="finale__flowers finale__flowers--left" />
        <FlowerCluster count={14} seed={131} palette="warm" size={230} className="finale__flowers finale__flowers--right" />
        <Petals count={8} seed={140} tone="jasmine" />
      </SceneLayer>

      <SceneContent className="finale">
        <Reveal variant="fade">
          <p className="finale__eyebrow u-eyebrow">{finale.eyebrow}</p>
        </Reveal>

        <Reveal variant="focus" delay={140}>
          <p className="finale__names u-display">
            {couple.one} <span aria-hidden="true">&amp;</span>
            <span className="u-visually-hidden">and</span> {couple.two}
          </p>
        </Reveal>

        <Reveal variant="rise" delay={300}>
          <p className="finale__date u-script">
            <time dateTime={wedding.dateISO}>{wedding.dateDisplay}</time>
          </p>
        </Reveal>

        <Reveal variant="rise" delay={420}>
          <p className="finale__closing u-serif-body">{finale.closing}</p>
        </Reveal>

        {gifts.show && (
          <Reveal variant="fade" delay={520}>
            <p className="finale__gifts">{gifts.note}</p>
          </Reveal>
        )}

        <Reveal variant="fade" delay={600}>
          <a
            className="button"
            href={whatsappUrl(shareText())}
            target="_blank"
            rel="noreferrer noopener"
          >
            <span>Share the invitation</span>
          </a>
        </Reveal>

        <Kolam size={260} drawn delay={700} className="finale__kolam" />
      </SceneContent>
    </Scene>
  );
}
