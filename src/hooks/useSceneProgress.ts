import { useEffect, useRef } from 'react';
import { subscribe, createGeometryCache } from './scrollEngine';

/**
 * Writes a scene's own scroll progress onto the element as
 * `--scene-progress` (0 as it enters the viewport, 1 as it leaves).
 *
 * CSS then drives lighting, haze, drift and reveal depth from it — no
 * React renders, no layout reads in the frame loop, and the value is
 * correct even if the visitor jumps straight to the middle of a scene.
 * Custom properties inherit, so every layer inside the scene can read it.
 */
export function useSceneProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const geometry = createGeometryCache(el);
    let last = Number.NaN;

    return subscribe(({ y, vh, epoch }) => {
      const { top, height } = geometry(epoch);
      const span = height + vh;
      const p = clamp01((y + vh - top) / span);
      if (Math.abs(p - last) < 0.002) return;
      last = p;
      el.style.setProperty('--scene-progress', p.toFixed(3));
    });
  }, []);

  return ref;
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
