import { useCallback, useState } from 'react';
import { Atmosphere } from './components/layout/Atmosphere';
import { Doorway } from './components/layout/Doorway';
import { BlossomSprite } from './components/scenery/BlossomSprite';
import { Navigation } from './components/layout/Navigation';
import { MusicControl } from './components/layout/MusicControl';
import { Hero } from './components/sections/Hero';
import { Story } from './components/sections/Story';
import { Families } from './components/sections/Families';
import { Journey } from './components/sections/Journey';
import { Wedding } from './components/sections/Wedding';
import { Reception } from './components/sections/Reception';
import { Travel } from './components/sections/Travel';
import { Gallery } from './components/sections/Gallery';
import { Finale } from './components/sections/Finale';
import { SceneBridge } from './components/ui/SceneBridge';
import { couple, events } from './data/wedding';

/**
 * One continuous move through the venue.
 *
 * The scenes are never adjacent: every pair is joined by a bridge
 * that carries the colour of one into the other while the camera
 * passes through some piece of the place. Read top to bottom, this
 * file is the shot list.
 */
export default function App() {
  // The hero holds its breath until the doors are open, so the two
  // sequences read as one arrival rather than two overlapping ones.
  const [entered, setEntered] = useState(false);
  const onOpen = useCallback(() => setEntered(true), []);

  return (
    <>
      <a className="u-skip-link" href="#wedding">
        Skip to the wedding details
      </a>

      {/* Every flower in the venue, defined once and instanced. */}
      <BlossomSprite />

      <Doorway onOpen={onOpen} />
      <Atmosphere />
      <Navigation />

      <main id="main">
        <Hero begin={entered} />
        {/* out of the entrance, under the jasmine */}
        <SceneBridge variant="garland" from="entrance" to="ivory" height={14} />

        <Story />
        {/* across the threshold into the family hall */}
        <SceneBridge variant="kolam" from="ivory" to="daylight" height={12} />

        <Families />
        {/* out past the towers, into the long evening */}
        <SceneBridge variant="gopuram" from="daylight" to="night" height={16} />

        <Journey />
        {/* back through the doorway, into the mandapam */}
        <SceneBridge variant="arch" from="night" to="ceremony" height={15} />

        <Wedding />
        {/* lamps lit, the light going down */}
        <SceneBridge variant="lamps" from="ceremony" to="evening" height={13} />

        <Reception />
        <SceneBridge variant="gopuram" from="evening" to="night" height={13} />

        <Travel />
        <SceneBridge variant="garland" from="night" to="ivory" height={13} />

        <Gallery />
        {/* and back under the arch, one last time */}
        <SceneBridge variant="arch" from="ivory" to="finale" height={15} />

        <Finale />
      </main>

      <footer className="footer">
        <p className="footer__mark u-display">{couple.monogram}</p>
        <p className="footer__line u-label">
          {couple.one} <span aria-hidden="true">&amp;</span>
          <span className="u-visually-hidden">and</span> {couple.two}
          {' · '}
          <time dateTime={events.wedding.dateISO}>{events.wedding.dateDisplay}</time>
        </p>
      </footer>

      <MusicControl />
    </>
  );
}
