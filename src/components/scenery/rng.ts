/**
 * Deterministic pseudo-random numbers.
 * Flower placement must be identical on every render and every
 * visitor's screen — a garland that reshuffles on re-render stops
 * reading as a physical object.
 */
export function seeded(seed: number): () => number {
  let s = (seed * 2654435761) >>> 0;
  return () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 0xffffffff;
  };
}

/** Evenly spaced positions with a deterministic wobble. */
export function scatter(
  count: number,
  seed: number,
  spread = 1,
): Array<{ t: number; jx: number; jy: number; r: number; s: number }> {
  const rand = seeded(seed);
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0.5 : i / (count - 1);
    return {
      t,
      jx: (rand() - 0.5) * spread,
      jy: (rand() - 0.5) * spread,
      r: (rand() - 0.5) * 360,
      s: 0.72 + rand() * 0.56,
    };
  });
}
