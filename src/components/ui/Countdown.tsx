import { useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

type Split = { days: number; hours: number; minutes: number; seconds: number };

function splitRemaining(targetISO: string): Split {
  const ms = Math.max(0, new Date(`${targetISO}T00:00:00`).getTime() - Date.now());
  const seconds = Math.floor(ms / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

/**
 * A live countdown to a confirmed date. Ticks once a second while
 * mounted; under reduced motion it still updates (the numbers
 * changing is information, not decoration) but drops the per-second
 * fade so nothing flickers continuously on screen.
 */
export function Countdown({ targetISO, label }: { targetISO: string; label?: string }) {
  const [split, setSplit] = useState<Split>(() => splitRemaining(targetISO));
  const reduced = useReducedMotion();

  useEffect(() => {
    setSplit(splitRemaining(targetISO));
    const id = window.setInterval(() => setSplit(splitRemaining(targetISO)), 1000);
    return () => window.clearInterval(id);
  }, [targetISO]);

  const arrived = split.days + split.hours + split.minutes + split.seconds === 0;

  return (
    <div className={`countdown ${reduced ? 'is-still' : ''}`} role="timer" aria-live="off">
      {label && <span className="u-visually-hidden">{label}</span>}
      {arrived ? (
        <p className="countdown__arrived u-display">Today is the day</p>
      ) : (
        <dl className="countdown__grid">
          <Unit value={split.days} unit="Days" />
          <Unit value={split.hours} unit="Hours" />
          <Unit value={split.minutes} unit="Min" />
          <Unit value={split.seconds} unit="Sec" />
        </dl>
      )}
    </div>
  );
}

function Unit({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="countdown__unit">
      <dd className="countdown__value u-display" aria-hidden="true">
        {String(value).padStart(2, '0')}
      </dd>
      <dt className="countdown__label u-label">{unit}</dt>
      <span className="u-visually-hidden">{`${value} ${unit}`}</span>
    </div>
  );
}
