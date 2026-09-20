/* =============================================================
   CHIME
   A soft bell tone for the handful of moments that deserve one:
   a saved RSVP, a posted blessing, blessings released at the end.

   Synthesised, not sampled — there is no recorded bell here, only a
   couple of sine partials shaped with a short envelope, which is what
   keeps this honest: it is a chime, not a stand-in for a real
   Carnatic performance.

   Created lazily and only from a user gesture (a click), which is
   also what every browser requires before it will run an
   AudioContext at all — so this can never autoplay by construction.
   ============================================================= */

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

/**
 * One struck bell, two partials and a soft attack. Call only from an
 * event handler — a click, a submit — never on load or on scroll.
 */
export function playChime(): void {
  const audio = getContext();
  if (!audio) return;

  const now = audio.currentTime;
  const master = audio.createGain();
  master.gain.setValueAtTime(0, now);
  master.connect(audio.destination);

  const partials: Array<[frequency: number, level: number, decay: number]> = [
    [1046.5, 0.14, 1.1], // C6 — the strike
    [1568.0, 0.06, 0.7], // a fifth above, for shimmer
  ];

  for (const [freq, level, decay] of partials) {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(level, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);
    osc.connect(gain).connect(master);
    osc.start(now);
    osc.stop(now + decay + 0.05);
  }

  master.gain.setValueAtTime(1, now);
}
