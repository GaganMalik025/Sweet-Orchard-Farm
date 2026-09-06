import { DINNER_CATEGORIES, DINNER_INCLUDED, PER_HEAD, rupees } from "@/lib/menu";

/**
 * Dinner is a set, not a buffet: one from each category. The included roti
 * is rendered differently from the choices, because it isn't one.
 */
export function ChooseOneSet() {
  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="tnum font-display text-[2rem] leading-none">
          {rupees(PER_HEAD.dinner)}
        </span>
        <span className="text-[14px] uppercase tracking-[0.14em] opacity-55">
          per head · choose one from each
        </span>
      </p>

      <div className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2">
        {DINNER_CATEGORIES.map((cat) => (
          <div key={cat.category}>
            <h3 className="mb-2.5 border-b border-current/20 pb-1.5 text-[12px] font-semibold uppercase tracking-[0.18em] opacity-60">
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
          <h3 className="mb-2.5 border-b border-current/20 pb-1.5 text-[12px] font-semibold uppercase tracking-[0.18em] opacity-60">
            Breads
          </h3>
          <p className="text-[17px] leading-snug">
            {DINNER_INCLUDED}
            <span className="ml-2 text-[13px] opacity-60">
              included — not a choice
            </span>
          </p>
        </div>
      </div>

      <p className="mt-8 max-w-prose border-l-2 border-current/25 pl-4 text-[13px] leading-relaxed opacity-60">
        On the printed card the raita sits on the breakfast page. It belongs to
        this set — pick one with dinner.
      </p>
    </div>
  );
}
