import { Scene, SceneContent, SceneLayer } from '../ui/Scene';
import { ScriptTitle } from '../ui/ScriptTitle';
import { Reveal } from '../ui/Reveal';
import { Lamplight } from '../scenery/Lamplight';
import { Petals } from '../scenery/Petals';
import { useReveal } from '../../hooks/useReveal';
import { firstMessages, story } from '../../data/wedding';

/**
 * Six chapters, told down the page.
 *
 * The chapters alternate sides against a single brass thread that
 * draws itself down the middle as the visitor descends — one line,
 * scaled on Y, which is the whole spine of the section. Nothing
 * moves at the same moment as anything else: the numeral, the
 * title and the line each arrive on their own delay, so a chapter
 * assembles rather than appearing.
 */
export function Story() {
  const { ref: threadRef, revealed: threadIn } = useReveal<HTMLDivElement>({ threshold: 0.2 });

  return (
    <Scene id="story" light="blush" label="Our love story">
      <SceneLayer depth="back">
        <Lamplight from="left" strength={0.22} spread={1.3} phase={5.2} flicker={false} />
      </SceneLayer>
      <SceneLayer depth="front">
        <Petals count={6} seed={71} tone="jasmine" />
      </SceneLayer>

      <SceneContent className="story">
        <ScriptTitle eyebrow="Our journey">Our love story</ScriptTitle>

        <FirstMessages />

        <div ref={threadRef} className={`story__chapters ${threadIn ? 'is-in' : ''}`}>
          <span className="story__thread" aria-hidden="true" />

          {story.map((chapter, i) => (
            <article
              key={chapter.numeral}
              className={`story__chapter story__chapter--${i % 2 === 0 ? 'start' : 'end'}`}
            >
              <Reveal variant="focus" className="story__numeral-wrap">
                <span className="story__numeral u-display" aria-hidden="true">
                  {chapter.numeral}
                </span>
              </Reveal>

              <div className="story__body">
                <Reveal variant="rise" delay={80}>
                  <p className="story__eyebrow u-eyebrow">{chapter.eyebrow}</p>
                </Reveal>
                <Reveal variant="rise" delay={160}>
                  <h3 className="story__title u-script">{chapter.title}</h3>
                </Reveal>
                <Reveal variant="rise" delay={260}>
                  <p className="story__line u-serif-body">{chapter.line}</p>
                </Reveal>
              </div>
            </article>
          ))}
        </div>
      </SceneContent>
    </Scene>
  );
}

/**
 * The first few messages, kept.
 *
 * Set as a folded sheet of paper rather than as a chat application:
 * ivory ground, maroon ink, a gold rule at the fold. The lines
 * arrive one after another on a stagger, which does the work a
 * typing indicator would do without borrowing the furniture of a
 * messaging app.
 */
function FirstMessages() {
  const { ref, revealed } = useReveal<HTMLDivElement>({ threshold: 0.18 });

  return (
    <div ref={ref} className={`began ${revealed ? 'is-in' : ''}`}>
      <Reveal variant="rise">
        <p className="began__eyebrow u-eyebrow">{firstMessages.eyebrow}</p>
      </Reveal>
      <Reveal variant="rise" delay={100}>
        <p className="began__line u-serif-body">{firstMessages.line}</p>
      </Reveal>

      <div className="began__sheet">
        <ol className="began__thread">
          {firstMessages.thread.map((message, i) => (
            <li
              key={i}
              className={`began__message began__message--${message.from}`}
              style={{ '--message-index': i } as React.CSSProperties}
            >
              <span className="began__bubble">{message.text}</span>
            </li>
          ))}
        </ol>
        <p className="began__footer u-script">{firstMessages.footer}</p>
      </div>
    </div>
  );
}
