import { Scene, SceneContent, SceneLayer } from '../ui/Scene';
import { ScriptTitle } from '../ui/ScriptTitle';
import { Reveal } from '../ui/Reveal';
import { Plate } from '../ui/Plate';
import { Lamplight } from '../scenery/Lamplight';
import { useParallax } from '../../hooks/useParallax';
import { people } from '../../data/wedding';

/**
 * Meet the couple.
 *
 * Two portraits, deliberately not aligned to one another: the first
 * sits left and high, the second right and low, so the eye travels
 * down the page rather than scanning across a row. Each photograph
 * drifts a little against its own text as it passes, which is what
 * separates the picture from the paper it is printed on.
 */
export function Couple() {
  return (
    <Scene id="couple" light="paper" label="Meet the couple">
      <SceneLayer depth="back">
        <Lamplight from="right" strength={0.26} spread={1.2} phase={2.6} flicker={false} />
      </SceneLayer>

      <SceneContent className="couple">
        <ScriptTitle eyebrow="Together, at last">Meet the couple</ScriptTitle>

        <div className="couple__list">
          {people.map((person, i) => (
            <Portrait key={person.id} person={person} index={i} />
          ))}
        </div>
      </SceneContent>
    </Scene>
  );
}

function Portrait({
  person,
  index,
}: {
  person: (typeof people)[number];
  index: number;
}) {
  // Alternating sides get opposite drift, so the two portraits lean
  // towards each other as the section passes.
  const photoRef = useParallax<HTMLDivElement>({
    speed: index % 2 === 0 ? -0.07 : 0.07,
    maxShift: 56,
    disableBelow: 900,
  });

  return (
    <article className={`couple__person couple__person--${index % 2 === 0 ? 'start' : 'end'}`}>
      <Reveal variant="curtain" className="couple__photo">
        <div ref={photoRef} className="u-layer">
          <Plate src={person.photo} alt={`Photograph of ${person.name}`} ratio="4 / 5" tilt={index % 2 === 0 ? -1.6 : 1.8} />
        </div>
      </Reveal>

      <div className="couple__text">
        <Reveal variant="rise" delay={120}>
          <p className="couple__role u-eyebrow">{person.role}</p>
        </Reveal>
        <Reveal variant="rise" delay={200}>
          <h3 className="couple__name u-script">{person.name}</h3>
        </Reveal>
        <Reveal variant="rise" delay={280}>
          <p className="couple__line u-serif-body">{person.line}</p>
        </Reveal>
      </div>
    </article>
  );
}
