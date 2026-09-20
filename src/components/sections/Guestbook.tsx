import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { guestbook } from '../../data/wedding';
import { readLocal, writeLocal } from '../../utils/storage';
import { playChime } from '../../utils/chime';
import { useReducedMotion } from '../../hooks/useReducedMotion';

type Blessing = { id: string; name: string; message: string; postedAt: string };

/**
 * A wall of blessings, kept honestly local.
 *
 * There is nowhere for these messages to go yet — no shared database,
 * no way for another guest to see one another's words. So this reads
 * back only what this browser itself has written, says so in its own
 * copy, and never pretends to be a live, shared guestbook.
 */
export function Guestbook() {
  const reduced = useReducedMotion();
  const [messages, setMessages] = useState<Blessing[]>(() => readLocal(guestbook.storageKey, [] as Blessing[]));
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please write a short message first.');
      return;
    }
    const entry: Blessing = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim() || 'A well-wisher',
      message: message.trim(),
      postedAt: new Date().toISOString(),
    };
    const next = [entry, ...messages];
    setMessages(next);
    writeLocal(guestbook.storageKey, next);
    setMessage('');
    setError(null);
    playChime();
  };

  return (
    <div className="guestbook">
      <form className="guestbook__form" onSubmit={submit} noValidate>
        <div className="guestbook__field">
          <label htmlFor="guestbook-name" className="u-label">
            {guestbook.nameLabel}
          </label>
          <input id="guestbook-name" type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </div>
        <div className="guestbook__field">
          <label htmlFor="guestbook-message" className="u-visually-hidden">
            Blessing
          </label>
          <textarea
            id="guestbook-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={guestbook.placeholder}
            rows={3}
            maxLength={400}
          />
        </div>
        {error && (
          <p className="guestbook__error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="guestbook__submit">
          {guestbook.submitLabel}
        </button>
      </form>

      <p className="guestbook__disclaimer u-label">{guestbook.disclaimer}</p>

      <ul className="guestbook__list">
        {messages.length === 0 && <li className="guestbook__empty">{guestbook.emptyState}</li>}
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.li
              key={m.id}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
              className="guestbook__item"
            >
              <p className="guestbook__message">{m.message}</p>
              <p className="guestbook__meta u-label">
                {m.name} · {formatWhen(m.postedAt)}
              </p>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}
