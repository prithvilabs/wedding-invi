import { useEffect, useRef, useState } from 'react';
import { invalidate } from './scrollEngine';

export type RevealOptions = {
  /** Fraction of the element that must be visible to trigger. */
  threshold?: number;
  /** Shrinks the viewport so a reveal fires just before the edge. */
  rootMargin?: string;
  /** Reveal once and stay revealed — the default for an invitation. */
  once?: boolean;
};

/**
 * Viewport activation. Fast scrolling never leaves a section
 * half-animated: the observer fires on intersection regardless of
 * scroll speed, and because the revealed state is a class rather than
 * a running animation, a section scrolled past at speed simply lands
 * in its final state.
 */
export function useReveal<T extends HTMLElement>({
  threshold = 0.18,
  rootMargin = '0px 0px -8% 0px',
  once = true,
}: RevealOptions = {}) {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Without IntersectionObserver, everything is simply present.
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            invalidate();
            if (once) observer.disconnect();
          } else if (!once) {
            setRevealed(false);
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, revealed };
}
