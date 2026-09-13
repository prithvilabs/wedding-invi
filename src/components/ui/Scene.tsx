import { useEffect, type ReactNode } from 'react';
import { useSceneProgress } from '../../hooks/useSceneProgress';
import { invalidate } from '../../hooks/scrollEngine';

type Props = {
  id: string;
  /** Named lighting state — see `--scene-*` tokens in scenes.css. */
  light: 'entrance' | 'daylight' | 'ivory' | 'ceremony' | 'evening' | 'night' | 'finale';
  label?: string;
  full?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * One room of the venue. Every scene publishes its own scroll
 * progress as a CSS variable, which is what lets lighting shift
 * gradually across a scene rather than snapping at its boundary.
 */
export function Scene({ id, light, label, full = false, className = '', children }: Props) {
  const ref = useSceneProgress<HTMLElement>();

  // A scene skipped by content-visibility has no laid-out children, so
  // any geometry cached while it was skipped is stale. Re-measure the
  // moment it starts rendering again.
  useEffect(() => {
    const el = ref.current;
    if (!el || !('oncontentvisibilityautostatechange' in el)) return;
    const onChange = () => invalidate();
    el.addEventListener('contentvisibilityautostatechange', onChange);
    return () => el.removeEventListener('contentvisibilityautostatechange', onChange);
  }, [ref]);

  return (
    <section
      id={id}
      ref={ref}
      className={`scene scene--${light} ${full ? 'scene--full' : ''} ${className}`}
      aria-label={label}
    >
      {children}
    </section>
  );
}

/** The readable plane of a scene. Decoration never lives in here. */
export function SceneContent({
  className = '',
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={`scene__content ${className}`}>{children}</div>;
}

/** A depth plane. Decoration always lives in one of these. */
export function SceneLayer({
  depth,
  stage = false,
  className = '',
  children,
  style,
}: {
  depth: 'back' | 'architecture' | 'mid' | 'front';
  /**
   * Pins this layer to one viewport-high frame while the camera moves
   * through a scene taller than the screen. Without it, a tall scene
   * hangs its ceiling above the visitor and its floor below them.
   */
  stage?: boolean;
  className?: string;
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  const body = stage ? <div className="scene__stage">{children}</div> : children;
  return (
    <div className={`scene__layer scene__layer--${depth} u-decor ${className}`} style={style} aria-hidden="true">
      {body}
    </div>
  );
}
