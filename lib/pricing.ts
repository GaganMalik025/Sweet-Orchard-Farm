import { PER_HEAD } from "./menu";
import { OCCUPANCY } from "./constants";

/**
 * ALL MONEY ON THE SITE RUNS THROUGH THIS FILE.
 *
 * The rate card, the two worked examples and the calculator all call
 * `quote()` and read these tables, so they cannot disagree. Don't
 * hard-code a rate or a band anywhere else.
 *
 * Owner-confirmed, 16 November 2026:
 *   - The stay is charged per person, per night.
 *   - The rate steps down with group size, like tax bands: the first 12
 *     people are ₹1,250 each, people 13–25 are ₹1,000 each, and everyone
 *     after 25 is ₹500. The bands stack, so adding a person never makes
 *     the total go down.
 *   - Groups of up to OCCUPANCY.maxGroup (30).
 *   - Meals are unchanged (lib/menu.ts) and added per head, once per night
 *     for each meal the group wants.
 *   - There is no longer a wedding price.
 */

export interface MealSelection {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

export const NO_MEALS: MealSelection = {
  breakfast: false,
  lunch: false,
  dinner: false,
};

export interface StayBand {
  /** First person (1-based) this rate applies to. */
  from: number;
  /** Last person it applies to; the final band runs to the group maximum. */
  to: number;
  /** Per person, per night. */
  rate: number;
}

export const STAY_BANDS: readonly StayBand[] = [
  { from: 1, to: 12, rate: 1250 },
  { from: 13, to: 25, rate: 1000 },
  { from: 26, to: OCCUPANCY.maxGroup, rate: 500 },
];

/**
 * Largest number of nights the calculator accepts. An input sanity bound,
 * not a booking rule: the site states no maximum stay.
 */
export const CALC_MAX_NIGHTS = 99;

/** "1–12", "13–25", "26–30". */
export function bandRange(b: StayBand): string {
  return `${b.from}–${b.to}`;
}

export interface QuoteLine {
  /** e.g. "Stay, people 13–25" or "Breakfast". */
  label: string;
  /** How many people this line charges for. */
  count: number;
  /** Per person, per night. */
  rate: number;
  /** count × rate, for one night. */
  amount: number;
}

export interface Quote {
  people: number;
  nights: number;
  /** Everything charged for one night, stay bands first, then meals. */
  lines: QuoteLine[];
  perNight: number;
  total: number;
}

/**
 * The stay for one night, split by band. Only the bands the group reaches
 * appear, each labelled with the people it actually covers: 28 people read
 * "people 1–12", "people 13–25", "people 26–28". A group entirely inside
 * the first band is a single line, labelled just "Stay".
 */
export function stayLines(people: number): QuoteLine[] {
  const lines = STAY_BANDS.flatMap((b) => {
    const last = Math.min(people, b.to);
    const count = Math.max(0, last - (b.from - 1));
    if (!count) return [];
    const who = count === 1 ? `person ${b.from}` : `people ${b.from}–${last}`;
    return [{ label: `Stay, ${who}`, count, rate: b.rate, amount: count * b.rate }];
  });
  if (lines.length === 1) lines[0].label = "Stay";
  return lines;
}

const MEALS: { key: keyof MealSelection; label: string }[] = [
  { key: "breakfast", label: "Breakfast" },
  { key: "lunch", label: "Lunch" },
  { key: "dinner", label: "Dinner" },
];

/** The meals for one night: each ticked meal, for everyone. */
export function mealLines(people: number, meals: MealSelection): QuoteLine[] {
  return MEALS.filter((m) => meals[m.key]).map((m) => ({
    label: m.label,
    count: people,
    rate: PER_HEAD[m.key],
    amount: people * PER_HEAD[m.key],
  }));
}

/** The full working for a stay: per-night lines, the nightly figure, the total. */
export function quote(people: number, nights: number, meals: MealSelection): Quote {
  const lines = [...stayLines(people), ...mealLines(people, meals)];
  const perNight = lines.reduce((sum, l) => sum + l.amount, 0);
  return { people, nights, lines, perNight, total: perNight * nights };
}
