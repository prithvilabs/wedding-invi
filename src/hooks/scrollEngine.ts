/* =============================================================
   SCROLL ENGINE
   One scroll listener, one rAF tick, one layout read per frame —
   shared by every parallax layer, the atmosphere grade and the
   navigation. Adding a layer costs a transform write, not a
   listener and not a reflow.
   ============================================================= */

export type Frame = {
  /** Document scroll position in pixels. */
  y: number;
  /** Viewport height in pixels. */
  vh: number;
  /** 0…1 through the whole document. */
  progress: number;
};

type Subscriber = (frame: Frame) => void;

const subscribers = new Set<Subscriber>();
let ticking = false;
let started = false;
let frame: Frame = { y: 0, vh: 0, progress: 0 };

function measure(): void {
  const vh = window.innerHeight;
  const y = window.scrollY;
  const scrollable = Math.max(1, document.documentElement.scrollHeight - vh);
  frame = { y, vh, progress: Math.min(1, Math.max(0, y / scrollable)) };
}

function tick(): void {
  ticking = false;
  measure();
  for (const fn of subscribers) fn(frame);
}

function request(): void {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(tick);
}

function start(): void {
  if (started) return;
  started = true;
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request, { passive: true });
  window.addEventListener('orientationchange', request, { passive: true });
  measure();
}

export function subscribe(fn: Subscriber): () => void {
  start();
  subscribers.add(fn);
  // Deliver the current frame immediately so a layer mounted mid-page
  // is positioned correctly before its first paint, not after it.
  fn(frame);
  return () => {
    subscribers.delete(fn);
  };
}

/** Nudges the engine after layout-changing work (fonts, images, reveals). */
export function invalidate(): void {
  request();
}

export function currentFrame(): Frame {
  return frame;
}
