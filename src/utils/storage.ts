/* =============================================================
   LOCAL STORAGE
   A small typed wrapper — nothing here is a database. Everything it
   holds lives on one visitor's own device, in one browser, until they
   clear their data. RSVP and Guestbook use it, and both say so in
   their own copy; this file exists so the mechanics are written once.
   ============================================================= */

export function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    // Private browsing, storage disabled, or corrupt JSON — fail quiet.
    return fallback;
  }
}

export function writeLocal<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
