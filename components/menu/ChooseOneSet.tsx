import { SET_MEAL_CATEGORIES, SET_MEAL_INCLUDED, rupees } from "@/lib/menu";

/**
 * The set meal: one choice from each category, not a buffet. The included
 * roti is rendered differently from the choices, because it isn't one.
 *
 * Lunch and dinner serve the identical menu, so both render this same
 * component — only the per-head rate differs. `idPrefix` keeps the category
 * headings addressable when two instances sit on the same page.
 */
export function ChooseOneSet({
  price,
  idPrefix,
}: {
  price: number;
  idPrefix: string;
}) {
  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="tnum font-display text-[2rem] leading-none">
          {rupees(price)}
        </span>
        <span className="text-[14px] uppercase tracking-[0.14em] opacity-70">
          per head · choose one from each
        </span>
      </p>

      <div className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2">
        {SET_MEAL_CATEGORIES.map((cat) => (
          <div key={cat.category}>
            <h3
              id={`${idPrefix}-${cat.category.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              className="mb-2.5 border-b border-current/20 pb-1.5 text-[12px] font-semibold uppercase tracking-[0.18em] opacity-60"
            >
              {cat.category}
              <span className="ml-2 font-normal normal-case tracking-normal opacity-70">
                choose any one
              </span>
            </h3>
            <ul className="space-y-1.5">
              {cat.options.map((o) => (
                <li key={o} className="text-[17px] leading-snug">
                  {o}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3
            id={`${idPrefix}-breads`}
            className="mb-2.5 border-b border-current/20 pb-1.5 text-[12px] font-semibold uppercase tracking-[0.18em] opacity-60"
          >
            Breads
          </h3>
          <p className="text-[17px] leading-snug">
            {SET_MEAL_INCLUDED}
            <span className="ml-2 text-[13px] opacity-60">
              included — not a choice
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
