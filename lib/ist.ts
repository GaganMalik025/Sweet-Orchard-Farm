/**
 * Everything on this site runs on Indian Standard Time, regardless of where
 * the visitor is. We never read the visitor's clock to decide what is
 * happening at the farm — only to tell them how far off they are.
 */

export const IST_TZ = "Asia/Kolkata";

const istParts = new Intl.DateTimeFormat("en-GB", {
  timeZone: IST_TZ,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** Minutes from midnight IST for a given instant. */
export function istMinutes(now: Date = new Date()): number {
  const parts = istParts.formatToParts(now);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}

const istClock = new Intl.DateTimeFormat("en-IN", {
  timeZone: IST_TZ,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

/** e.g. "4:12 pm" -> "4:12 PM" */
export function istTimeLabel(now: Date = new Date()): string {
  return istClock.format(now).replace(/\s*(am|pm)/i, (_, p) => ` ${p.toUpperCase()}`);
}

export function viewerTimeZone(): string | null {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? null;
  } catch {
    return null;
  }
}

/**
 * True when the visitor's clock already reads IST.
 *
 * Compares the actual UTC offset rather than the timezone identifier: India
 * is served as both "Asia/Kolkata" and the legacy alias "Asia/Calcutta", and
 * an identifier comparison wrongly tells a visitor in Delhi what the time is
 * in Delhi. IST is a fixed +05:30 with no DST, so the offset is exact.
 */
export const IST_OFFSET_MINUTES = 330;

export function viewerMatchesIST(now: Date = new Date()): boolean {
  return -now.getTimezoneOffset() === IST_OFFSET_MINUTES;
}

/** The visitor's own wall-clock time, for the "that's X where you are" line. */
export function viewerTimeLabel(now: Date = new Date()): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(now);
}

/** Today's date in IST as YYYY-MM-DD, for date-input minimums. */
export function istToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: IST_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * "Sat, 12 Sep 2026". Built by hand rather than with Intl: en-IN renders
 * "Sat, 12 Sept, 2026", and that second comma reads badly in a WhatsApp
 * message someone is about to send.
 */
export function formatStayDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(Date.UTC(y, m - 1, d));
  return `${WEEKDAYS[date.getUTCDay()]}, ${d} ${MONTHS[m - 1]} ${y}`;
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = Date.parse(`${checkIn}T00:00:00Z`);
  const b = Date.parse(`${checkOut}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.round((b - a) / 86_400_000);
}
