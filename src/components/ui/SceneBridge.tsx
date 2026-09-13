import { useReveal } from '../../hooks/useReveal';
import { useParallax } from '../../hooks/useParallax';
import { Gopuram } from '../scenery/Gopuram';
import { JasmineGarland } from '../scenery/JasmineGarland';
import { Thoranam } from '../scenery/Thoranam';
import { Kolam } from '../scenery/Kolam';
import { KuthuVilakku } from '../scenery/KuthuVilakku';

type Props = {
  /** Which pieces of architecture the camera passes through here. */
  variant: 'gopuram' | 'arch' | 'garland' | 'lamps' | 'kolam';
  /** The scene above and the scene below, so the bridge can blend them. */
  from: string;
  to: string;
  /** Height of the passage, in viewport units. */
  height?: number;
};

/**
 * The passage between two scenes.
 *
 * These exist so the site has no cuts. The colour of the scene above
 * bleeds down, the colour of the scene below rises up, and in the
 * overlap the camera passes some piece of the venue — a tower, a
 * doorway, a curtain of jasmine — which is what makes the change of
 * room feel travelled rather than jumped.
 */
export function SceneBridge({ variant, from, to, height = 44 }: Props) {
  const { ref, revealed } = useReveal<HTMLDivElement>({ threshold: 0.02 });
  const driftRef = useParallax<HTMLDivElement>({ speed: -0.28, maxShift: 140, disableBelow: 600 });
  const foreRef = useParallax<HTMLDivElement>({ speed: 0.22, maxShift: 180, disableBelow: 900 });

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

      {variant === 'gopuram' && (
        <div ref={driftRef} className="bridge__skyline u-layer">
          <Gopuram depth={2} tiers={7} className="bridge__tower bridge__tower--far" />
          <Gopuram depth={1} tiers={6} className="bridge__tower bridge__tower--mid" />
          <Gopuram depth={0} tiers={5} className="bridge__tower bridge__tower--near" />
        </div>
      )}

      {variant === 'arch' && (
        <div className="bridge__doorway">
          <svg viewBox="0 0 1200 400" preserveAspectRatio="none" role="presentation">
            <path
              d="M0 400 L0 0 L1200 0 L1200 400 L1040 400 L1040 250 Q1040 60 600 60 Q160 60 160 250 L160 400 Z"
              fill="var(--c-ivory)"
              opacity="0.9"
            />
            <path
              d="M160 250 Q160 60 600 60 Q1040 60 1040 250"
              stroke="var(--c-gold)"
              strokeWidth="3"
              fill="none"
              opacity="0.4"
            />
          </svg>
          <Thoranam swags={7} seed={41} />
        </div>
      )}

      {variant === 'garland' && (
        <div ref={foreRef} className="bridge__curtain u-layer">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <JasmineGarland
              key={i}
              strands={3}
              length={220 + (i % 3) * 90}
              width={90}
              seed={60 + i}
              accent={i % 4 === 0 ? 'blue' : 'none'}
              style={{ left: `${(i / 7) * 100}%`, translate: '-50% 0' }}
            />
          ))}
        </div>
      )}

      {variant === 'lamps' && (
        <div className="bridge__lamps">
          <KuthuVilakku height={170} phase={0} />
          <Kolam size={190} drawn={revealed} />
          <KuthuVilakku height={170} phase={1.3} />
        </div>
      )}

      {variant === 'kolam' && (
        <div className="bridge__threshold">
          <Kolam size={240} drawn={revealed} />
        </div>
      )}
    </div>
  );
}
