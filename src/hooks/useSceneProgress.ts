import { useEffect, useRef } from 'react';
import { subscribe } from './scrollEngine';

/**
 * Writes a scene's own scroll progress onto the element as
 * `--scene-progress` (0 as it enters the viewport, 1 as it leaves).
 * CSS then drives lighting, haze and reveal depth from it — no React
 * renders, and the value is correct even if the visitor jumps.
 */
export function useSceneProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let last = Number.NaN;

    return subscribe(({ vh }) => {
      const rect = el.getBoundingClientRect();
      const span = rect.height + vh;
      const p = clamp01((vh - rect.top) / span);
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
