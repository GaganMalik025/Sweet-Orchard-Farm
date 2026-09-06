/**
 * Menu data transcribed from Sweet-Orchard-Farm-Menu-A4-Print.pdf.
 * Nothing here is invented. If the printed card changes, change it here.
 */

export const PER_HEAD = {
  breakfast: 350,
  lunch: 500,
  dinner: 500,
} as const;

/**
 * Staying without any food.
 *
 * Deliberately not labelled per night or per stay — that hasn't been
 * confirmed, so the site states the rate and nothing more.
 */
export const STAY_PER_HEAD = 1500;

/** Breakfast: ₹350 per head, choose any three. */
export const BREAKFAST_CHOICES = [
  { name: "Bread Toast", rule: "2 toasts per person · extra ₹30 each" },
  {
    name: "Stuffed Paratha or Omelette",
    rule: "2 per person · extra ₹30 each",
  },
  { name: "Plain Curd", rule: "1 bowl per person · extra ₹40 per bowl" },
  { name: "Boiled Egg", rule: "₹10 per egg · add-on, charged extra" },
] as const;

/**
 * The set meal. Lunch and dinner run the identical menu — one choice from
 * each category — at their own per-head rates (both ₹500).
 */
export const SET_MEAL_CATEGORIES = [
  { category: "Dal", options: ["Dal Makhani", "Mix Dal", "Dal Tadka"] },
  { category: "Paneer & Veg", options: ["Kadai Paneer", "Mix Veg"] },
  {
    category: "Chicken",
    options: ["Chicken Curry", "Chicken Masala", "Kadai Chicken"],
  },
  { category: "Rice", options: ["Jeera Rice", "Plain Rice", "Vegetable Pulao"] },
  { category: "Raita", options: ["Boondi Raita", "Mix Raita", "Cucumber Raita"] },
] as const;

/** Given, not chosen. */
export const SET_MEAL_INCLUDED = "Tawa Roti";

/** Snacks & starters: à la carte, per plate. */
export const VEG_SNACKS = [
  { name: "Paneer Tikka", price: 240 },
  { name: "Paneer Chilli", price: 220 },
  { name: "Finger Chips", price: 130 },
  { name: "Sweet Corn", price: 110 },
  { name: "Black Chana Chaat", price: 110 },
  { name: "Peanut Masala", price: 100 },
  { name: "Aloo Pyaz Pakoda", price: 100 },
  { name: "Maggi", price: 50 },
] as const;

export const NONVEG_SNACKS = [
  { name: "Chicken Tikka", price: 290 },
  { name: "Chilli Chicken", price: 280 },
  { name: "Chicken Fry", price: 260 },
  { name: "Chicken Wings", price: 260 },
  { name: "Chicken Pakoda", price: 240 },
] as const;

export const BEVERAGES = [
  { name: "Tea", price: 30 },
  { name: "Coffee", price: 40 },
] as const;

/** The two lines printed at the bottom of the card. */
export const KITCHEN_RULES = [
  "Food will not be served outside the hours mentioned above.",
  "Guests are kindly requested to respect our staff and their timings.",
] as const;

/**
 * Indian digit grouping (last three, then pairs): 1500 -> "1,500",
 * 100000 -> "1,00,000". Written out rather than using toLocaleString so the
 * output is identical on the server and in every browser, regardless of the
 * ICU data available.
 */
export function rupees(n: number): string {
  const s = String(Math.abs(Math.trunc(n)));
  if (s.length <= 3) return `₹${s}`;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `₹${rest},${last3}`;
}
