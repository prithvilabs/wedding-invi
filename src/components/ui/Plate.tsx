import { useState } from 'react';

type Props = {
  src: string | null;
  alt: string;
  /** Reserved before the file arrives. Nothing on this page may reflow. */
  ratio?: string;
  /** A hand-laid album is never square to the page. −4…4 degrees. */
  tilt?: number;
  eager?: boolean;
  caption?: string;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * One photograph, mounted.
 *
 * The frame is sized by `aspect-ratio` before the image exists, so
 * the plate occupies its final space from first paint — an album
 * that settles as its pictures load would shift every section under
 * it, and cumulative layout shift is the one flaw a visitor feels
 * without being able to name.
 *
 * With `src: null` it renders as an empty album plate: a deliberate
 * placeholder with the caption still in place, not a broken image.
 * The image fades and settles out of a slight scale as it decodes,
 * so a slow connection reads as a photograph arriving.
 */
export function Plate({
  src,
  alt,
  ratio = '4 / 5',
  tilt = 0,
  eager = false,
  caption,
  className = '',
  style,
}: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <figure
      className={`plate ${src ? '' : 'is-empty'} ${loaded ? 'is-loaded' : ''} ${className}`}
      style={{ '--plate-ratio': ratio, '--plate-tilt': `${tilt}deg`, ...style } as React.CSSProperties}
    >
      <div className="plate__frame">
        {src ? (
          <img
            className="plate__image"
            src={src}
            alt={alt}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setLoaded(true)}
            /* A cached image can be complete before React attaches
               onLoad, which would strand it at opacity 0 forever. */
            ref={(el) => {
              if (el?.complete) setLoaded(true);
            }}
          />
        ) : (
          <span className="plate__empty u-label" aria-label={alt} role="img">
            Photograph to follow
          </span>
        )}
        <span className="plate__sheen" aria-hidden="true" />
      </div>
      {caption && <figcaption className="plate__caption u-script">{caption}</figcaption>}
    </figure>
  );
}
