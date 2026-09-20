/* =============================================================
   CONTENT
   Everything a family member might want to change lives here.
   No component hardcodes a name, date or venue.

   CONFIRMED facts are marked. Anything still unknown is an
   explicit placeholder — please replace the text, not the shape.
   ============================================================= */

export const couple = {
  /* CONFIRMED */
  one: 'Prithvi Raj',
  two: 'Harshini',
  ampersand: '&',
  monogram: 'P & H',
  togetherWith: 'Together with their families',
} as const;

export const events = {
  /* CONFIRMED: 28 January 2027, Chennai (city confirmed on the printed card;
     venue and muhurtham are still to come). */
  wedding: {
    id: 'wedding',
    label: 'The Wedding',
    dateISO: '2027-01-28',
    dateDisplay: '28 January 2027',
    dateLong: 'Thursday, the twenty-eighth of January, two thousand twenty-seven',
    city: 'Chennai',
    /* Not yet confirmed — keep exactly as written until the family says otherwise. */
    detailsPlaceholder: 'Wedding details to follow',
  },
  /* CONFIRMED: 7 February 2027, Anand Grand Palace, Hosur */
  reception: {
    id: 'reception',
    label: 'The Reception',
    dateISO: '2027-02-07',
    dateDisplay: '7 February 2027',
    dateLong: 'Sunday, the seventh of February, two thousand twenty-seven',
    venue: 'Anand Grand Palace',
    city: 'Hosur',
    detailsPlaceholder: 'Reception timings to follow',
  },
} as const;

/* ---------- Story ----------
   Written as a sequence of editorial beats rather than one block of
   prose, so each beat can be re-timed or rewritten on its own.
   These are about the shape of a long-distance courtship in general
   terms — no invented events, places or quotes. */
export const story: ReadonlyArray<{ eyebrow: string; line: string }> = [
  { eyebrow: 'Chapter One', line: 'Two families, one quiet hope, and a conversation that began the way most good ones do — without either of them knowing where it would lead.' },
  { eyebrow: 'Chapter Two', line: 'Then came the years measured in time zones. Mornings here, evenings there, and a habit of waiting up.' },
  { eyebrow: 'Chapter Three', line: 'Distance turned out to be a poor argument. It lost, slowly, and then all at once.' },
  { eyebrow: 'Chapter Four', line: 'And so, in January, under jasmine and lamplight, the waiting ends.' },
];

/* ---------- Families ----------
   Deliberately unnamed. Fill `names` with the elders' names when the
   family confirms them; the layout is built for two to four lines a side. */
export const families: ReadonlyArray<{
  side: string;
  forWhom: string;
  names: readonly string[];
  note: string;
}> = [
  {
    side: 'The family of the groom',
    forWhom: couple.one,
    names: [],
    note: 'Family names to follow',
  },
  {
    side: 'The family of the bride',
    forWhom: couple.two,
    names: [],
    note: 'Family names to follow',
  },
];

export const familiesIntro =
  'A wedding is two families agreeing to become one. With the blessings of our elders, on both sides, we invite you to be present.';

/* ---------- India ↔ USA ---------- */
export const journey = {
  eyebrow: 'Eight thousand miles',
  title: 'Two homes, one hour ahead of the heart',
  origin: { name: 'India', caption: 'Where the lamps were lit' },
  destination: { name: 'USA', caption: 'Where the evenings were long' },
  beats: [
    { key: 'distance', label: 'Distance', line: 'Twelve and a half hours between a good morning and a good night.' },
    { key: 'connection', label: 'Connection', line: 'A line of light, held open, every single day.' },
    { key: 'togetherness', label: 'Togetherness', line: 'Until both ends of it arrived at the same mandapam.' },
  ],
} as const;

/* ---------- Travel ----------
   Placeholders only. Add entries as they are confirmed; the section
   renders however many it is given. */
export const travel: ReadonlyArray<{ key: string; label: string; value: string }> = [
  { key: 'reaching', label: 'Reaching Hosur', value: 'Travel guidance to follow' },
  { key: 'stay', label: 'Where to stay', value: 'Accommodation details to follow' },
  { key: 'getting-around', label: 'Getting around', value: 'Local transport details to follow' },
];

export const travelNote =
  'Hosur sits on the Tamil Nadu–Karnataka border. Fuller directions, stay suggestions and timings will be shared here closer to the date.';

/* ---------- RSVP ----------
   Functional, but honestly scoped: there is no server behind this yet,
   so a reply is saved on the visitor's own device, not sent anywhere.
   `enabled: false` reverts to a plain "opening soon" placeholder
   without touching any component — flip it the day a real endpoint
   exists, or leave it as the family's holding line for now. */
export const rsvp = {
  enabled: true,
  eyebrow: 'Your presence',
  title: 'Kindly reply',
  body: 'A quick way to let us know you’re coming — saved on this device for now, until a proper guest list is ready.',
  disclaimer: 'This reply is stored on your own device only. It is not yet sent to the family — please also confirm with them directly.',
  status: 'RSVP opening soon',
  buttonLabel: 'RSVP',
  submitLabel: 'Send our reply',
  editLabel: 'Change our reply',
  savedTitle: 'Thank you',
  savedBody: 'Your reply has been saved on this device.',
  /** Which events a guest can say yes to. Only confirmed dates appear here. */
  eventOptions: [
    { id: events.wedding.id, label: `${events.wedding.label} — ${events.wedding.dateDisplay}` },
    { id: events.reception.id, label: `${events.reception.label} — ${events.reception.dateDisplay}` },
  ],
  dietOptions: [
    'Traditional South Indian vegetarian',
    'Sattvic (no onion or garlic)',
    'Vegan',
  ],
  storageKey: 'ph-wedding-rsvp',
} as const;

/* ---------- Guestbook ----------
   A wall of blessings, kept on the visitor's own device. Nothing here
   is shared between visitors or sent to the family automatically —
   the component says so plainly, and this note says so too. */
export const guestbook = {
  eyebrow: 'A word for the couple',
  title: 'Leave a blessing',
  placeholder: 'Write a short blessing for Prithvi Raj and Harshini…',
  nameLabel: 'Your name',
  submitLabel: 'Add my blessing',
  disclaimer: 'Blessings are saved on your own device and shown only to you here — not yet shared with other guests or the family.',
  emptyState: 'Be the first to leave a blessing.',
  storageKey: 'ph-wedding-guestbook',
} as const;

/* ---------- Shower Blessings ----------
   A festive moment at the very end: a burst of jasmine, rose and
   marigold — the same flowers the rest of the site is built from,
   not a new decorative element. */
export const showerBlessings = {
  label: 'Shower blessings',
  again: 'Once more',
} as const;

/* ---------- Ceremony timeline ----------
   A quick-reference recap of the two confirmed dates, in the order a
   guest would attend them. This is intentionally NOT a breakdown of
   named Tamil rituals (Nichayathartham, Muhurtham, Sapthapadi, …) —
   nobody has confirmed which of those this couple is holding or when,
   and inventing that schedule would be exactly the fabrication the
   family asked not to happen. Add real ceremony entries here, in this
   same shape, as soon as they're confirmed. */
export type CeremonyEntry = {
  id: string;
  label: string;
  dateISO: string;
  dateDisplay: string;
  place: string;
  detail: string;
};

export const ceremonies: readonly CeremonyEntry[] = [
  {
    id: events.wedding.id,
    label: events.wedding.label,
    dateISO: events.wedding.dateISO,
    dateDisplay: events.wedding.dateDisplay,
    place: events.wedding.city,
    detail: events.wedding.detailsPlaceholder,
  },
  {
    id: events.reception.id,
    label: events.reception.label,
    dateISO: events.reception.dateISO,
    dateDisplay: events.reception.dateDisplay,
    place: `${events.reception.venue}, ${events.reception.city}`,
    detail: events.reception.detailsPlaceholder,
  },
];

export const ceremoniesNote =
  'Further rituals, if any, will be added here once the family confirms them.';

/* ---------- Gifts ----------
   The couple's own words, from the printed invitation. Set `show` to
   false to drop the note without deleting it. */
export const gifts = {
  show: true,
  note: 'We didn’t register for gifts, but if you’re feeling generous, our bank account is always open!',
} as const;

export const finale = {
  eyebrow: 'And so, with joy',
  closing: 'We would be honoured by your presence and blessings.',
} as const;

/* ---------- Navigation ---------- */
export const navLinks: ReadonlyArray<{ id: string; label: string }> = [
  { id: 'hero', label: 'Home' },
  { id: 'story', label: 'Story' },
  { id: 'families', label: 'Families' },
  { id: 'ceremonies', label: 'Dates' },
  { id: 'wedding', label: 'Wedding' },
  { id: 'travel', label: 'Travel' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'rsvp', label: 'RSVP' },
];

/* ---------- Music ----------
   Never autoplays. Drop a file at public/music/ and point `src` at it;
   if `src` is null the control hides itself entirely. */
export const music: { src: string | null; title: string } = {
  src: null,
  title: 'Nadaswaram',
};
