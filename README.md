# Prithvi Raj & Harshini

A cinematic digital wedding invitation — one continuous camera move through a
blue-and-ivory South Indian mandapam, controlled by scrolling.

**Wedding** · 28 January 2027
**Reception** · 7 February 2027 · Anand Grand Palace, Hosur

```bash
npm install
npm run dev       # local development
npm run build     # production build into dist/
npm run preview   # serve the production build
```

---

## Changing the content

**You should not need to touch a component to change what the site says.**
All copy, dates, names and placeholders live in two files:

| What | Where |
| --- | --- |
| Names, dates, venue, story, families, travel, RSVP, music | `src/data/wedding.ts` |
| Gallery photographs | `src/data/gallery.ts` |

### Placeholders

Details that are not confirmed are written as explicit placeholders, not as
invented content. Replace the text and the layout absorbs it — nothing needs
redesigning.

- `events.wedding.detailsPlaceholder` — currently **"Wedding details to follow"**.
  Leave this exactly as it is until the family confirms the ceremony details.
- `events.reception.detailsPlaceholder` — reception timings.
- `families[].names` — empty. Add the elders' names as an array of strings and
  the "family names to follow" line disappears on its own. Two to four names a
  side keeps the symmetry.
- `travel[]` — add, remove or rewrite entries freely; the section renders
  however many it is given.
- `rsvp` — see below.

### Adding photographs

Put image files in `public/gallery/`, then point each entry in
`src/data/gallery.ts` at one:

```ts
{ id: 'g1', src: '/gallery/mehendi.jpg', alt: 'Prithvi Raj and Harshini at the mehendi', span: 'tall', tilt: -2.5, depth: 0.75 }
```

- `span` — `wide`, `tall` or `small`; drives the editorial rhythm of the album.
- `tilt` — −4…4 degrees, so the album looks hand-laid rather than gridded.
- `depth` — 0…1, how far the plate drifts against the scroll.
- `alt` — please write a real description; it is read aloud to visitors using
  a screen reader.

An entry with `src: null` renders as an empty album plate. That is deliberate,
not a broken image. While every plate is empty, one note reads "Photographs to
follow" beneath the album.

### Music

Music **never autoplays** and nothing is downloaded until a visitor presses
play. To add a track, drop a file in `public/music/` and set:

```ts
export const music = { src: '/music/nadaswaram.mp3', title: 'Nadaswaram' };
```

With `src: null` the control hides itself entirely.

### RSVP

The RSVP section is intentionally inert: there is no form, because there is
nothing to submit to yet, and no fake confirmation. When a real endpoint
exists, replace the `finale__rsvp-status` line in
`src/components/sections/Finale.tsx` with the form component. The surrounding
section is already sized and styled for it — no other part of the page moves.

---

## How the site is built

### The venue comes first

The design system and the environment were built before any section. Sections
are placed *inside* the venue rather than decorated afterwards, which is why
scenes flow into one another instead of stacking as cards.

Everything physical in the site — pillars, garlands, lamps, arches, kolam,
gopuram, thoranam, flowers — is **procedural SVG**, not images. There are no
decorative PNGs to load, the environment is crisp at any screen size, and the
whole page weighs well under 100 kB gzipped.

### Design tokens

`src/styles/tokens.css` holds every colour, type step, space, duration, easing
curve, shadow and layer. Nothing else in the project restates a visual value.
Changing the palette, the type scale or the pace of the whole film happens in
that one file.

### The camera

- `src/hooks/scrollEngine.ts` — **one** scroll listener and **one** rAF tick
  for the entire site. Every parallax layer, the colour grade and the
  navigation share it, so adding a depth plane costs a transform write rather
  than another listener.
- `useParallax` — attaches an element to that engine and writes its transform
  directly. React never re-renders on scroll.
- `useSceneProgress` — publishes a scene's own progress as `--scene-progress`,
  which CSS uses to drive lighting and to draw the India ↔ USA line of light
  exactly as far as the visitor has travelled.
- `useReveal` — viewport activation. The revealed state is a *class*, not a
  running animation, so scrolling past at speed lands on the finished
  composition rather than catching it mid-flight. Nothing is ever left
  half-arrived.

### Lighting

`src/components/layout/Atmosphere.tsx` interpolates a three-colour grade from
the visitor's position in the document and lays it over the page as a
soft-light wash. It grades what is already there rather than painting the site
blue — the difference between a venue lit in blue and a blue website.

### Scenes and bridges

`src/App.tsx` reads top to bottom as the shot list. No two scenes are
adjacent: every pair is joined by a `SceneBridge` that blends the colour of one
room into the next while the camera passes through some piece of the place — a
tower, a doorway, a curtain of jasmine, a threshold kolam.

Scenes taller than the screen put their architecture on a `stage` (a sticky,
viewport-high frame), so the room stays around the visitor instead of hanging
its ceiling above them and standing its lamps below them.

---

## Accessibility

- Semantic landmarks, a heading per scene, and a skip link as the first tab stop.
- Every decorative layer is `aria-hidden` and inert to pointers.
- `prefers-reduced-motion` stills the camera but keeps the whole composition —
  nothing is hidden and nothing is restyled.
- Visible focus rings, accessible names on both controls, real `<time>`
  elements for both dates.

## Browser support

Modern evergreen browsers. The site uses `color-mix()`, `clamp()`, container-free
fluid type and CSS nesting-free plain selectors; no polyfills are needed.
