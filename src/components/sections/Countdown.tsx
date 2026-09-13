import { useEffect, useMemo, useRef, useState } from 'react';
import { Scene, SceneContent, SceneLayer } from '../ui/Scene';
import { Reveal } from '../ui/Reveal';
import { Kolam } from '../scenery/Kolam';
import { Lamplight } from '../scenery/Lamplight';
import { useReveal } from '../../hooks/useReveal';
import { wedding } from '../../data/wedding';

const UNITS = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
] as const;

type Remaining = Record<(typeof UNITS)[number]['key'], number>;

function remainingFrom(target: number, now: number): Remaining {
  const ms = Math.max(0, target - now);
  const total = Math.floor(ms / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor(total / 3600) % 24,
    minutes: Math.floor(total / 60) % 60,
    seconds: total % 60,
  };
}

/**
 * The count to the muhurtham, set as a printed calendar plate rather
 * than as a clock.
 *
 * The numerals never flip or spin. Each one is a serif figure on
 * ivory that dissolves and re-sets when its value changes — which
 * for three of the four units is once a minute or less, so the plate
 * is almost always perfectly still. Only the seconds move, and they
 * move quietly.
 *
 * The interval is torn down whenever the plate is off screen, so a
 * visitor reading the story at the bottom of the page is not paying
 * for a timer they cannot see.
 */
export function Countdown() {
  const target = useMemo(() => new Date(wedding.startsAt).getTime(), []);
  const { ref, revealed } = useReveal<HTMLDivElement>({ threshold: 0.05, once: false });
  const [now, setNow] = useState(() => Date.now());
  const arrived = useRef(false);
  if (revealed) arrived.current = true;

  useEffect(() => {
    if (!revealed) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [revealed]);

  const left = remainingFrom(target, now);
  const passed = target - now <= 0;

  return (
    <Scene id="countdown" light="paper" label="Countdown to the wedding">
      <SceneLayer depth="back">
        <Lamplight from="above" strength={0.3} spread={1.3} phase={1.1} flicker={false} />
      </SceneLayer>

      <SceneContent className="countdown">
        <Reveal variant="fade" className="countdown__plate-wrap">
          <div className="countdown__save">
            <p className="countdown__save-label u-eyebrow">Save the date</p>
            <p className="countdown__save-date u-script">{wedding.dateDisplay}</p>
          </div>
        </Reveal>

        <div ref={ref} className={`countdown__plate ${arrived.current ? 'is-in' : ''}`}>
          {/* The kolam the numbers are laid on, not beside. */}
          <Kolam size={420} drawn={arrived.current} delay={240} className="countdown__kolam" />

          {passed ? (
            <p className="countdown__arrived u-script">The day is here</p>
          ) : (
            <ol className="countdown__units">
              {UNITS.map((unit, i) => (
                <li
                  key={unit.key}
                  className="countdown__unit"
                  style={{ '--unit-index': i } as React.CSSProperties}
                >
                  {/* `key` on the value is what makes a changed figure
                      re-enter: React replaces the node, the entry
                      animation runs once, and the unchanged units are
                      left completely alone. */}
                  <span key={left[unit.key]} className="countdown__value u-display">
                    {String(left[unit.key]).padStart(2, '0')}
                  </span>
                  <span className="countdown__label u-label">{unit.label}</span>
                </li>
              ))}
            </ol>
          )}

          {/* One live announcement an hour is a courtesy; one a second
              is an assault, so the ticking figures stay out of the
              accessibility tree and this carries the meaning instead. */}
          <p className="u-visually-hidden" aria-live="polite">
            {passed
              ? 'The wedding day has arrived.'
              : `${left.days} days until the wedding on ${wedding.dateDisplay}.`}
          </p>
        </div>
      </SceneContent>
    </Scene>
  );
}
