import { useEffect, useRef, useState } from 'react';
import { couple, navLinks } from '../../data/wedding';
import { subscribe, createGeometryCache } from '../../hooks/scrollEngine';

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
  const progressRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState('hero');
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Section positions come from the engine's cache. Measuring seven
    // sections every frame — while every scenery layer writes its own
    // transform — was forcing seven reflows a frame on its own.
    // The menu is ordered for reading — Our story, Events, Gallery —
    // but the album comes before the schedule in the document. The
    // "last one passed" test below only holds if these are in document
    // order, so sort them into it rather than trusting the menu.
    const sections = navLinks
      .map((link) => {
        const el = document.getElementById(link.id);
        return el ? { id: link.id, el, geometry: createGeometryCache(el) } : null;
      })
      .filter((s): s is { id: string; el: HTMLElement; geometry: (e: number) => { top: number; height: number } } => s !== null)
      .sort((a, b) =>
        a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
      );

    return subscribe(({ y, vh, epoch, progress }) => {
      setLifted(y > vh * 0.55);

      // How far through the invitation the visitor has come. Written
      // straight to the element — a progress bar that re-rendered the
      // navigation on every frame would be worse than none.
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
      }

      // Whichever scene owns the middle of the screen owns the nav —
      // and in the gaps between them (bridges, and the sections that
      // are not nav targets) the last one passed keeps it, rather than
      // falling back to Home as though the visitor had returned to the
      // top of the page.
      const middle = y + vh * 0.5;
      let current = sections[0]?.id ?? 'hero';
      for (const section of sections) {
        const { top } = section.geometry(epoch);
        if (top <= middle) current = section.id;
        else break;
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

      <span ref={progressRef} className="nav__progress" aria-hidden="true" />

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
