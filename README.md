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
| Names, dates, venue, story, families, travel, ceremonies, RSVP, guestbook, music | `src/data/wedding.ts` |
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

The RSVP form is functional, but honestly scoped: there is no server behind
it yet, so a reply is validated and saved to the **visitor's own browser**
(`localStorage`), and the form says so plainly rather than implying it reaches
the family. Set `rsvp.enabled = false` in `src/data/wedding.ts` to revert to a
plain "opening soon" placeholder without touching any component.

When a real backend exists, replace the `writeLocal` call in
`src/components/sections/RsvpForm.tsx` with a real request — the form's
validation, fields and confirmation screen don't need to change.

### Guestbook

Same honesty rule: blessings are saved to the visitor's own device only —
there is no shared wall yet, so one guest never sees another's message. The
component (`src/components/sections/Guestbook.tsx`) says this in its own
copy. Wire it to a real backend the same way as the RSVP form, by replacing
`writeLocal`/`readLocal` with real requests.

### Ceremony timeline

`src/data/wedding.ts` exports `ceremonies`, a plain array built from the two
**confirmed** dates. It is deliberately *not* a breakdown of named rituals
(Nichayathartham, Muhurtham, Sapthapadi, and so on) — nobody has confirmed
which of those this couple is holding, or when, and guessing would be exactly
the kind of fabrication this project avoids everywhere else. Add real entries
in the same shape as soon as the family confirms them; the timeline renders
however many it is given.

### Calendar and maps

"Add to calendar" (Google Calendar link + `.ics` download) and "Get
directions" (Google/Apple Maps) are built from `src/utils/calendar.ts` and
the venue text already in `events` — no coordinates are hardcoded, since none
have been supplied. Update the venue text and both stay correct.

### Shower blessings

A one-off burst of petals and akshata at the very end, drawn from the same
flower vocabulary as the rest of the site. It never plays on its own — only
on the button press — and a soft synthesised bell chime (see
`src/utils/chime.ts`, no recorded audio, no autoplay) plays alongside it and
on a saved RSVP or a posted blessing.

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

### The interactive pieces

Everything a visitor types back into the site — the RSVP form, the guestbook,
the shower-blessings burst — lives in `src/components/sections/RsvpForm.tsx`,
`Guestbook.tsx` and `src/components/scenery/ShowerBlessings.tsx`, styled from
`src/styles/interactive.css`. These use **Framer Motion** for their reveals
and exits (a conditional field group opening, a blessing entering the list, a
petal falling) — the one part of the site where a general-purpose animation
library earns its place, rather than the bespoke scroll engine that drives
the parallax and lighting above. That engine stays hand-built because it was
measured and tuned for a specific cost budget across forty-odd scenery
layers; Framer Motion doesn't touch it.

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
