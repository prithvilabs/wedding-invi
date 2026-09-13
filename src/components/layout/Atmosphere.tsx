import { useEffect } from 'react';
import { subscribe } from '../../hooks/scrollEngine';

/**
 * The colour grade of the whole film.
 *
 * One fixed backdrop whose three stops are interpolated from the
 * visitor's position in the document. Because the stops blend
 * continuously rather than switching at a boundary, the light
 * changes the way light actually changes — a room at a time.
 *
 * This is where the site's cultural colour actually lives. Not in
 * ornament: in the fact that the air is sandalwood at the entrance,
 * turmeric at the ceremony and lamp-warm at the end.
 */
type Stop = { at: number; top: string; mid: string; base: string };

const GRADE: Stop[] = [
  /* Hero — first light on a Chennai morning, sandalwood and ivory */
  { at: 0.0, top: '#e0c79c', mid: '#f2e5cf', base: '#faf3e8' },
  /* Countdown — full ivory paper */
  { at: 0.1, top: '#f0e2ca', mid: '#f8f0e2', base: '#faf3e8' },
  /* The couple — paper, a touch warmer */
  { at: 0.19, top: '#f4e7d4', mid: '#faf3e8', base: '#fdf8f0' },
  /* The story — blush, the softest room in the house */
  { at: 0.3, top: '#f7e6e9', mid: '#fbeef0', base: '#fdf6f4' },
  /* Moments — the sage ground the photographs sit on */
  { at: 0.42, top: '#cfdbbc', mid: '#dde3cd', base: '#e9edde' },
  /* Events — evening in the mandapam, lamps carrying the room */
  { at: 0.56, top: '#2a140e', mid: '#5b2a1c', base: '#8d4a26' },
  /* Presence — back into the light */
  { at: 0.66, top: '#c9a06a', mid: '#eeddc2', base: '#faf3e8' },
  /* Families — sage again, the two houses side by side */
  { at: 0.74, top: '#d4ddc2', mid: '#e4e9d6', base: '#f0f2e6' },
  /* Wishes — blush */
  { at: 0.82, top: '#f6e3e7', mid: '#fbeef0', base: '#fdf7f5' },
  /* RSVP — the last page of the printed card */
  { at: 0.92, top: '#f2e4cc', mid: '#f9f1e3', base: '#fdf9f2' },
  /* Finale — lamplight, brass and ivory together */
  { at: 1.0, top: '#d3ab6d', mid: '#f0e0c3', base: '#faf3e8' },
];

export function Atmosphere() {
  useEffect(() => {
    const root = document.documentElement;
    let last = -1;

    return subscribe(({ progress }) => {
      // Below a thousandth of the document the change is invisible but
      // still costs four style writes and a recalc.
      if (Math.abs(progress - last) < 0.0015) return;
      last = progress;

      const { a, b, t } = bracket(progress);
      root.style.setProperty('--atm-top', mix(a.top, b.top, t));
      root.style.setProperty('--atm-mid', mix(a.mid, b.mid, t));
      root.style.setProperty('--atm-base', mix(a.base, b.base, t));
      root.style.setProperty('--atm-warmth', warmthAt(progress).toFixed(3));
      root.style.setProperty('--atm-depth', progress.toFixed(3));
    });
  }, []);

  return <div className="atmosphere u-decor" aria-hidden="true" />;
}

function bracket(p: number): { a: Stop; b: Stop; t: number } {
  for (let i = 0; i < GRADE.length - 1; i++) {
    const a = GRADE[i];
    const b = GRADE[i + 1];
    if (p <= b.at) {
      const span = b.at - a.at || 1;
      return { a, b, t: ease((p - a.at) / span) };
    }
  }
  const last = GRADE[GRADE.length - 1];
  return { a: last, b: last, t: 0 };
}

/** Smoothstep — no abrupt arrival at a stop. */
function ease(t: number): number {
  const c = t < 0 ? 0 : t > 1 ? 1 : t;
  return c * c * (3 - 2 * c);
}

/** Two lamplit peaks: the mandapam, and the final invitation. */
function warmthAt(p: number): number {
  const ceremony = Math.exp(-((p - 0.57) ** 2) / 0.011);
  const finale = Math.exp(-((p - 0.99) ** 2) / 0.009);
  return Math.min(1, 0.24 + ceremony * 0.7 + finale * 0.6);
}

function mix(a: string, b: string, t: number): string {
  const ca = hex(a);
  const cb = hex(b);
  return `rgb(${round(ca[0], cb[0], t)} ${round(ca[1], cb[1], t)} ${round(ca[2], cb[2], t)})`;
}

function round(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

function hex(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
