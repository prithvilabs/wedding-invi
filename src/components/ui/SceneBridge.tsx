import { useReveal } from '../../hooks/useReveal';
import { Kolam } from '../scenery/Kolam';
import { Silk } from '../scenery/Silk';
import { Lamplight } from '../scenery/Lamplight';

type Props = {
  /** What the camera passes through on the way from one room to the next. */
  variant: 'silk' | 'kolam' | 'light' | 'paper';
  /** The scene above and the scene below, so the bridge can blend them. */
  from: string;
  to: string;
  /** Height of the passage, in viewport units. */
  height?: number;
};

/**
 * The passage between two scenes.
 *
 * These exist so the site has no cuts. The ground of the scene above
 * bleeds down, the ground of the scene below rises to meet it, and
 * in the overlap something physical happens — cloth falls, a kolam
 * is laid, light warms, paper takes over — which is what makes the
 * change of room feel travelled rather than jumped.
 *
 * The bridge is the whole transition. Neither scene needs to know
 * what it is next to.
 */
export function SceneBridge({ variant, from, to, height = 16 }: Props) {
  const { ref, revealed } = useReveal<HTMLDivElement>({ threshold: 0.04 });

  return (
    <div
      ref={ref}
      className={`bridge bridge--${variant} ${revealed ? 'is-active' : ''}`}
      style={
        {
          height: `${height}vh`,
          '--bridge-from': `var(--scene-${from})`,
          '--bridge-to': `var(--scene-${to})`,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <div className="bridge__wash" />

      {/* Cloth falling from one room into the next. */}
      {variant === 'silk' && <Silk tone="kumkum" strength={0.36} angle={9} className="bridge__silk" />}

      {/* A threshold, with the kolam that marks it. */}
      {variant === 'kolam' && (
        <div className="bridge__threshold">
          <Kolam size={190} drawn={revealed} />
        </div>
      )}

      {/* The room ahead is lit and this one is not yet. */}
      {variant === 'light' && <Lamplight from="bottom" strength={0.55} spread={1.15} phase={2.2} />}

      {/* Photography giving way to paper. */}
      {variant === 'paper' && <div className="bridge__deckle" />}
    </div>
  );
}
