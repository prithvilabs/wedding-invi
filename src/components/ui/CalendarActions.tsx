import { downloadIcs, googleCalendarUrl, type CalendarEvent } from '../../utils/calendar';

/**
 * "Add to calendar", the two ways a guest actually uses it: a Google
 * Calendar link that opens in a new tab, and a .ics download for
 * every other calendar app. Both are built from the same event data
 * passed in — nothing here invents a time or a place.
 */
export function CalendarActions({ event, filename }: { event: CalendarEvent; filename: string }) {
  return (
    <div className="calendar-actions">
      <a
        className="calendar-actions__link"
        href={googleCalendarUrl(event)}
        target="_blank"
        rel="noopener noreferrer"
      >
        Add to Google Calendar
      </a>
      <button
        type="button"
        className="calendar-actions__link"
        onClick={() => downloadIcs(event, filename)}
      >
        Download .ics
      </button>
    </div>
  );
}
