import { Scene, SceneContent, SceneLayer } from '../ui/Scene';
import { ScriptTitle } from '../ui/ScriptTitle';
import { Reveal } from '../ui/Reveal';
import { Lamplight } from '../scenery/Lamplight';
import { mapsUrl } from '../../lib/links';
import { travel, travelNote, weddingEvents } from '../../data/wedding';

/**
 * Where everything is, and how to get there.
 *
 * The venues come first, because that is what a guest is actually
 * looking for; the travel notes are below them and can stay
 * placeholders until the family has the details. Repeated venues
 * are folded together — Vijay Raja Mahal hosts two events and
 * should be one entry, not two.
 */
export function Travel() {
  const venues = weddingEvents.reduce<Array<{ venue: string; city: string; mapQuery: string; events: string[] }>>(
    (out, event) => {
      const existing = out.find((v) => v.mapQuery === event.mapQuery);
      if (existing) existing.events.push(event.name);
      else out.push({ venue: event.venue, city: event.city, mapQuery: event.mapQuery, events: [event.name] });
      return out;
    },
    [],
  );

  return (
    <Scene id="travel" light="paper" label="Venues and travel">
      <SceneLayer depth="back">
        <Lamplight from="right" strength={0.22} spread={1.2} phase={7.3} flicker={false} />
      </SceneLayer>

      <SceneContent className="travel">
        <ScriptTitle eyebrow="Getting there">Venues</ScriptTitle>

        <ul className="travel__venues">
          {venues.map((venue, i) => (
            <Reveal key={venue.mapQuery} as="li" variant="settle" delay={i * 100} className="travel__venue">
              <h3 className="travel__venue-name u-display">{venue.venue}</h3>
              <p className="travel__venue-city u-label">{venue.city}</p>
              <p className="travel__venue-for">{venue.events.join(' · ')}</p>
              <a
                className="link"
                href={mapsUrl(venue.mapQuery)}
                target="_blank"
                rel="noreferrer noopener"
              >
                <span>
                  Open in Maps
                  <span className="u-visually-hidden"> — {venue.venue}, {venue.city}</span>
                </span>
              </a>
            </Reveal>
          ))}
        </ul>

        <dl className="travel__notes">
          {travel.map((item, i) => (
            <Reveal key={item.key} as="div" variant="rise" delay={i * 90} className="travel__note">
              <dt className="travel__note-label u-label">{item.label}</dt>
              <dd className="travel__note-value">{item.value}</dd>
            </Reveal>
          ))}
        </dl>

        <Reveal variant="fade" delay={160}>
          <p className="travel__foot u-serif-body">{travelNote}</p>
        </Reveal>
      </SceneContent>
    </Scene>
  );
}
