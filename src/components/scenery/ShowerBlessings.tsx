import { useState } from 'react';
import { motion } from 'framer-motion';
import { seeded } from './rng';
import { playChime } from '../../utils/chime';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { showerBlessings } from '../../data/wedding';

type Piece = { id: number; left: number; delay: number; drift: number; size: number; kind: 'akshata' | 'petal'; hue: 'ivory' | 'gold' | 'rose' | 'blue' };

/**
 * One festive burst, on request — golden akshata and petals falling
 * through the frame, drawn from the same visual vocabulary as the
 * ambient petals elsewhere in the site rather than a new decorative
 * language. It bursts once per press and then settles; it is never
 * continuous, and it never runs on its own.
 */
export function ShowerBlessings() {
  const reduced = useReducedMotion();
  const [wave, setWave] = useState(0);
  const [pieces, setPieces] = useState<Piece[]>([]);

  const release = () => {
    const rand = seeded(Date.now() % 100000);
    const count = reduced ? 0 : 46;
    const next: Piece[] = Array.from({ length: count }, (_, i) => {
      const kind: Piece['kind'] = rand() > 0.55 ? 'akshata' : 'petal';
      const hue: Piece['hue'] = kind === 'akshata' ? 'gold' : (['ivory', 'rose', 'blue'] as const)[Math.floor(rand() * 3)];
      return {
        id: wave * 1000 + i,
        left: rand() * 100,
        delay: rand() * 0.5,
        drift: (rand() - 0.5) * 160,
        size: kind === 'akshata' ? 4 + rand() * 4 : 9 + rand() * 10,
        kind,
        hue,
      };
    });
    setPieces(next);
    setWave((w) => w + 1);
    playChime();
  };

  return (
    <div className="shower">
      <button type="button" className="shower__button" onClick={release}>
        {pieces.length > 0 ? showerBlessings.again : showerBlessings.label}
      </button>

      <div className="shower__field u-decor" aria-hidden="true">
        {pieces.map((p) => (
          <motion.span
            key={p.id}
            className={`shower__piece shower__piece--${p.kind} shower__piece--${p.hue}`}
            style={{ left: `${p.left}%`, width: p.size, height: p.kind === 'akshata' ? p.size : p.size * 0.62 }}
            initial={{ y: -40, x: 0, opacity: 0, rotate: 0 }}
            animate={reduced ? { opacity: 0.9 } : { y: 620, x: p.drift, opacity: [0, 1, 1, 0], rotate: 260 }}
            transition={reduced ? { duration: 0.4 } : { duration: 2.6, delay: p.delay, ease: 'easeIn' }}
          />
        ))}
      </div>
    </div>
  );
}
