import { useEffect, useRef, useState } from 'react';
import { couple, navLinks } from '../../data/wedding';
import { subscribe } from '../../hooks/scrollEngine';

/**
 * Minimal floating navigation.
 *
 * It stays out of the composition: transparent over the hero, and
 * only taking on a glass ground once the visitor has left it. The
 * active link is derived from which scene currently holds the
 * centre of the viewport.
 */
export function Navigation() {
  const [lifted, setLifted] = useState(false);
  const [active, setActive] = useState('hero');
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    return subscribe(({ y, vh }) => {
      setLifted(y > vh * 0.55);

      // Whichever scene owns the middle of the screen owns the nav.
      let current = 'hero';
      for (const link of navLinks) {
        const el = document.getElementById(link.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= vh * 0.5 && rect.bottom > vh * 0.5) {
          current = link.id;
          break;
        }
      }
      setActive(current);
    });
  }, []);

  // A menu over a full-screen scene must be dismissible without hunting
  // for the close button.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`nav ${lifted ? 'is-lifted' : ''} ${open ? 'is-open' : ''}`}>
      <a className="nav__mark u-display" href="#hero" onClick={() => setOpen(false)}>
        {couple.monogram}
      </a>

      <button
        ref={toggleRef}
        className="nav__toggle"
        aria-expanded={open}
        aria-controls="nav-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="u-visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
        <span className="nav__bars" aria-hidden="true">
          <span />
          <span />
        </span>
      </button>

      <nav id="nav-menu" ref={panelRef} className="nav__menu" aria-label="Invitation sections">
        <ul className="nav__list">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                className={`nav__link u-label ${active === link.id ? 'is-active' : ''}`}
                href={`#${link.id}`}
                aria-current={active === link.id ? 'true' : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
