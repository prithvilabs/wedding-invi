import { useEffect } from 'react';
import { subscribe } from '../../hooks/scrollEngine';

/**
 * The colour grade of the whole film.
 *
 * A single fixed backdrop whose three colours are interpolated from
 * the visitor's position in the document. Because the stops blend
 * continuously, the light changes the way light actually changes —
 * a room at a time, never at a boundary.
 */
type Stop = { at: number; top: string; mid: string; base: string };

const GRADE: Stop[] = [
  /* Hero — entrance at dusk: cool dusty blue above, warm lamplight below */
  { at: 0.0, top: '#3f6091', mid: '#a8bed4', base: '#f1e9dc' },
  /* Story — the quiet room: soft ivory lifted by a trace of blue */
  { at: 0.16, top: '#cfdcea', mid: '#e7edf4', base: '#f8f4ec' },
  /* Families — full ivory daylight */
  { at: 0.28, top: '#e7edf4', mid: '#f1e9dc', base: '#f8f4ec' },
  /* Journey — the long evening between two time zones */
  { at: 0.42, top: '#1d3557', mid: '#4d6a8d', base: '#8fa9c6' },
  /* Wedding — the mandapam: strong warm gold inside blue air */
  { at: 0.56, top: '#7995b4', mid: '#cfdcea', base: '#f1e9dc' },
  /* Reception — deeper blue evening, lamps carrying the room */
  { at: 0.70, top: '#0e1f38', mid: '#1d3557', base: '#4d6a8d' },
  /* Travel — night, architecture in silhouette */
  { at: 0.80, top: '#0e1f38', mid: '#1d3557', base: '#3d5578' },
  /* Gallery — the album, laid out on ivory */
  { at: 0.88, top: '#a8bed4', mid: '#e7edf4', base: '#f8f4ec' },
  /* Finale — warm ivory, blue and gold together */
  { at: 1.0, top: '#7995b4', mid: '#e3d7c5', base: '#f8f4ec' },
];

export function Atmosphere() {
  useEffect(() => {
    const root = document.documentElement;
    let last = -1;

    return subscribe(({ progress }) => {
      if (Math.abs(progress - last) < 0.0015) return;
      last = progress;

      const { a, b, t } = bracket(progress);
      root.style.setProperty('--atm-top', mix(a.top, b.top, t));
      root.style.setProperty('--atm-mid', mix(a.mid, b.mid, t));
      root.style.setProperty('--atm-base', mix(a.base, b.base, t));
      // Warmth peaks in the mandapam and again at the finale.
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

/** Smoothstep — no abrupt arrivals at a stop. */
function ease(t: number): number {
  const c = t < 0 ? 0 : t > 1 ? 1 : t;
  return c * c * (3 - 2 * c);
}

function warmthAt(p: number): number {
  // Two lamplit peaks: the ceremony, and the final invitation.
  const ceremony = Math.exp(-((p - 0.58) ** 2) / 0.012);
  const finale = Math.exp(-((p - 0.99) ** 2) / 0.01);
  return Math.min(1, 0.22 + ceremony * 0.7 + finale * 0.6);
}

function mix(a: string, b: string, t: number): string {
  const ca = hex(a);
  const cb = hex(b);
  const r = Math.round(ca[0] + (cb[0] - ca[0]) * t);
  const g = Math.round(ca[1] + (cb[1] - ca[1]) * t);
  const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t);
  return `rgb(${r} ${g} ${bl})`;
}

function hex(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
