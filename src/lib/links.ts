import type { WeddingEvent } from '../data/wedding';
import { couple, rsvpConfig } from '../data/wedding';

/* =============================================================
   OUTBOUND LINKS
   Maps, calendars and WhatsApp, built from the event data so a
   changed venue or time updates every link at once.
   ============================================================= */

/** Google Maps search for a place name — resolves on every platform. */
export function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function title(event: WeddingEvent): string {
  return `${couple.one} & ${couple.two} — ${event.name}`;
}

function details(event: WeddingEvent): string {
  return `${event.kind}. ${event.note}`;
}

function where(event: WeddingEvent): string {
  return `${event.venue}, ${event.city}`;
}

/** Google Calendar wants UTC basic format: 20270128T033000Z. */
function utcBasic(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function googleCalendarUrl(event: WeddingEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title(event),
    dates: `${utcBasic(event.startsAt)}/${utcBasic(event.endsAt)}`,
    details: details(event),
    location: where(event),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * An .ics file, built in the browser and handed over as a download.
 * Apple Calendar, Outlook and everything else take this; there is no
 * Apple-specific URL scheme worth relying on.
 */
export function icsFor(event: WeddingEvent): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Prithvi Raj and Harshini//Wedding//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.id}-prithvi-harshini@wedding`,
    `DTSTAMP:${utcBasic(new Date().toISOString())}`,
    `DTSTART:${utcBasic(event.startsAt)}`,
    `DTEND:${utcBasic(event.endsAt)}`,
    `SUMMARY:${escapeIcs(title(event))}`,
    `DESCRIPTION:${escapeIcs(details(event))}`,
    `LOCATION:${escapeIcs(where(event))}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  // RFC 5545 wants CRLF, and some clients genuinely reject LF.
  return lines.join('\r\n');
}

function escapeIcs(value: string): string {
  return value.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
}

/** Triggers the .ics download without leaving the page. */
export function downloadIcs(event: WeddingEvent): void {
  const blob = new Blob([icsFor(event)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.id}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoking immediately can cancel the download in Safari.
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** WhatsApp, with a number if one is configured and the share sheet if not. */
export function whatsappUrl(text: string): string {
  const body = encodeURIComponent(text);
  return rsvpConfig.whatsappNumber
    ? `https://wa.me/${rsvpConfig.whatsappNumber}?text=${body}`
    : `https://wa.me/?text=${body}`;
}

export function shareText(): string {
  return `${couple.one} & ${couple.two} are getting married on 28 January 2027 in Chennai. ${window.location.href}`;
}
