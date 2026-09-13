import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Lamplight } from '../scenery/Lamplight';
import { Grain } from '../scenery/Grain';
import { Kolam } from '../scenery/Kolam';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { opening } from '../../data/wedding';

type Props = {
  /** Fired when the visitor opens the invitation — by hand, always. */
  onOpen: () => void;
};

/**
 * The way in: five seconds of a dark room becoming a lit one.
 *
 * Nothing is drawn. The room starts almost black and warm, a lamp
 * that is never shown is lit somewhere low and to the left, and the
 * light it throws grows until it has found the ornament, the kolam
 * at the threshold and finally the words. That is the whole film:
 * a lamp being lit, told only through what the lamp touches.
 *
 * The lines arrive on their own beats and then the button, which is
 * the only way through. That matters twice over — it is how a
 * printed invitation actually behaves, and it is the gesture that
 * earns the site permission to play music.
 *
 * If a real film is ever dropped into `opening.videoSrc` it plays
 * in place of the light, with the same lines over it and the same
 * button under it.
 */
function OpeningBase({ onOpen }: Props) {
  const reduced = useReducedMotion();
  const [beat, setBeat] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  /* Five beats over ~4.6s: light, then each line, then the date.
     The button is always present and always usable — the film is
     something you may watch, never something you must wait out. */
  useEffect(() => {
    if (reduced) {
      setBeat(9);
      return;
    }
    const marks = [420, 1300, 2150, 3000, 3850, 4600];
    const timers = marks.map((ms, i) => window.setTimeout(() => setBeat(i + 1), ms));
    return () => timers.forEach(window.clearTimeout);
  }, [reduced]);

  /* Focus lands on the one control on screen, so a keyboard visitor
     can open the invitation with a single press. */
  useEffect(() => {
    buttonRef.current?.focus({ preventScroll: true });
  }, []);

  const open = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    // The hero begins while the doors are still opening, so the two
    // read as one arrival rather than two overlapping ones.
    window.setTimeout(onOpen, reduced ? 0 : 520);
  }, [leaving, onOpen, reduced]);

  /* Scrolling past the opening is also opening it. Nobody should be
     trapped behind a splash screen. */
  useEffect(() => {
    if (leaving) return;
    const onWheel = () => open();
    window.addEventListener('wheel', onWheel, { once: true, passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [leaving, open]);

  /* Once the film is gone it is gone — it costs nothing for the rest
     of the visit, and there is no way back into it. */
  const [gone, setGone] = useState(false);
  useEffect(() => {
    if (!leaving) return;
    const t = window.setTimeout(() => setGone(true), reduced ? 60 : 1500);
    return () => window.clearTimeout(t);
  }, [leaving, reduced]);

  /* While the film is up the page underneath must not scroll. */
  useEffect(() => {
    if (gone) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [gone]);

  if (gone) return null;

  return (
    <div
      className={`opening beat-${Math.min(beat, 6)} ${leaving ? 'is-leaving' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Open the invitation"
    >
      {/* The room. Warm near-black, never neutral grey. */}
      <div className="opening__room" aria-hidden="true">
        {opening.videoSrc ? (
          <video
            className="opening__film"
            src={opening.videoSrc}
            poster={opening.poster ?? undefined}
            autoPlay
            muted
            playsInline
            preload="auto"
          />
        ) : (
          <>
            {/* The lamp, present only as what it lights. */}
            <Lamplight from="bottom-left" strength={0.92} spread={1.25} phase={0} />
            <Lamplight from="bottom-right" strength={0.42} spread={0.85} phase={3.4} />
            {/* What the light finds: the carved surface behind, and
                the kolam on the floor at the threshold. */}
            <span className="opening__wall" />
            <Kolam size={300} drawn={beat >= 1} delay={500} className="opening__kolam" />
          </>
        )}
        <Grain strength={0.3} />
      </div>

      <div className="opening__frame" aria-hidden="true">
        <span className="opening__frame-edge" />
      </div>

      <div className="opening__content">
        <div className="opening__lines">
          {opening.lines.map((line, i) => (
            <p key={line} className={`opening__line u-display ${beat > i ? 'is-in' : ''}`}>
              {line}
            </p>
          ))}
          <p className={`opening__date u-label ${beat > opening.lines.length ? 'is-in' : ''}`}>
            {opening.date}
          </p>
        </div>

        <button ref={buttonRef} className="opening__cta" onClick={open}>
          <span className="opening__cta-face">{opening.cta}</span>
          {/* The light that sweeps across brass when it is turned. */}
          <span className="opening__cta-sweep" aria-hidden="true" />
        </button>
      </div>

      {/* The warm light that floods the frame as the invitation opens. */}
      <span className="opening__flood" aria-hidden="true" />
    </div>
  );
}

export const Opening = memo(OpeningBase);
