import { Scene, SceneContent, SceneLayer } from '../ui/Scene';
import { Reveal } from '../ui/Reveal';
import { JasmineGarland } from '../scenery/JasmineGarland';
import { FlowerCluster } from '../scenery/FlowerCluster';
import { Haze } from '../scenery/Haze';
import { useParallax } from '../../hooks/useParallax';
import { galleryItems, galleryNote, type GalleryItem } from '../../data/gallery';

/**
 * The album.
 *
 * Photographs laid out by hand rather than by grid: sizes vary,
 * plates overlap, each one sits a degree or two off square and
 * drifts at its own rate. Flowers sit in front of the edges of the
 * album the way they would on a table.
 */
export function Gallery() {
  const garlandRef = useParallax<HTMLDivElement>({ speed: 0.28, maxShift: 200, disableBelow: 900 });

  return (
    <Scene id="gallery" light="ivory" label="Photographs" className="gallery">
      <SceneLayer depth="back">
        <Haze from="centre" tone="ivory" strength={0.7} />
      </SceneLayer>

      <SceneLayer depth="front" stage>
        <div ref={garlandRef} className="gallery__drape u-layer">
          <JasmineGarland strands={4} length={300} width={130} seed={199} className="gallery__garland gallery__garland--left" />
          <JasmineGarland strands={3} length={250} width={110} seed={211} accent="blue" className="gallery__garland gallery__garland--right" />
        </div>
        <FlowerCluster count={20} seed={223} palette="ivory" size={220} className="gallery__cluster gallery__cluster--a" />
        <FlowerCluster count={16} seed={227} palette="blue" size={190} className="gallery__cluster gallery__cluster--b" />
      </SceneLayer>

      <SceneContent className="gallery__content">
        <Reveal as="h2" variant="fade" className="u-eyebrow">
          The album
        </Reveal>

        <div className="gallery__album">
          {galleryItems.map((item, i) => (
            <Plate key={item.id} item={item} index={i} />
          ))}
        </div>

        {/* One note for the whole album rather than the same placeholder
            printed under every empty plate. */}
        {galleryItems.every((item) => !item.src) && (
          <Reveal variant="fade" delay={200}>
            <p className="gallery__note u-label">{galleryNote}</p>
          </Reveal>
        )}
      </SceneContent>
    </Scene>
  );
}

function Plate({ item, index }: { item: GalleryItem; index: number }) {
  const ref = useParallax<HTMLDivElement>({
    speed: -0.04 - item.depth * 0.08,
    maxShift: 48,
    disableBelow: 600,
  });

  return (
    <Reveal
      variant="settle"
      delay={(index % 3) * 140}
      className={`gallery__plate gallery__plate--${item.span}`}
    >
      <figure
        ref={ref}
        className="gallery__frame u-layer"
        style={{ '--plate-tilt': `${item.tilt}deg` } as React.CSSProperties}
      >
        {item.src ? (
          <img
            className="gallery__image"
            src={item.src}
            alt={item.alt}
            loading="lazy"
            decoding="async"
          />
        ) : (
          /* An empty album plate — deliberately blank, not broken.
             Add `src` in src/data/gallery.ts and the photograph
             takes this exact place. */
          <div className="gallery__empty" role="img" aria-label={item.alt}>
            <span className="gallery__empty-mark" aria-hidden="true" />
          </div>
        )}
        {item.caption && <figcaption className="gallery__caption u-label">{item.caption}</figcaption>}
      </figure>
    </Reveal>
  );
}
