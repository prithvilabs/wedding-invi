import { useState } from 'react';
import { Scene, SceneContent, SceneLayer } from '../ui/Scene';
import { ScriptTitle } from '../ui/ScriptTitle';
import { Reveal } from '../ui/Reveal';
import { Lamplight } from '../scenery/Lamplight';
import { Kolam } from '../scenery/Kolam';
import { whatsappUrl } from '../../lib/links';
import { rsvp, rsvpConfig, weddingEvents } from '../../data/wedding';

type Form = {
  firstName: string;
  lastName: string;
  email: string;
  guests: string;
  events: string[];
  meal: string;
  message: string;
};

const EMPTY: Form = {
  firstName: '',
  lastName: '',
  email: '',
  guests: '1',
  events: [],
  meal: rsvp.mealOptions[0],
  message: '',
};

type Errors = Partial<Record<keyof Form, string>>;

function validate(form: Form): Errors {
  const errors: Errors = {};
  if (!form.firstName.trim()) errors.firstName = 'Please tell us your first name.';
  if (!form.lastName.trim()) errors.lastName = 'Please tell us your last name.';
  // Deliberately permissive: the only thing worth catching here is a
  // typo obvious enough to be certain about.
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'That email address looks incomplete.';
  }
  if (form.events.length === 0) errors.events = 'Please choose at least one event.';
  return errors;
}

/**
 * The reply card — the last page of the printed invitation.
 *
 * Where it goes depends on what has been configured, and it always
 * goes somewhere: with a Google Form id it posts to the form (and
 * so to the family's sheet); without one it composes the same reply
 * and hands it to WhatsApp. There is no state in which this button
 * does nothing, which is the failure mode a wedding site cannot
 * afford — a guest who thinks they have replied and has not.
 *
 * The form posts into a hidden iframe rather than navigating, so a
 * guest who replies is not thrown out of the invitation onto a
 * Google confirmation page.
 */
export function Rsvp() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    // Clear a field's error the moment it is corrected, never on blur
    // only — an error that outlives the mistake reads as a broken form.
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const toggleEvent = (id: string) => {
    setForm((f) => ({
      ...f,
      events: f.events.includes(id) ? f.events.filter((e) => e !== id) : [...f.events, id],
    }));
    setErrors((e) => (e.events ? { ...e, events: undefined } : e));
  };

  const summary = (): string => {
    const names = weddingEvents
      .filter((e) => form.events.includes(e.id))
      .map((e) => `${e.name} (${e.dateDisplay})`)
      .join(', ');
    return [
      `RSVP — ${form.firstName} ${form.lastName}`.trim(),
      form.email.trim() && `Email: ${form.email.trim()}`,
      `Guests: ${form.guests}`,
      `Attending: ${names}`,
      `Meal: ${form.meal}`,
      form.message.trim() && `Message: ${form.message.trim()}`,
    ]
      .filter(Boolean)
      .join('\n');
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const found = validate(form);
    if (Object.keys(found).length > 0) {
      e.preventDefault();
      setErrors(found);
      // Send focus to the first thing that is actually wrong.
      const first = document.getElementById(`rsvp-${Object.keys(found)[0]}`);
      first?.focus();
      first?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }

    if (!rsvpConfig.formId) {
      e.preventDefault();
      window.open(whatsappUrl(summary()), '_blank', 'noopener,noreferrer');
      setSent(true);
      return;
    }
    // The real form submits into the hidden iframe below; Google's
    // response is opaque to us, so the thank-you is shown optimistically.
    setSent(true);
  };

  const action = rsvpConfig.formId
    ? `https://docs.google.com/forms/d/e/${rsvpConfig.formId}/formResponse`
    : undefined;

  return (
    <Scene id="rsvp" light="paper" label="Kindly reply">
      <SceneLayer depth="back">
        <Lamplight from="bottom" strength={0.32} spread={1.25} phase={2.9} />
        <Kolam size={360} className="rsvp__kolam" drawn />
      </SceneLayer>

      <SceneContent className="rsvp">
        <ScriptTitle eyebrow={rsvp.eyebrow}>{rsvp.title}</ScriptTitle>

        <Reveal variant="fade" delay={120}>
          <p className="rsvp__line u-serif-body">{rsvp.line}</p>
        </Reveal>

        {sent ? (
          <Reveal variant="focus" className="sheet sheet--wide rsvp__thanks">
            <h3 className="rsvp__thanks-title u-script">Thank you</h3>
            <p className="rsvp__thanks-line u-serif-body">
              Your reply is on its way to us. We can’t wait to see you.
            </p>
            <button className="button" onClick={() => { setForm(EMPTY); setSent(false); }}>
              <span>Send another reply</span>
            </button>
          </Reveal>
        ) : (
          <Reveal variant="settle" className="sheet sheet--wide">
            <span className="sheet__band" aria-hidden="true" />

            <form
              className="rsvp__form"
              action={action}
              method="post"
              target={action ? 'rsvp-sink' : undefined}
              onSubmit={onSubmit}
              noValidate
            >
              <div className="rsvp__row">
                <Field
                  id="rsvp-firstName"
                  label="First name"
                  required
                  error={errors.firstName}
                  name={rsvpConfig.fields.firstName}
                  value={form.firstName}
                  onChange={(v) => set('firstName', v)}
                  autoComplete="given-name"
                />
                <Field
                  id="rsvp-lastName"
                  label="Last name"
                  required
                  error={errors.lastName}
                  name={rsvpConfig.fields.lastName}
                  value={form.lastName}
                  onChange={(v) => set('lastName', v)}
                  autoComplete="family-name"
                />
              </div>

              <div className="rsvp__row">
                <Field
                  id="rsvp-email"
                  label="Email"
                  type="email"
                  error={errors.email}
                  name={rsvpConfig.fields.email}
                  value={form.email}
                  onChange={(v) => set('email', v)}
                  autoComplete="email"
                  help="Only so we can reach you about the day."
                />

                <div className="field">
                  <label className="field__label u-label" htmlFor="rsvp-guests">
                    Number of guests
                  </label>
                  <div className="field__select">
                    <select
                      id="rsvp-guests"
                      className="field__input"
                      name={rsvpConfig.fields.guests}
                      value={form.guests}
                      onChange={(e) => set('guests', e.target.value)}
                    >
                      {Array.from({ length: rsvp.maxGuests }, (_, i) => String(i + 1)).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                    <ChevronIcon />
                  </div>
                </div>
              </div>

              <fieldset className="field field--group" aria-describedby={errors.events ? 'rsvp-events-error' : undefined}>
                <legend className="field__label u-label">Events attending</legend>
                <div className="chooser">
                  {weddingEvents.map((event) => {
                    const checked = form.events.includes(event.id);
                    return (
                      <label key={event.id} className={`chooser__option ${checked ? 'is-on' : ''}`}>
                        <input
                          type="checkbox"
                          className="chooser__input"
                          name={rsvpConfig.fields.events}
                          value={`${event.name} — ${event.dateDisplay}`}
                          checked={checked}
                          onChange={() => toggleEvent(event.id)}
                        />
                        <span className="chooser__mark" aria-hidden="true">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className="chooser__text">
                          <span className="chooser__name">{event.name}</span>
                          <span className="chooser__when">
                            {event.dateDisplay} · {event.city}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors.events && (
                  <p id="rsvp-events-error" className="field__error" role="alert">
                    {errors.events}
                  </p>
                )}
              </fieldset>

              <div className="field">
                <label className="field__label u-label" htmlFor="rsvp-meal">
                  Meal preference
                </label>
                <div className="field__select">
                  <select
                    id="rsvp-meal"
                    className="field__input"
                    name={rsvpConfig.fields.meal}
                    value={form.meal}
                    onChange={(e) => set('meal', e.target.value)}
                  >
                    {rsvp.mealOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronIcon />
                </div>
              </div>

              <div className="field">
                <label className="field__label u-label" htmlFor="rsvp-message">
                  Message
                </label>
                <textarea
                  id="rsvp-message"
                  className="field__input field__input--area"
                  name={rsvpConfig.fields.message}
                  rows={3}
                  placeholder="Anything you’d like us to know…"
                  value={form.message}
                  onChange={(e) => set('message', e.target.value)}
                />
              </div>

              <button className="button button--primary rsvp__submit" type="submit">
                <span>{rsvp.buttonLabel}</span>
                <span className="button__sweep" aria-hidden="true" />
              </button>
            </form>
          </Reveal>
        )}

        {/* Google's form response lands here instead of navigating the
            guest away from the invitation. */}
        {action && <iframe title="RSVP" name="rsvp-sink" className="u-visually-hidden" tabIndex={-1} />}
      </SceneContent>
    </Scene>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  name,
  type = 'text',
  required = false,
  error,
  help,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  help?: string;
  autoComplete?: string;
}) {
  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label className="field__label u-label" htmlFor={id}>
        {label}
        {required && (
          <>
            <span aria-hidden="true"> *</span>
            <span className="u-visually-hidden"> (required)</span>
          </>
        )}
      </label>
      <input
        id={id}
        className="field__input"
        type={type}
        name={name}
        value={value}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={[errorId, helpId].filter(Boolean).join(' ') || undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {/* The error sits with the field it belongs to, never only in a
          summary at the top. */}
      {error && (
        <p id={errorId} className="field__error" role="alert">
          {error}
        </p>
      )}
      {help && !error && (
        <p id={helpId} className="field__help">
          {help}
        </p>
      )}
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg className="field__chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <path d="m4 6.5 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
