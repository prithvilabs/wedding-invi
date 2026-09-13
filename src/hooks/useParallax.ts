import { useEffect, useRef } from 'react';
import { subscribe, createGeometryCache } from './scrollEngine';
import { useReducedMotion } from './useReducedMotion';

export type ParallaxOptions = {
  /**
   * How far the layer drifts, as a fraction of the distance scrolled
   * while it crosses the viewport. Negative moves against the scroll
   * (reads as "further away"), positive moves with it (foreground).
   */
  speed?: number;
  /** Horizontal drift, same units. Used for garlands crossing the frame. */
  speedX?: number;
  /** Gentle scale change across the crossing, e.g. 0.06 for a slow push-in. */
  zoom?: number;
  /** Clamp the drift so a layer can never leave its own scene. */
  maxShift?: number;
  /** Disable on small screens, where foreground depth turns into clutter. */
  disableBelow?: number;
};

/**
 * Attaches one element to the shared scroll engine.
 *
 * Position comes from the engine's geometry cache rather than from
 * `getBoundingClientRect` each frame: measuring inside the frame loop
 * while sibling layers write transforms forces a reflow per layer per
 * frame, which is what judder actually is. The element's transform is
 * written directly — React never re-renders for a scroll.
 *
 * Only for layers that scroll with the document. A layer inside a
 * `SceneLayer stage` is already pinned to the viewport; drift it from
 * `--scene-progress` in CSS instead, or the two fight each other.
 */
export function useParallax<T extends HTMLElement>({
  speed = -0.15,
  speedX = 0,
  zoom = 0,
  maxShift = 240,
  disableBelow = 0,
}: ParallaxOptions = {}) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (disableBelow && window.innerWidth < disableBelow) return;

    const geometry = createGeometryCache(el);
    let lastY = Number.NaN;
    let lastX = Number.NaN;

    return subscribe(({ y, vh, epoch }) => {
      const { top, height } = geometry(epoch);

      // Centre of the element relative to the centre of the viewport,
      // normalised so −1 is one screen below and 1 is one screen above.
      const centre = top + height / 2 - y - vh / 2;
      const t = centre / vh;

      // Off-screen layers cost nothing: skip the write entirely.
      if (t < -2 || t > 2) return;

      const shiftY = clamp(t * speed * vh, -maxShift, maxShift);
      const shiftX = clamp(t * speedX * vh, -maxShift, maxShift);

      // Sub-pixel writes are invisible but still cost a composite.
      if (Math.abs(shiftY - lastY) < 0.1 && Math.abs(shiftX - lastX) < 0.1) return;
      lastY = shiftY;
      lastX = shiftX;

      el.style.transform =
        `translate3d(${shiftX.toFixed(2)}px, ${shiftY.toFixed(2)}px, 0)` +
        (zoom ? ` scale(${(1 + t * zoom).toFixed(4)})` : '');
    });
  }, [speed, speedX, zoom, maxShift, disableBelow, reduced]);

  return ref;
}

function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}
