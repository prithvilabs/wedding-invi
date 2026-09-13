/* =============================================================
   CONTENT
   Everything a family member might want to change lives here.
   No component hardcodes a name, date, venue or message.

   Anything still unknown is an explicit placeholder — please
   replace the text, not the shape.
   ============================================================= */

export const couple = {
  one: 'Prithvi Raj',
  two: 'Harshini',
  ampersand: '&',
  monogram: 'P & H',
  togetherWith: 'Together with their families',
  /* Shown on the hero, above the names. */
  headline: 'We’re getting married',
} as const;

/* ---------- The opening film ----------
   Four lines, revealed one at a time over roughly five seconds,
   then the button. `videoSrc` is here so a real 5-second film can
   be dropped in later without touching a component: put the file
   at public/film/opening.mp4 and point this at it. Until then the
   opening is played as light. */
export const opening = {
  videoSrc: null as string | null,
  poster: null as string | null,
  lines: ['With all our hearts', 'You are invited', 'to celebrate with us'],
  date: '28 · 01 · 2027',
  cta: 'Open invitation',
} as const;

/* ---------- The ceremony ----------
   The wedding muhurtham is the anchor for the countdown and for
   every calendar file the site generates. Times are IST. */
export const wedding = {
  dateISO: '2027-01-28',
  /* Local start/end, used for the calendar files. */
  startsAt: '2027-01-28T09:00:00+05:30',
  endsAt: '2027-01-28T10:30:00+05:30',
  dateDisplay: '28 January 2027',
  dateLong: 'Thursday, 28th January · 2027 · Chennai',
  city: 'Chennai',
} as const;

export type WeddingEvent = {
  id: string;
  /** e.g. 'Reception' — the ceremonial name, set in script. */
  name: string;
  /** e.g. 'Pre wedding' — the small line above it. */
  kind: string;
  note: string;
  day: string;
  dateDisplay: string;
  dateISO: string;
  startsAt: string;
  endsAt: string;
  timeDisplay: string;
  venue: string;
  city: string;
  /** Free-text search used for the map link — a place name, not a URL. */
  mapQuery: string;
  /** Which light the card is cut from. */
  tone: 'night' | 'kumkum' | 'brass' | 'leaf';
};

export const weddingEvents: readonly WeddingEvent[] = [
  {
    id: 'reception-pre',
    name: 'Reception',
    kind: 'Pre wedding',
    note: 'An evening of celebration, music and blessings.',
    day: 'Wednesday',
    dateDisplay: '27 January 2027',
    dateISO: '2027-01-27',
    startsAt: '2027-01-27T19:00:00+05:30',
    endsAt: '2027-01-27T22:00:00+05:30',
    timeDisplay: '7:00 PM',
    venue: 'Vijay Raja Mahal',
    city: 'Chennai',
    mapQuery: 'Vijay Raja Mahal, Chennai',
    tone: 'night',
  },
  {
    id: 'muhurtham',
    name: 'Muhurtham',
    kind: 'The wedding',
    note: 'The sacred ceremony, and the exchange of garlands.',
    day: 'Thursday',
    dateDisplay: '28 January 2027',
    dateISO: '2027-01-28',
    startsAt: '2027-01-28T09:00:00+05:30',
    endsAt: '2027-01-28T10:30:00+05:30',
    timeDisplay: '9:00 – 10:30 AM',
    venue: 'Vijay Raja Mahal',
    city: 'Chennai',
    mapQuery: 'Vijay Raja Mahal, Chennai',
    tone: 'kumkum',
  },
  {
    id: 'reception-thanjavur',
    name: 'Reception',
    kind: 'Post wedding · Thanjavur',
    note: 'Lunch with family and friends.',
    day: 'Wednesday',
    dateDisplay: '3 February 2027',
    dateISO: '2027-02-03',
    startsAt: '2027-02-03T13:00:00+05:30',
    endsAt: '2027-02-03T16:00:00+05:30',
    timeDisplay: '1:00 PM · Lunch',
    venue: 'Shri Vaari Sesha Mahal',
    city: 'Thanjavur',
    mapQuery: 'Shri Vaari Sesha Mahal, Thanjavur',
    tone: 'brass',
  },
  {
    id: 'reception-hosur',
    name: 'Reception',
    kind: 'Post wedding · Hosur',
    note: 'Lunch with family and friends.',
    day: 'Sunday',
    dateDisplay: '7 February 2027',
    dateISO: '2027-02-07',
    startsAt: '2027-02-07T13:00:00+05:30',
    endsAt: '2027-02-07T16:00:00+05:30',
    timeDisplay: '1:00 PM · Lunch',
    venue: 'Anand Grand Palace',
    city: 'Hosur',
    mapQuery: 'Anand Grand Palace, Hosur',
    tone: 'leaf',
  },
];

/* ---------- Meet the couple ----------
   `photo` takes a path under /public. With null the frame renders
   as an empty album plate — a deliberate placeholder. */
export const people: ReadonlyArray<{
  id: string;
  role: string;
  name: string;
  line: string;
  photo: string | null;
}> = [
  {
    id: 'groom',
    role: 'The groom',
    name: couple.one,
    line: 'Biography to follow — a line or two in his own words.',
    photo: null,
  },
  {
    id: 'bride',
    role: 'The bride',
    name: couple.two,
    line: 'Biography to follow — a line or two in her own words.',
    photo: null,
  },
];

/* ---------- The story ----------
   Six chapters, each revealed on its own as the visitor scrolls.
   Written as beats rather than prose so any one can be rewritten
   without disturbing the rest. */
export const story: ReadonlyArray<{
  numeral: string;
  eyebrow: string;
  title: string;
  line: string;
}> = [
  {
    numeral: 'I',
    eyebrow: 'Chapter One',
    title: 'The beginning',
    line: 'Two families, one quiet hope, and a conversation that began the way most good ones do — without either of them knowing where it would lead.',
  },
  {
    numeral: 'II',
    eyebrow: 'Chapter Two',
    title: 'Miles apart',
    line: 'Then came the years measured in time zones. Mornings here, evenings there, and a habit of waiting up.',
  },
  {
    numeral: 'III',
    eyebrow: 'Chapter Three',
    title: 'Different skies',
    line: 'Two cities, two calendars, one line of light held open between them every single day.',
  },
  {
    numeral: 'IV',
    eyebrow: 'Chapter Four',
    title: 'Five years',
    line: 'Distance turned out to be a poor argument. It lost, slowly, and then all at once.',
  },
  {
    numeral: 'V',
    eyebrow: 'Chapter Five',
    title: 'Finally home',
    line: 'And so, in January, under jasmine and lamplight, the waiting ends.',
  },
  {
    numeral: 'VI',
    eyebrow: 'Chapter Six',
    title: 'This is the chapter where we stay',
    line: 'Everything after this one, we write together.',
  },
];

/* ---------- Where it all began ----------
   The first few messages, kept as they were. Replace the text
   with the real ones whenever the couple is ready; the shape
   takes any number of lines from either side. */
export const firstMessages = {
  eyebrow: 'Where it all began',
  line: 'A single message started a story neither of them saw coming.',
  thread: [
    { from: 'one' as const, text: 'Hello 🙂' },
    { from: 'two' as const, text: 'Hi' },
    { from: 'one' as const, text: 'How was your day?' },
  ],
  footer: 'and the conversation never really ended.',
};

/* ---------- Families ---------- */
export const families: ReadonlyArray<{
  side: string;
  names: readonly string[];
  note: string;
}> = [
  { side: 'The groom’s family', names: [], note: 'Family names to follow' },
  { side: 'The bride’s family', names: [], note: 'Family names to follow' },
];

export const familiesIntro =
  'A wedding is two families agreeing to become one. With the blessings of our elders, on both sides, we invite you to be present.';

export const noblePresence = {
  title: 'Awaiting your noble presence',
  line: 'Because meeting two souls requires twice the joy — and you.',
} as const;

/* ---------- Travel ---------- */
export const travel: ReadonlyArray<{ key: string; label: string; value: string }> = [
  { key: 'chennai', label: 'Reaching Chennai', value: 'Travel guidance to follow' },
  { key: 'stay', label: 'Where to stay', value: 'Accommodation details to follow' },
  { key: 'around', label: 'Getting around', value: 'Local transport details to follow' },
];

export const travelNote =
  'The wedding and the first reception are both at Vijay Raja Mahal in Chennai. Fuller directions, stay suggestions and timings will be shared here closer to the date.';

/* ---------- Wishes ----------
   Seed the wall with real messages as they arrive. */
export const wishes: ReadonlyArray<{ from: string; text: string }> = [];

export const wishesCopy = {
  eyebrow: 'From our loved ones',
  title: 'Wishes for the couple',
  empty: 'The first wish could be yours.',
} as const;

/* ---------- RSVP ----------
   Submission goes to a Google Form. Fill `formId` and the six
   `entry.*` field ids from the live form (open it, View Source,
   search for `entry.`) and the form posts straight to the sheet.
   While `formId` is null the section still works: the reply is
   composed and handed to WhatsApp instead, so nobody is ever
   shown a button that does nothing. */
export const rsvpConfig = {
  formId: null as string | null,
  fields: {
    firstName: 'entry.000000001',
    lastName: 'entry.000000002',
    email: 'entry.000000003',
    guests: 'entry.000000004',
    events: 'entry.000000005',
    meal: 'entry.000000006',
    message: 'entry.000000007',
  },
  /* International format, no spaces or +. Used for the WhatsApp
     fallback and for the "message us" link. */
  whatsappNumber: null as string | null,
  /* Used if neither of the above is configured. */
  email: null as string | null,
} as const;

export const rsvp = {
  eyebrow: 'Your presence',
  title: 'Kindly reply',
  line: 'Let us know you are coming, so we can keep a seat — and a meal — for you.',
  buttonLabel: 'Send RSVP',
  mealOptions: ['Vegetarian', 'Jain', 'No preference'],
  maxGuests: 10,
} as const;

/* ---------- Gifts ---------- */
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
  { id: 'story', label: 'Our story' },
  { id: 'events', label: 'Events' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'rsvp', label: 'RSVP' },
];

/* ---------- Music ----------
   Never autoplays. Drop the file at public/song.mp3 — it begins
   only once the invitation has been opened by hand. */
export const music: { src: string | null; title: string } = {
  src: './song.mp3',
  title: 'Nadaswaram',
};
