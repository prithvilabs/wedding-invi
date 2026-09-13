import { useEffect, useRef, useState } from 'react';
import { music } from '../../data/wedding';

/**
 * Music, entirely on the visitor's terms.
 *
 * Nothing is loaded and nothing plays until the button is pressed —
 * there is no autoplay here, and no attempt at one. The audio element
 * is created only on first press, so a visitor who never asks for
 * music never downloads any.
 */
export function MusicControl() {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  // No track configured yet — show nothing rather than a dead control.
  if (!music.src) return null;

  const toggle = async () => {
    if (!audioRef.current) {
      const audio = new Audio(music.src as string);
      audio.loop = true;
      audio.volume = 0.45;
      audio.preload = 'none';
      audio.addEventListener('ended', () => setPlaying(false));
      audioRef.current = audio;
    }

    const audio = audioRef.current;
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
      // Browser declined playback; say so rather than showing a
      // button that looks pressed but is silent.
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
      <span className="music__label u-label" aria-hidden="true">
        {playing ? 'Pause' : 'Play'}
      </span>
    </button>
  );
}
