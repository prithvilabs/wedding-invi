import { Scene, SceneContent, SceneLayer } from '../ui/Scene';
import { ScriptTitle } from '../ui/ScriptTitle';
import { Reveal } from '../ui/Reveal';
import { Plate } from '../ui/Plate';
import { Lamplight } from '../scenery/Lamplight';
import { useParallax } from '../../hooks/useParallax';
import { galleryItems, galleryNote } from '../../data/gallery';

/**
 * The album.
 *
 * Laid out as an editorial spread, not a grid: plates of three
 * different sizes on a twelve-column field, each with its own
 * column span, its own row offset and its own slight rotation, so
 * no two sit on the same baseline. A photograph that is bigger than
 * its neighbours is bigger because it is a better photograph.
 *
 * Each plate also drifts at a speed set by its own `depth`, so the
 * spread has parallax between its own pictures rather than moving
 * as one sheet.
 */
export function Moments() {
  const empty = galleryItems.every((item) => item.src === null);

  return (
    <Scene id="gallery" light="sage" label="Moments of love">
      <SceneLayer depth="back">
        <Lamplight from="above" strength={0.2} spread={1.4} phase={3.3} flicker={false} />
      </SceneLayer>

      <SceneContent className="moments">
        <ScriptTitle eyebrow="Captured moments">Moments of love</ScriptTitle>

        <div className="moments__spread">
          {galleryItems.map((item, i) => (
            <Moment key={item.id} item={item} index={i} />
          ))}
        </div>

        {empty && (
          <Reveal variant="fade">
            <p className="moments__note u-label">{galleryNote}</p>
          </Reveal>
        )}
      </SceneContent>
    </Scene>
  );
}

function Moment({ item, index }: { item: (typeof galleryItems)[number]; index: number }) {
  const ref = useParallax<HTMLDivElement>({
    // depth 0 → almost pinned, depth 1 → the loosest plate on the spread.
    speed: -0.04 - item.depth * 0.1,
    maxShift: 70,
    disableBelow: 768,
  });

  const ratio = item.span === 'wide' ? '3 / 2' : item.span === 'tall' ? '4 / 5' : '1 / 1';

  return (
    <Reveal
      variant="curtain"
      delay={(index % 3) * 90}
      className={`moments__cell moments__cell--${item.span}`}
    >
      <div ref={ref} className="u-layer">
        <Plate src={item.src} alt={item.alt} caption={item.caption} ratio={ratio} tilt={item.tilt} />
      </div>
    </Reveal>
  );
}
