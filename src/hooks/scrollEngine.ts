/* =============================================================
   SCROLL ENGINE
   One scroll listener, one rAF tick, and — critically — zero
   layout reads per frame.

   Every layer needs to know where it sits in the document. Asking
   the browser each frame (getBoundingClientRect) while other layers
   are writing transforms forces a reflow per element per frame, and
   with forty-odd layers that is exactly what a visitor sees as
   judder. So positions are measured once, cached, and recomputed
   only when the layout can actually have changed.
   ============================================================= */

export type Frame = {
  /** Document scroll position in pixels. */
  y: number;
  /** Viewport height in pixels. */
  vh: number;
  /** 0…1 through the whole document. */
  progress: number;
  /** Increments whenever cached geometry was invalidated. */
  epoch: number;
};

type Subscriber = (frame: Frame) => void;

const subscribers = new Set<Subscriber>();
let ticking = false;
let started = false;
let epoch = 0;
let frame: Frame = { y: 0, vh: 0, progress: 0, epoch: 0 };

function readViewport(): void {
  const vh = window.innerHeight;
  const y = window.scrollY;
  const scrollable = Math.max(1, document.documentElement.scrollHeight - vh);
  frame = { y, vh, progress: Math.min(1, Math.max(0, y / scrollable)), epoch };
}

function tick(): void {
  ticking = false;
  readViewport();
  for (const fn of subscribers) fn(frame);
}

function request(): void {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(tick);
}

/** Anything that can move an element in the document invalidates the cache. */
function remeasure(): void {
  epoch++;
  request();
}

function start(): void {
  if (started) return;
  started = true;
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', remeasure, { passive: true });
  window.addEventListener('orientationchange', remeasure, { passive: true });

  // Web fonts land after first paint and reflow every scene below them.
  if (document.fonts?.ready) document.fonts.ready.then(remeasure).catch(() => {});

  // Reveals change section heights as they arrive.
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(remeasure).observe(document.documentElement);
  }

  readViewport();
}

export function subscribe(fn: Subscriber): () => void {
  start();
  subscribers.add(fn);
  // Deliver the current frame immediately so a layer mounted mid-page is
  // positioned correctly before its first paint, not after it.
  fn(frame);
  return () => {
    subscribers.delete(fn);
  };
}

/**
 * A layer's position in the document, measured lazily and re-measured
 * only when `epoch` moves. Callers get geometry without ever touching
 * layout inside the frame loop.
 */
export type Geometry = { top: number; height: number };

export function createGeometryCache(el: HTMLElement) {
  let cached: Geometry = { top: 0, height: 0 };
  let measuredAt = -1;

  return (currentEpoch: number): Geometry => {
    if (measuredAt !== currentEpoch) {
      const rect = el.getBoundingClientRect();
      cached = { top: rect.top + window.scrollY, height: rect.height };
      measuredAt = currentEpoch;
    }
    return cached;
  };
}

/** Nudges the engine after layout-changing work. */
export function invalidate(): void {
  remeasure();
}

export function currentFrame(): Frame {
  return frame;
}
