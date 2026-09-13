import { useEffect, useState } from 'react';
import { subscribe } from '../../hooks/scrollEngine';

/** Invites the first scroll, then retires once it has been accepted. */
export function ScrollIndicator({ delay = 0 }: { delay?: number }) {
  const [gone, setGone] = useState(false);

  useEffect(() => subscribe(({ y }) => setGone(y > 80)), []);

  return (
    <div
      className={`scroll-cue ${gone ? 'is-gone' : ''}`}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
      aria-hidden="true"
    >
      <span className="scroll-cue__word u-eyebrow">Scroll</span>
      <span className="scroll-cue__line" />
    </div>
  );
}
