import { PER_HEAD, STAY_PER_HEAD } from "./menu";

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

/**
 * What one person costs.
 *
 * The stay charge is ALWAYS included — it is the base, not an alternative to
 * eating. Meals are added on top of it, in any combination or none at all.
 */
export function perHead(meals: MealSelection): number {
  return (
    STAY_PER_HEAD +
    (meals.breakfast ? PER_HEAD.breakfast : 0) +
    (meals.lunch ? PER_HEAD.lunch : 0) +
    (meals.dinner ? PER_HEAD.dinner : 0)
  );
}

export function totalFor(people: number, meals: MealSelection): number {
  return people * perHead(meals);
}

/** The per-head build-up, for showing the working rather than just a total. */
export function breakdown(
  meals: MealSelection,
): { label: string; amount: number }[] {
  const lines = [{ label: "Stay", amount: STAY_PER_HEAD }];
  if (meals.breakfast) lines.push({ label: "Breakfast", amount: PER_HEAD.breakfast });
  if (meals.lunch) lines.push({ label: "Lunch", amount: PER_HEAD.lunch });
  if (meals.dinner) lines.push({ label: "Dinner", amount: PER_HEAD.dinner });
  return lines;
}

/** Flat event prices — not per head. Food is not included. */
export const WEDDING_TIERS = [
  { range: "Up to 50 guests", price: 30000 },
  { range: "51 – 80 guests", price: 35000 },
] as const;

export const WEDDING_INCLUDED = [
  "All rooms",
  "The lawn",
  "The pool",
  "The rain dance",
] as const;
