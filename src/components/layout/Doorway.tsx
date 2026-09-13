import { memo, useEffect, useState } from 'react';
import { JasmineGarland } from '../scenery/JasmineGarland';
import { KuthuVilakku } from '../scenery/KuthuVilakku';
import { Kolam } from '../scenery/Kolam';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * The way in.
 *
 * A visitor arrives at a closed carved door, lamps lit either side and
 * a kolam laid at the threshold, and the doors open onto the mandapam.
 * It is the one moment in the site that is genuinely a cut, and it
 * earns its place by being the thing that makes everything after it
 * read as *inside*.
 *
 * It opens on its own after a beat, so nobody has to find a button.
 * The panels are removed from the document once they are out of frame,
 * so they cost nothing for the rest of the visit.
 */
function DoorwayBase({ onOpen }: { onOpen: () => void }) {
  const reduced = useReducedMotion();
  const [state, setState] = useState<'shut' | 'opening' | 'gone'>('shut');

  useEffect(() => {
    // Nobody waits at a door that never opens.
    if (reduced) {
      setState('gone');
      onOpen();
      return;
    }
    const open = window.setTimeout(() => setState('opening'), 900);
    const clear = window.setTimeout(() => setState('gone'), 3400);
    const reveal = window.setTimeout(onOpen, 2100);
    return () => {
      window.clearTimeout(open);
      window.clearTimeout(clear);
      window.clearTimeout(reveal);
    };
  }, [reduced, onOpen]);

  // Let anyone who would rather not wait push straight through.
  useEffect(() => {
    if (state !== 'shut') return;
    const push = () => setState('opening');
    window.addEventListener('pointerdown', push, { once: true });
    window.addEventListener('keydown', push, { once: true });
    window.addEventListener('wheel', push, { once: true, passive: true });
    return () => {
      window.removeEventListener('pointerdown', push);
      window.removeEventListener('keydown', push);
      window.removeEventListener('wheel', push);
    };
  }, [state]);

  if (state === 'gone') return null;

  return (
    <div className={`doorway ${state === 'opening' ? 'is-opening' : ''}`} aria-hidden="true">
      {/* The wall the doors are set into */}
      <div className="doorway__wall">
        <KuthuVilakku height={240} phase={0} className="doorway__lamp doorway__lamp--left" />
        <KuthuVilakku height={240} phase={1.5} className="doorway__lamp doorway__lamp--right" />
        <JasmineGarland strands={3} length={340} width={90} seed={301} className="doorway__garland doorway__garland--left" />
        <JasmineGarland strands={3} length={340} width={90} seed={307} accent="blue" className="doorway__garland doorway__garland--right" />
        <Kolam size={220} drawn className="doorway__kolam" />
      </div>

      <DoorPanel side="left" />
      <DoorPanel side="right" />

      {/* The light that spills through the widening gap */}
      <span className="doorway__light" />
    </div>
  );
}

function DoorPanel({ side }: { side: 'left' | 'right' }) {
  return (
    <div className={`doorway__panel doorway__panel--${side}`}>
      <svg className="doorway__field" viewBox="0 0 300 900" preserveAspectRatio="none" role="presentation">
        <defs>
          <linearGradient id={`door-${side}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={side === 'left' ? '#0b1a2f' : '#16304f'} />
            <stop offset="70%" stopColor={side === 'left' ? '#16304f' : '#0b1a2f'} />
            <stop offset="100%" stopColor="#0a1728" />
          </linearGradient>
        </defs>

        <rect width="300" height="900" fill={`url(#door-${side})`} />

        {/* Inlaid gold border */}
        <rect x="18" y="18" width="264" height="864" fill="none" stroke="var(--c-gold)" strokeWidth="2" opacity="0.55" />
        <rect x="30" y="30" width="240" height="840" fill="none" stroke="var(--c-gold-soft)" strokeWidth="0.8" opacity="0.35" />

        {/* The meeting edge catches the light */}
        <rect x={side === 'left' ? 296 : 0} y="0" width="4" height="900" fill="var(--c-gold-soft)" opacity="0.7" />
      </svg>

      {/* Carved ornament. Its own square viewport, so the rosettes stay
          round however wide the door is. */}
      <svg className="doorway__carving" viewBox="0 0 200 200" role="presentation">
        <g transform="translate(100 100)" stroke="var(--c-gold)" fill="none" opacity="0.6">
          {Array.from({ length: 16 }, (_, i) => (
            <path key={`o${i}`} d="M0 -88 Q17 -60 0 -36 Q-17 -60 0 -88 Z" transform={`rotate(${i * 22.5})`} strokeWidth="1.1" />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <path key={`m${i}`} d="M0 -48 Q16 -27 0 -8 Q-16 -27 0 -48 Z" transform={`rotate(${i * 45})`} strokeWidth="1.3" fill="var(--c-gold)" fillOpacity="0.14" />
          ))}
          <circle r="11" strokeWidth="1.5" />
          <circle r="4.5" fill="var(--c-gold)" fillOpacity="0.55" stroke="none" />
        </g>
      </svg>

      <svg className="doorway__carving doorway__carving--low" viewBox="0 0 200 200" role="presentation">
        <g transform="translate(100 100)" stroke="var(--c-gold)" fill="none" opacity="0.4">
          {Array.from({ length: 12 }, (_, i) => (
            <path key={`l${i}`} d="M0 -70 Q13 -47 0 -26 Q-13 -47 0 -70 Z" transform={`rotate(${i * 30})`} strokeWidth="1" />
          ))}
          <circle r="9" strokeWidth="1.2" />
        </g>
      </svg>

      {/* Handle ring */}
      <span className="doorway__ring" />
    </div>
  );
}

export const Doorway = memo(DoorwayBase);
