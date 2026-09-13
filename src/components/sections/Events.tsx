import { Scene, SceneContent, SceneLayer } from '../ui/Scene';
import { ScriptTitle } from '../ui/ScriptTitle';
import { Reveal } from '../ui/Reveal';
import { Lamplight } from '../scenery/Lamplight';
import { Silk } from '../scenery/Silk';
import { Petals } from '../scenery/Petals';
import { downloadIcs, googleCalendarUrl, mapsUrl } from '../../lib/links';
import { weddingEvents, type WeddingEvent } from '../../data/wedding';

/**
 * The schedule.
 *
 * Four cards, each cut from the cloth of its own occasion — the
 * evening reception from night silk, the muhurtham from kumkum, the
 * Thanjavur lunch from brass, the Hosur one from leaf green. The
 * card *is* the invitation: ivory rules on dark cloth, a brass edge,
 * the venue set the way it is set on a printed card.
 *
 * They lift a few pixels and warm slightly under a pointer, and do
 * exactly the same on tap. Nothing flips, and nothing spins: the
 * whole card is already facing the visitor, so there is nothing on
 * a back to go and find.
 */
export function Events() {
  return (
    <Scene id="events" light="mandapam" label="Events schedule">
      {/* Entering the mandapam: the light drops, lamps take over,
          and the air is cloth rather than paper. */}
      <SceneLayer depth="back">
        <Silk tone="kumkum" strength={0.3} angle={22} />
        <Lamplight from="bottom-left" strength={0.5} spread={1.1} phase={0} />
        <Lamplight from="bottom-right" strength={0.44} spread={1} phase={5.6} />
      </SceneLayer>
      <SceneLayer depth="front">
        <Petals count={7} seed={88} tone="marigold" />
      </SceneLayer>

      <SceneContent className="events">
        <ScriptTitle eyebrow="Four days of celebration">Events schedule</ScriptTitle>

        <ul className="events__list">
          {weddingEvents.map((event, i) => (
            <Reveal
              key={event.id}
              as="li"
              variant="settle"
              delay={(i % 2) * 110}
              className="events__item"
            >
              <EventCard event={event} />
            </Reveal>
          ))}
        </ul>
      </SceneContent>
    </Scene>
  );
}

function EventCard({ event }: { event: WeddingEvent }) {
  return (
    <article className={`card card--${event.tone}`}>
      <div className="card__cloth" aria-hidden="true">
        <Silk tone={event.tone === 'night' ? 'kumkum' : event.tone === 'kumkum' ? 'kumkum' : event.tone} strength={0.5} angle={26} />
      </div>
      {/* The light that falls across the top edge of a card standing
          on a lamplit table. */}
      <span className="card__edge" aria-hidden="true" />

      <div className="card__body">
        <p className="card__kind u-eyebrow">{event.kind}</p>
        <h3 className="card__name u-script">{event.name}</h3>
        <p className="card__note">{event.note}</p>

        <dl className="card__facts">
          <div className="card__fact">
            <dt className="u-label">Date</dt>
            <dd>
              <time dateTime={event.dateISO}>
                {event.day} · {event.dateDisplay}
              </time>
            </dd>
          </div>
          <div className="card__fact">
            <dt className="u-label">Time</dt>
            <dd>{event.timeDisplay}</dd>
          </div>
          <div className="card__fact card__fact--wide">
            <dt className="u-label">Venue</dt>
            <dd>
              {event.venue}
              <span className="card__city">{event.city}</span>
            </dd>
          </div>
        </dl>

        <div className="card__actions">
          <a
            className="action"
            href={mapsUrl(event.mapQuery)}
            target="_blank"
            rel="noreferrer noopener"
          >
            <MapIcon />
            <span>
              Directions
              <span className="u-visually-hidden"> to {event.venue}, {event.city}</span>
            </span>
          </a>

          <a
            className="action"
            href={googleCalendarUrl(event)}
            target="_blank"
            rel="noreferrer noopener"
          >
            <CalendarIcon />
            <span>
              Google
              <span className="u-visually-hidden"> Calendar — add {event.name}</span>
            </span>
          </a>

          <button className="action" onClick={() => downloadIcs(event)}>
            <AppleIcon />
            <span>
              Apple
              <span className="u-visually-hidden"> Calendar — download {event.name} as a calendar file</span>
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

/* Line icons at the weight of the type they sit beside. No emoji,
   and nothing filled — a filled glyph next to a hairline serif
   reads as a sticker. */

function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" focusable="false">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" focusable="false">
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" focusable="false">
      <path d="M12 7.5c-2.4-1.4-5.5-.4-6.3 2.2-.9 2.9.8 7 3 9 .9.8 1.8.3 2.6-.1.5-.2 1-.2 1.5 0 .8.4 1.7.9 2.6.1 2.2-2 3.9-6.1 3-9-.8-2.6-3.9-3.6-6.4-2.2Z" strokeLinejoin="round" />
      <path d="M12 7.5c.2-1.6 1.3-3 2.9-3.4" strokeLinecap="round" />
    </svg>
  );
}
