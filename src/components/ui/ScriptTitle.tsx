import type { ReactNode } from 'react';
import { useReveal } from '../../hooks/useReveal';

type Props = {
  /** The small tracked line above the title. */
  eyebrow?: string;
  children: ReactNode;
  /** Heading level. The page must still read correctly as an outline. */
  as?: 'h2' | 'h3';
  align?: 'center' | 'start';
  className?: string;
};

/**
 * The ceremonial title of a section.
 *
 * A tracked sans eyebrow, a script line, and a single brass rule
 * with a small diamond at its centre — the mark that sits under a
 * heading on a printed South Indian invitation. That rule is the
 * only ornament the site repeats, which is what makes it read as a
 * house style rather than as decoration.
 *
 * The rule draws outward from the centre as the title arrives;
 * it is a `scaleX`, so nothing around it moves.
 */
export function ScriptTitle({
  eyebrow,
  children,
  as: Tag = 'h2',
  align = 'center',
  className = '',
}: Props) {
  const { ref, revealed } = useReveal<HTMLDivElement>({ threshold: 0.08 });

  return (
    <div
      ref={ref}
      className={`title title--${align} ${revealed ? 'is-revealed' : ''} ${className}`}
    >
      {eyebrow && <p className="title__eyebrow u-eyebrow">{eyebrow}</p>}
      <Tag className="title__script">{children}</Tag>
      <span className="title__rule" aria-hidden="true">
        <span className="title__rule-line" />
        <span className="title__rule-mark" />
        <span className="title__rule-line" />
      </span>
    </div>
  );
}
