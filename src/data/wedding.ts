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
   Intentionally inert. When the form is ready, replace `status` with
   the live component — the section is built to take one. */
export const rsvp = {
  eyebrow: 'Your presence',
  title: 'Kindly reply',
  body: 'Invitations and a way to reply will be shared here soon. Until then, please keep the dates.',
  status: 'RSVP opening soon',
  buttonLabel: 'RSVP',
} as const;

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
