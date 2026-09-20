import { useEffect, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { rsvp } from '../../data/wedding';
import { readLocal, writeLocal } from '../../utils/storage';
import { playChime } from '../../utils/chime';
import { useReducedMotion } from '../../hooks/useReducedMotion';

type RsvpReply = {
  name: string;
  attending: 'yes' | 'no';
  guestCount: number;
  events: string[];
  diet: string;
  savedAt: string;
};

const EMPTY: Omit<RsvpReply, 'savedAt'> = {
  name: '',
  attending: 'yes',
  guestCount: 1,
  events: [],
  diet: rsvp.dietOptions[0],
};

/**
 * A working RSVP form — genuinely functional, honestly scoped.
 *
 * There is no server behind this yet, so a reply is validated and
 * saved to the visitor's own device and nowhere else. The form says
 * this plainly rather than implying a real submission, and once a
 * reply is saved it opens back up for editing rather than vanishing
 * behind a one-time "thank you" a guest can't get back to.
 */
export function RsvpForm() {
  const reduced = useReducedMotion();
  const [saved, setSaved] = useState<RsvpReply | null>(() => readLocal<RsvpReply | null>(rsvp.storageKey, null));
  const [editing, setEditing] = useState(saved === null);
  const [form, setForm] = useState<Omit<RsvpReply, 'savedAt'>>(() => saved ?? EMPTY);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (saved) setForm(saved);
  }, [saved]);

  if (!rsvp.enabled) {
    return (
      <p className="finale__rsvp-status u-label" role="status">
        {rsvp.status}
      </p>
    );
  }

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Please tell us who is replying.');
      return;
    }
    if (form.attending === 'yes' && form.events.length === 0) {
      setError('Please choose at least one event you’ll be attending.');
      return;
    }
    if (form.guestCount < 1 || form.guestCount > 10) {
      setError('Guest count should be between 1 and 10.');
      return;
    }

    const reply: RsvpReply = { ...form, savedAt: new Date().toISOString() };
    writeLocal(rsvp.storageKey, reply);
    setSaved(reply);
    setEditing(false);
    setError(null);
    playChime();
  };

  const toggleEvent = (id: string) => {
    setForm((f) => ({
      ...f,
      events: f.events.includes(id) ? f.events.filter((e) => e !== id) : [...f.events, id],
    }));
  };

  if (!editing && saved) {
    return (
      <div className="rsvp-form rsvp-form--summary">
        <p className="rsvp-form__saved-title u-display">{rsvp.savedTitle}</p>
        <p className="rsvp-form__saved-body">{rsvp.savedBody}</p>
        <dl className="rsvp-form__summary">
          <div>
            <dt className="u-label">Name</dt>
            <dd>{saved.name}</dd>
          </div>
          <div>
            <dt className="u-label">Attending</dt>
            <dd>{saved.attending === 'yes' ? `Yes, ${saved.guestCount} guest${saved.guestCount > 1 ? 's' : ''}` : 'Regretfully, no'}</dd>
          </div>
          {saved.attending === 'yes' && (
            <div>
              <dt className="u-label">Events</dt>
              <dd>
                {rsvp.eventOptions
                  .filter((o) => saved.events.includes(o.id))
                  .map((o) => o.label)
                  .join(' · ') || '—'}
              </dd>
            </div>
          )}
        </dl>
        <button type="button" className="rsvp-form__edit" onClick={() => setEditing(true)}>
          {rsvp.editLabel}
        </button>
        <p className="rsvp-form__disclaimer u-label">{rsvp.disclaimer}</p>
      </div>
    );
  }

  return (
    <form className="rsvp-form" onSubmit={submit} noValidate>
      <p className="rsvp-form__intro">{rsvp.body}</p>

      <div className="rsvp-form__field">
        <label htmlFor="rsvp-name" className="u-label">
          Full name
        </label>
        <input
          id="rsvp-name"
          type="text"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          autoComplete="name"
          required
        />
      </div>

      <fieldset className="rsvp-form__field">
        <legend className="u-label">Will you be attending?</legend>
        <div className="rsvp-form__radio-row">
          {(['yes', 'no'] as const).map((v) => (
            <label key={v} className="rsvp-form__radio">
              <input
                type="radio"
                name="attending"
                checked={form.attending === v}
                onChange={() => setForm((f) => ({ ...f, attending: v }))}
              />
              {v === 'yes' ? 'Joyfully, yes' : 'Regretfully, no'}
            </label>
          ))}
        </div>
      </fieldset>

      <AnimatePresence initial={false}>
        {form.attending === 'yes' && (
          <motion.div
            key="attending-fields"
            initial={reduced ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reduced ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.33, 0.02, 0.16, 1] }}
            className="rsvp-form__conditional"
          >
            <div className="rsvp-form__field">
              <label htmlFor="rsvp-guests" className="u-label">
                Number attending (including you)
              </label>
              <input
                id="rsvp-guests"
                type="number"
                min={1}
                max={10}
                value={form.guestCount}
                onChange={(e) => setForm((f) => ({ ...f, guestCount: Number(e.target.value) || 1 }))}
              />
            </div>

            <fieldset className="rsvp-form__field">
              <legend className="u-label">Which event(s)?</legend>
              <div className="rsvp-form__checkbox-row">
                {rsvp.eventOptions.map((opt) => (
                  <label key={opt.id} className="rsvp-form__checkbox">
                    <input type="checkbox" checked={form.events.includes(opt.id)} onChange={() => toggleEvent(opt.id)} />
                    {opt.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="rsvp-form__field">
              <label htmlFor="rsvp-diet" className="u-label">
                Dietary preference
              </label>
              <select id="rsvp-diet" value={form.diet} onChange={(e) => setForm((f) => ({ ...f, diet: e.target.value }))}>
                {rsvp.dietOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="rsvp-form__error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="rsvp-form__submit">
        {rsvp.submitLabel}
      </button>

      <p className="rsvp-form__disclaimer u-label">{rsvp.disclaimer}</p>
    </form>
  );
}
