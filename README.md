# Prithvi Raj & Harshini — 28 January 2027

A digital wedding invitation for a South Indian Tamil Hindu wedding,
built as one continuous move from a doorway at night to the last page
of a printed card.

```
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run typecheck
```

React 18 + Vite + TypeScript. No UI framework, no animation library —
the motion is CSS transforms driven by one scroll loop.

---

## The one rule this design follows

**Traditional objects are suggested through their effect on the
environment, never drawn as ornament.**

There is no kuthu vilakku on this site. There is no gopuram, no
thoranam, no brass lamp, no temple SVG. What there is instead is what
those things *do*: a warm pool of light falling from low in the frame
with a bounce off the floor in front of it, a slow unsteadiness in that
light because an oil flame is never quite still, Kanchipuram silk as a
woven surface with a sheen drifting across it, paper grain under every
flat colour, and an atmosphere whose colour changes room by room as
you descend.

The one exception is the kolam, and it earns the exception because a
kolam *is* a drawing — made of line, at a threshold, by hand. It draws
itself on, stroke by stroke, rather than fading in.

If you are adding something to this site, apply the same test: would a
photograph of the real wedding contain this object as a graphic, or
would it contain the light and the material the object produces? Build
the second thing.

## Where the content lives

Everything a family member would want to change is in **`src/data/wedding.ts`**
and **`src/data/gallery.ts`**. No component hardcodes a name, a date, a
venue or a message. Placeholders say so in the text — replace the
words, not the shape.

| What | Where |
|---|---|
| Names, the hero line, the monogram | `couple` |
| The opening film's lines and button | `opening` |
| The muhurtham date, used by the countdown and every calendar file | `wedding` |
| All four events, with venues, times and map queries | `weddingEvents` |
| Portraits and biographies | `people` |
| The six story chapters | `story` |
| The first messages | `firstMessages` |
| Elders' names | `families` |
| Travel notes | `travel` |
| Wishes already received | `wishes` |
| RSVP destination | `rsvpConfig` |
| Photographs | `src/data/gallery.ts` |

### Photographs

Put files in `public/` and point `src` at them (e.g. `'./gallery/first-photo.jpg'`).
With `src: null` a frame renders as an empty album plate — a deliberate
placeholder, not a broken image. **Every plate reserves its space by
aspect ratio before the file loads**, so adding photographs never
shifts the page.

### Music

Drop the file at `public/song.mp3`. It never autoplays: it begins only
after the invitation has been opened by hand, and the audio element is
not constructed until then, so a visitor who never opens the
invitation never downloads it. Set `music.src` to `null` to remove the
control entirely.

### The opening film

By default the opening is played as light — five seconds of a dark room
becoming a lit one. To use a real five-second film instead, put it at
`public/film/opening.mp4` and set `opening.videoSrc` to
`'./film/opening.mp4'`. The lines and the button stay as they are.

## Wiring up the RSVP

Out of the box the reply composes itself and opens WhatsApp, so the
button always does something. To send replies to a Google Sheet
instead:

1. Build a Google Form with the seven fields (first name, last name,
   email, guests, events attending, meal, message).
2. Open the live form, View Source, and search for `entry.` — each
   field has an id like `entry.1234567890`.
3. Put the form id and those seven ids into `rsvpConfig` in
   `src/data/wedding.ts`.

The form then posts into a hidden iframe, so a guest who replies stays
on the invitation instead of being thrown onto a Google confirmation
page.

Also in `rsvpConfig`: `whatsappNumber` (international format, no `+` or
spaces) for the WhatsApp fallback and the wishes box.

## How the motion works

**One scroll listener and one rAF tick for the whole document**
(`src/hooks/scrollEngine.ts`), and zero layout reads inside the frame
loop. Element positions are measured once, cached, and recomputed only
when layout can actually have changed — on resize, on font load, and
when a `content-visibility` subtree starts rendering. Measuring inside
the loop while sibling layers write transforms forces a reflow per
layer per frame, which is what judder actually is.

Everything animated moves `transform` and `opacity` only. Nothing
animates `width`, `height`, `top` or `left`.

Three hooks sit on the engine:

- `useReveal` — viewport arrival. The revealed state is a **class, not a
  running animation**, so a visitor who flings past a section lands on
  the finished composition instead of catching it mid-flight.
- `useParallax` — writes one transform per element per frame, skips
  off-screen layers entirely, and skips sub-pixel writes.
- `useSceneProgress` — publishes a scene's own progress as
  `--scene-progress` so CSS can drive lighting from it without React
  rendering.

Durations come from four registers in `tokens.css` and every animation
belongs to exactly one: `--d-instant` (buttons), `--d-quick` (cards),
`--d-base`/`--d-slow` (section reveals), `--d-cinematic` (the opening),
`--d-ambient` (light and drift).

## Accessibility

- `prefers-reduced-motion` stills the camera without taking away a
  single composition: reveals land in their final state, the kolam is
  shown complete rather than drawn, the light holds steady instead of
  breathing, and petals are simply not shed.
- Every label is visible; no placeholder is used as a label.
- Form errors sit with the field they belong to and clear as soon as
  the field is corrected.
- Every control is at least 48px on its smallest axis.
- The countdown's ticking figures stay out of the accessibility tree;
  a single polite live region carries the meaning instead.
- Focus is visible everywhere, and the opening film puts focus on its
  one button so a keyboard visitor opens the invitation with one press.

## Fonts

Great Vibes, Cormorant Garamond and Jost are **self-hosted** from
`src/styles/fonts/` (latin and latin-ext subsets only, ~316KB total).
There is no request to Google on the critical path, and therefore no
flash of fallback type.

## Deploying

`npm run build` emits `dist/` with relative asset URLs, so it works
from a domain root or any subpath — GitHub Pages, Netlify, Vercel,
S3, or a folder on a web host.
