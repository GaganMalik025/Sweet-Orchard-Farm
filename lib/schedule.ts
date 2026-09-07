/**
 * SOURCE OF TRUTH for the time rail.
 *
 * The rail ticks, the ground colours, the section order and the live clock
 * all derive from what is in this file. Change an hour here and the whole
 * page follows.
 *
 * All times are minutes from midnight, IST. Never local time.
 */

export type SegmentKind = "meal" | "untimed" | "anytime" | "close";

export interface Segment {
  id: string;
  /** Short label on the rail tick. */
  rail: string;
  /** Heading for the content block. */
  title: string;
  /** Human time shown next to the tick, or null when there are no hours. */
  timeLabel: string | null;
  kind: SegmentKind;
  /** Window used to position the segment on the rail, in IST minutes. */
  from: number;
  to: number;
  /** Dark segments flip to paper-on-ink. */
  dark: boolean;
}

const at = (h: number, m = 0) => h * 60 + m;

/**
 * The costs block. It sits on the rail as an untimed marker above the first
 * hour, but it is not part of the day, so it is deliberately kept OUT of
 * SEGMENTS — nothing here can shift the clock, the marker or rail progress.
 * `from`/`to` are unused: no status window ever anchors to this id.
 */
export const COSTS_BLOCK: Segment = {
  id: "rates",
  rail: "—",
  title: "What it costs",
  timeLabel: null,
  kind: "untimed",
  from: at(8),
  to: at(8),
  dark: false,
};

export const SEGMENTS: Segment[] = [
  {
    id: "breakfast",
    rail: "08:00",
    title: "Breakfast",
    timeLabel: "8:00 – 10:00 AM",
    kind: "meal",
    from: at(8),
    to: at(10),
    dark: false,
  },
  {
    id: "arrival",
    rail: "—",
    title: "Getting here",
    timeLabel: null,
    kind: "untimed",
    from: at(10),
    to: at(11, 30),
    dark: false,
  },
  {
    id: "rooms",
    rail: "—",
    title: "The rooms",
    timeLabel: null,
    kind: "untimed",
    from: at(11, 30),
    to: at(13),
    dark: false,
  },
  {
    id: "lunch",
    rail: "13:00",
    title: "Lunch",
    timeLabel: "1:00 – 3:00 PM",
    kind: "meal",
    from: at(13),
    to: at(15),
    dark: false,
  },
  {
    id: "afternoon",
    rail: "—",
    title: "The pool & the rain dance",
    timeLabel: null,
    kind: "anytime",
    from: at(15),
    to: at(18, 30),
    dark: false,
  },
  {
    id: "snacks",
    rail: "18:30",
    title: "Snacks & starters",
    timeLabel: "6:30 – 8:30 PM",
    kind: "meal",
    from: at(18, 30),
    to: at(20, 30),
    dark: false,
  },
  {
    id: "dinner",
    rail: "21:00",
    title: "Dinner",
    timeLabel: "9:00 – 10:30 PM",
    kind: "meal",
    from: at(21),
    to: at(22, 30),
    dark: true,
  },
  {
    id: "night",
    rail: "—",
    title: "The kitchen closes",
    timeLabel: "after 10:30 PM",
    kind: "close",
    from: at(22, 30),
    to: at(24),
    dark: true,
  },
];

/**
 * What the live pill says, minute by minute, across the whole 24 hours.
 * Distinct from SEGMENTS: these windows tile all 1440 minutes with no gaps,
 * so there is always exactly one answer to "what is happening right now".
 */
export interface StatusWindow {
  from: number;
  to: number;
  /** Which rail segment the marker anchors to. */
  anchor: string;
  status: string;
  /** True when the marker sits inside a live segment rather than between. */
  active: boolean;
}

export const STATUS_WINDOWS: StatusWindow[] = [
  {
    from: at(0),
    to: at(8),
    anchor: "breakfast",
    status: "Kitchen closed. Breakfast at 8:00 AM.",
    active: false,
  },
  {
    from: at(8),
    to: at(10),
    anchor: "breakfast",
    status: "Breakfast, until 10:00 AM.",
    active: true,
  },
  {
    from: at(10),
    to: at(13),
    anchor: "arrival",
    status: "Between meals. Lunch at 1:00 PM.",
    active: false,
  },
  {
    from: at(13),
    to: at(15),
    anchor: "lunch",
    status: "Lunch, until 3:00 PM.",
    active: true,
  },
  {
    from: at(15),
    to: at(18, 30),
    anchor: "afternoon",
    status: "Open afternoon. Snacks at 6:30 PM.",
    active: false,
  },
  {
    from: at(18, 30),
    to: at(20, 30),
    anchor: "snacks",
    status: "Snacks & starters, until 8:30 PM.",
    active: true,
  },
  {
    from: at(20, 30),
    to: at(21),
    anchor: "dinner",
    status: "Kitchen changing over. Dinner at 9:00 PM.",
    active: false,
  },
  {
    from: at(21),
    to: at(22, 30),
    anchor: "dinner",
    status: "Dinner, until 10:30 PM.",
    active: true,
  },
  {
    from: at(22, 30),
    to: at(24),
    anchor: "night",
    status: "Kitchen closed for the night.",
    active: false,
  },
];

/**
 * Calling hours. Outside these, WhatsApp becomes the primary action and the
 * phone drops to a secondary link — we signal etiquette, we don't block it.
 * Runs to the end of dinner service so a guest mid-stay can always ring.
 */
export const CALL_FROM = at(8);
export const CALL_UNTIL = at(22, 30);

export function windowFor(istMinutes: number): StatusWindow {
  const m = ((istMinutes % 1440) + 1440) % 1440;
  return (
    STATUS_WINDOWS.find((w) => m >= w.from && m < w.to) ??
    STATUS_WINDOWS[STATUS_WINDOWS.length - 1]
  );
}

export function isCallingHours(istMinutes: number): boolean {
  const m = ((istMinutes % 1440) + 1440) % 1440;
  return m >= CALL_FROM && m < CALL_UNTIL;
}

/** Vertical position of the marker, 0–1 down the whole rail. */
export function railProgress(istMinutes: number): number {
  const m = ((istMinutes % 1440) + 1440) % 1440;
  const first = SEGMENTS[0].from;
  const last = SEGMENTS[SEGMENTS.length - 1].to;
  if (m <= first) return 0;
  if (m >= last) return 1;
  return (m - first) / (last - first);
}
