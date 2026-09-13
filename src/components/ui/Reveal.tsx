import type { ElementType, ReactNode } from 'react';
import { useReveal } from '../../hooks/useReveal';

type Props = {
  as?: ElementType;
  /** How the element arrives. */
  variant?: 'rise' | 'focus' | 'settle' | 'fade' | 'draw' | 'curtain';
  /** Milliseconds. Stagger a group by passing increasing delays. */
  delay?: number;
  threshold?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Viewport-activated arrival.
 *
 * The revealed state is a class, not a running animation, so a visitor
 * who scrolls past at speed lands on the finished composition instead
 * of catching it mid-flight — and a visitor who scrolls slowly sees
 * the full move. Nothing is ever left half-arrived.
 */
export function Reveal({
  as: Tag = 'div',
  variant = 'rise',
  delay = 0,
  threshold,
  className = '',
  children,
}: Props) {
  const { ref, revealed } = useReveal<HTMLElement>({ threshold });

  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${variant} ${revealed ? 'is-revealed' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
