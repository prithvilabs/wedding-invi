import { useMemo, useState } from 'react';
import { Scene, SceneContent, SceneLayer } from '../ui/Scene';
import { ScriptTitle } from '../ui/ScriptTitle';
import { Reveal } from '../ui/Reveal';
import { Lamplight } from '../scenery/Lamplight';
import { whatsappUrl } from '../../lib/links';
import { wishes, wishesCopy } from '../../data/wedding';

/**
 * The wishes wall, and the way onto it.
 *
 * The form composes a message and hands it to WhatsApp rather than
 * pretending to write to a database the site does not have — a
 * wishes box that silently swallowed what people wrote would be
 * worse than no wishes box. Wishes that have already arrived are
 * seeded in `data/wedding.ts` and shown here as cards.
 */
export function Wishes() {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');

  const href = useMemo(
    () =>
      whatsappUrl(
        `A wish for Prithvi Raj & Harshini${name.trim() ? ` — from ${name.trim()}` : ''}:\n\n${note.trim()}`,
      ),
    [name, note],
  );

  const ready = note.trim().length > 0;

  return (
    <Scene id="wishes" light="blush" label="Wishes for the couple">
      <SceneLayer depth="back">
        <Lamplight from="left" strength={0.2} spread={1.25} phase={6.1} flicker={false} />
      </SceneLayer>

      <SceneContent className="wishes">
        <div className="wishes__form-wrap">
          <Reveal variant="settle" className="sheet">
            <span className="sheet__band" aria-hidden="true" />

            <p className="sheet__eyebrow u-eyebrow">Warm wishes</p>
            <p className="sheet__hint u-label">Optional</p>

            <div className="field">
              <label className="field__label u-label" htmlFor="wish-name">
                Your name
              </label>
              <input
                id="wish-name"
                className="field__input"
                type="text"
                autoComplete="name"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field__label u-label" htmlFor="wish-note">
                Wishes &amp; messages
              </label>
              <textarea
                id="wish-note"
                className="field__input field__input--area"
                rows={4}
                placeholder="Send us a little note…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                aria-describedby="wish-help"
              />
              <p id="wish-help" className="field__help">
                Your message opens in WhatsApp so you can send it to us directly.
              </p>
            </div>

            <a
              className={`button button--primary ${ready ? '' : 'is-disabled'}`}
              href={ready ? href : undefined}
              target="_blank"
              rel="noreferrer noopener"
              aria-disabled={ready ? undefined : true}
              onClick={(e) => {
                if (!ready) e.preventDefault();
              }}
            >
              <span>Send wish</span>
            </a>
          </Reveal>
        </div>

        <ScriptTitle eyebrow={wishesCopy.eyebrow} as="h3">
          {wishesCopy.title}
        </ScriptTitle>

        {wishes.length > 0 ? (
          <ul className="wishes__wall">
            {wishes.map((wish, i) => (
              <Reveal key={`${wish.from}-${i}`} as="li" variant="settle" delay={(i % 3) * 90} className="wishes__card">
                <blockquote className="wishes__quote u-serif-body">“{wish.text}”</blockquote>
                <p className="wishes__from u-label">— {wish.from}</p>
              </Reveal>
            ))}
          </ul>
        ) : (
          <Reveal variant="fade">
            <p className="wishes__empty u-label">{wishesCopy.empty}</p>
          </Reveal>
        )}
      </SceneContent>
    </Scene>
  );
}
