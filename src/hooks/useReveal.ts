import { useEffect, useRef, useState } from 'react';
import { subscribe, createGeometryCache } from './scrollEngine';

export type RevealOptions = {
  /**
   * How far into the viewport the element must come before it arrives,
   * as a fraction of the viewport height. 0 fires at the very edge.
   */
  threshold?: number;
  /** Reveal once and stay revealed — the default for an invitation. */
  once?: boolean;
};

/**
 * Viewport activation, driven by the shared scroll engine.
 *
 * This deliberately does not use IntersectionObserver. Scenes are
 * rendered with `content-visibility: auto`, and an observer target
 * inside a skipped subtree never reports intersecting — so headings
 * stayed hidden until something else forced a re-check. Geometry from
 * the engine is correct either way, costs no extra layout read, and
 * means the whole site runs on one scroll system rather than two.
 *
 * Fast scrolling never leaves a section half-animated: the revealed
 * state is a class, not a running animation, so a scene passed at
 * speed simply lands in its final state.
 */
export function useReveal<T extends HTMLElement>({
  threshold,
  once = true,
}: RevealOptions = {}) {
  const band = threshold ?? 0.12;
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const geometry = createGeometryCache(el);
    let done = false;

    return subscribe(({ y, vh, epoch }) => {
      if (done) return;
      const { top, height } = geometry(epoch);
      const margin = vh * band;

      // "Has been reached", not "is on screen". A visitor who flings
      // past a section faster than the engine ticks would otherwise
      // leave it hidden for good; this way anything scrolled past is
      // already in its finished state by the time they turn back.
      const reached = top < y + vh - margin;

      if (once) {
        if (reached) {
          setRevealed(true);
          done = true;
        }
        return;
      }

      const passed = top + height < y + margin;
      setRevealed(reached && !passed);
    });
  }, [band, once]);

  return { ref, revealed };
}
