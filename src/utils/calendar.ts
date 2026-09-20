/* =============================================================
   CALENDAR
   Turns a confirmed event into something a guest can actually save —
   a Google Calendar link, or a downloadable .ics file that opens in
   Apple Calendar, Outlook, or anything else that reads RFC 5545.

   Pure functions: no DOM, no fabricated wedding information. Every
   value comes in as an argument from src/data/wedding.ts.
   ============================================================= */

export type CalendarEvent = {
  title: string;
  /** ISO date, e.g. '2027-01-28'. All-day event — no invented time. */
  dateISO: string;
  location?: string;
  description?: string;
};

/** YYYYMMDD, the all-day date format RFC 5545 expects. */
function toIcsDate(iso: string): string {
  return iso.split('-').join('');
}

/** The day after, for an all-day event's exclusive DTEND. */
function nextDayIcs(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return toIcsDate(d.toISOString().slice(0, 10));
}

function escapeIcsText(text: string): string {
  return text.replace(/[\\;,]/g, (m) => `\\${m}`).replace(/\n/g, '\\n');
}

function foldLine(line: string): string {
  // RFC 5545 §3.1: lines over 75 octets fold onto a continuation line
  // that starts with a single space. Long descriptions need this or
  // some calendar apps truncate or reject the file outright.
  if (line.length <= 75) return line;
  let out = '';
  let rest = line;
  while (rest.length > 75) {
    out += rest.slice(0, 75) + '\r\n ';
    rest = rest.slice(75);
  }
  return out + rest;
}

let uidCounter = 0;

/** A single VCALENDAR/VEVENT document, ready to write to a .ics file. */
export function buildIcs(event: CalendarEvent): string {
  const dtStart = toIcsDate(event.dateISO);
  const dtEnd = nextDayIcs(event.dateISO);
  const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  uidCounter += 1;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Prithvi Raj & Harshini//Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${dtStart}-${uidCounter}@prithviraj-harshini.wedding`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${dtStart}`,
    `DTEND;VALUE=DATE:${dtEnd}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
  ];
  if (event.location) lines.push(`LOCATION:${escapeIcsText(event.location)}`);
  if (event.description) lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`);
  lines.push('END:VEVENT', 'END:VCALENDAR');

  return lines.map(foldLine).join('\r\n') + '\r\n';
}

/** Triggers a browser download of the event as a .ics file. */
export function downloadIcs(event: CalendarEvent, filename: string): void {
  const blob = new Blob([buildIcs(event)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Give the browser a moment to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** A Google Calendar "quick add event" link — opens in a new tab. */
export function googleCalendarUrl(event: CalendarEvent): string {
  const start = toIcsDate(event.dateISO);
  const end = nextDayIcs(event.dateISO);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${start}/${end}`,
  });
  if (event.location) params.set('location', event.location);
  if (event.description) params.set('details', event.description);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
