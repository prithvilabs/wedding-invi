import { Scene, SceneContent, SceneLayer } from '../ui/Scene';
import { ScriptTitle } from '../ui/ScriptTitle';
import { Reveal } from '../ui/Reveal';
import { Lamplight } from '../scenery/Lamplight';
import { families, familiesIntro } from '../../data/wedding';

/**
 * The two houses, set side by side and given exactly equal weight —
 * same card, same width, same type, no visual seniority either way.
 * On a phone they stack, groom first, which is the order they are
 * read aloud.
 *
 * Each card is a sheet of invitation paper: ivory, a hairline brass
 * border inset from the edge, and a small brass mark where an
 * engraved card would have one.
 */
export function Families() {
  return (
    <Scene id="families" light="sage" label="The families">
      <SceneLayer depth="back">
        <Lamplight from="above" strength={0.24} spread={1.3} phase={4.4} flicker={false} />
      </SceneLayer>

      <SceneContent className="families">
        <ScriptTitle eyebrow="With love">The families</ScriptTitle>

        <Reveal variant="fade" delay={120}>
          <p className="families__intro u-serif-body">{familiesIntro}</p>
        </Reveal>

        <div className="families__pair">
          {families.map((family, i) => (
            <Reveal key={family.side} as="article" variant="settle" delay={i * 130} className="families__card">
              <p className="families__side u-eyebrow">{family.side}</p>
              <span className="families__mark" aria-hidden="true" />

              {family.names.length > 0 ? (
                <ul className="families__names">
                  {family.names.map((name) => (
                    <li key={name} className="families__name u-display">
                      {name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="families__pending u-label">{family.note}</p>
              )}
            </Reveal>
          ))}
        </div>
      </SceneContent>
    </Scene>
  );
}
