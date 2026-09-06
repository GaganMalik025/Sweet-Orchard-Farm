/**
 * Menu data transcribed from Sweet-Orchard-Farm-Menu-A4-Print.pdf.
 * Nothing here is invented. If the printed card changes, change it here.
 */

export const PER_HEAD = {
  breakfast: 350,
  lunch: 500,
  dinner: 500,
} as const;

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
 * Dinner: ₹500 per head, choose one from each category.
 * Raita is printed on the breakfast page of the card but reads as part of
 * this set — confirmed with the owner, it belongs here.
 */
export const DINNER_CATEGORIES = [
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
export const DINNER_INCLUDED = "Tawa Roti";

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

export const rupees = (n: number) => `₹${n}`;
