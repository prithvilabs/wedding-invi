import { useCallback, useEffect, useRef, useState } from 'react';
import { music } from '../../data/wedding';

/**
 * Music, entirely on the visitor's terms.
 *
 * Nothing is fetched and nothing plays until the invitation has
 * been opened by hand — there is no autoplay here and no attempt at
 * one, and the audio element is not even constructed until that
 * gesture has happened, so a visitor who never opens the invitation
 * never downloads a note.
 *
 * The control is a single brass mark with four hair-thin strokes
 * that rise and fall while it plays and lie flat when it does not.
 * It reads as a state, not as a media player.
 */
export function MusicControl({ begin }: { begin: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(
    () => () => {
      audioRef.current?.pause();
      audioRef.current = null;
    },
    [],
  );

  const ensure = useCallback((): HTMLAudioElement | null => {
    if (!music.src) return null;
    if (!audioRef.current) {
      const audio = new Audio(music.src);
      audio.loop = true;
      audio.preload = 'none';
      // Nadaswaram at full volume under a page of text is not
      // atmosphere, it is an interruption.
      audio.volume = 0.32;
      audio.addEventListener('ended', () => setPlaying(false));
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  /* Opening the invitation is the gesture that earns playback. If the
     browser still declines, the control simply stays in its paused
     state — no error, nothing for the visitor to deal with. */
  useEffect(() => {
    if (!begin) return;
    const audio = ensure();
    if (!audio) return;
    let cancelled = false;
    audio
      .play()
      .then(() => !cancelled && setPlaying(true))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [begin, ensure]);

  if (!music.src) return null;

  const toggle = async () => {
    const audio = ensure();
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    try {
      await audio.play();
      setPlaying(true);
      setFailed(false);
    } catch {
      // Say so rather than showing a button that looks pressed and is silent.
      setFailed(true);
      setPlaying(false);
    }
  };

  return (
    <button
      className={`music ${playing ? 'is-playing' : ''}`}
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? `Pause ${music.title}` : `Play ${music.title}`}
      title={failed ? 'Playback unavailable' : music.title}
    >
      <span className="music__bars" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}
