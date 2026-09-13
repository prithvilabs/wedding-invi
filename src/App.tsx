import { useCallback, useState } from 'react';
import { Atmosphere } from './components/layout/Atmosphere';
import { Opening } from './components/layout/Opening';
import { Navigation } from './components/layout/Navigation';
import { MusicControl } from './components/layout/MusicControl';
import { BlossomSprite } from './components/scenery/BlossomSprite';
import { Grain } from './components/scenery/Grain';
import { Hero } from './components/sections/Hero';
import { Countdown } from './components/sections/Countdown';
import { Couple } from './components/sections/Couple';
import { Story } from './components/sections/Story';
import { Moments } from './components/sections/Moments';
import { Events } from './components/sections/Events';
import { Presence } from './components/sections/Presence';
import { Families } from './components/sections/Families';
import { Wishes } from './components/sections/Wishes';
import { Travel } from './components/sections/Travel';
import { Rsvp } from './components/sections/Rsvp';
import { Finale } from './components/sections/Finale';
import { SceneBridge } from './components/ui/SceneBridge';
import { couple, wedding } from './data/wedding';

/**
 * One continuous move from the doorway to the last page of the card.
 *
 * No two scenes touch: every pair is joined by a bridge that carries
 * the ground of one into the other while something physical happens
 * in between — cloth falls, a kolam is laid, light warms, paper
 * takes over. Read top to bottom, this file is the shot list.
 */
export default function App() {
  // The hero holds its breath until the invitation is opened, so the
  // two sequences read as one arrival rather than two overlapping ones.
  const [entered, setEntered] = useState(false);
  const onOpen = useCallback(() => setEntered(true), []);

  return (
    <>
      <a className="u-skip-link" href="#events">
        Skip to the wedding details
      </a>

      {/* Every flower on the page, defined once and instanced. */}
      <BlossomSprite />

      <Opening onOpen={onOpen} />
      <Atmosphere />
      <Grain strength={0.16} />
      <Navigation />

      <main id="main">
        <Hero begin={entered} />
        {/* out of the entrance, the cloth falling with us */}
        <SceneBridge variant="silk" from="dawn" to="paper" height={14} />

        <Countdown />
        <SceneBridge variant="kolam" from="paper" to="paper" height={13} />

        <Couple />
        <SceneBridge variant="paper" from="paper" to="blush" height={12} />

        <Story />
        <SceneBridge variant="paper" from="blush" to="sage" height={13} />

        <Moments />
        {/* the light going down as we step into the mandapam */}
        <SceneBridge variant="silk" from="sage" to="mandapam" height={16} />

        <Events />
        {/* lamps behind us, back into the light */}
        <SceneBridge variant="light" from="mandapam" to="brass" height={16} />

        <Presence />
        <SceneBridge variant="paper" from="brass" to="sage" height={13} />

        <Families />
        <SceneBridge variant="paper" from="sage" to="blush" height={12} />

        <Wishes />
        <SceneBridge variant="paper" from="blush" to="paper" height={12} />

        <Travel />
        <SceneBridge variant="kolam" from="paper" to="paper" height={13} />

        <Rsvp />
        {/* and back under the lamp, one last time */}
        <SceneBridge variant="light" from="paper" to="lamplit" height={15} />

        <Finale />
      </main>

      <footer className="footer">
        <p className="footer__mark u-display">{couple.monogram}</p>
        <p className="footer__line u-label">
          {couple.one} <span aria-hidden="true">&amp;</span>
          <span className="u-visually-hidden">and</span> {couple.two}
          {' · '}
          <time dateTime={wedding.dateISO}>{wedding.dateDisplay}</time>
        </p>
      </footer>

      <MusicControl begin={entered} />
    </>
  );
}
