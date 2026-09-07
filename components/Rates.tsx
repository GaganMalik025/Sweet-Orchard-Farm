import { PER_HEAD, STAY_PER_HEAD, rupees } from "@/lib/menu";
import { breakdown, perHead, totalFor, type MealSelection } from "@/lib/pricing";
import { CostCalculator } from "@/components/CostCalculator";
import { WeddingPrices } from "@/components/WeddingPrices";

/**
 * Every per-head number in one place, immediately before the enquiry form.
 *
 * The worked examples are computed from the same constants the rest of the
 * site uses, so the arithmetic cannot drift out of sync with the menu.
 *
 * The stay rate is stated as "per head" and nothing more — whether it is per
 * night or per stay has not been confirmed, so the site does not say.
 */

const LINES = [
  { label: "Staying, no food", amount: STAY_PER_HEAD, note: "per head" },
  { label: "Breakfast", amount: PER_HEAD.breakfast, note: "per head · choose any three" },
  { label: "Lunch", amount: PER_HEAD.lunch, note: "per head · set meal" },
  { label: "Dinner", amount: PER_HEAD.dinner, note: "per head · set meal" },
] as const;

interface Example {
  title: string;
  people: number;
  meals: MealSelection;
}

/**
 * Both examples run through the same pricing functions as the calculator
 * below, so the published figures and the interactive ones can never
 * disagree.
 */
const EXAMPLES: Example[] = [
  {
    title: "Twelve of you, no food",
    people: 12,
    meals: { breakfast: false, lunch: false, dinner: false },
  },
  {
    title: "Ten of you, breakfast and dinner",
    people: 10,
    meals: { breakfast: true, lunch: false, dinner: true },
  },
];

export function Rates() {
  return (
    <>
      <p className="mb-10 max-w-prose text-[1.05rem] leading-relaxed">
        First, the numbers — it&rsquo;s the thing everyone asks, so there&rsquo;s
        no sense making you scroll for it. Everything is charged per head, and
        meals are added on to the stay, so you only pay for the ones you want.
      </p>

      <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-16">
          {/* The rate card */}
          <div>
            <ul className="border-y border-ink/12">
              {LINES.map((l) => (
                <li
                  key={l.label}
                  className="flex items-baseline border-b border-ink/10 py-4 last:border-b-0"
                >
                  <span className="min-w-0">
                    <span className="block text-[17px] font-medium">{l.label}</span>
                    <span className="block text-[13px] opacity-70">{l.note}</span>
                  </span>
                  <span aria-hidden className="leader" />
                  <span className="tnum shrink-0 font-display text-[1.5rem] leading-none">
                    {rupees(l.amount)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13px] leading-relaxed opacity-60">
              Snacks and starters are ordered separately, by the plate — those
              prices are in the evening section above.
            </p>
          </div>

          {/* Worked examples */}
          <div>
            <h3 className="mb-5 text-[12px] font-semibold uppercase tracking-[0.18em] opacity-60">
              Two examples
            </h3>
            <div className="grid gap-5 sm:grid-cols-2">
              {EXAMPLES.map((ex) => {
                const lines = breakdown(ex.meals);
                const each = perHead(ex.meals);
                const total = totalFor(ex.people, ex.meals);
                return (
                  <figure
                    key={ex.title}
                    className="flex flex-col rounded-sm border border-ink/15 p-5"
                  >
                    <figcaption className="mb-4 text-[15px] font-medium leading-snug">
                      {ex.title}
                    </figcaption>

                    <dl className="space-y-1.5">
                      {lines.map((p) => (
                        <div key={p.label} className="flex items-baseline">
                          <dt className="text-[15px] opacity-75">{p.label}</dt>
                          <span aria-hidden className="leader" />
                          <dd className="tnum shrink-0 text-[15px]">
                            {rupees(p.amount)}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-3 flex items-baseline border-t border-ink/15 pt-3">
                      <span className="text-[15px] font-medium">Per head</span>
                      <span aria-hidden className="leader" />
                      <span className="tnum shrink-0 text-[15px] font-semibold">
                        {rupees(each)}
                      </span>
                    </div>

                    <p className="tnum mt-4 text-[14px] opacity-70">
                      {rupees(each)} × {ex.people} {ex.people === 1 ? "person" : "people"}
                    </p>
                    <p className="tnum mt-1 font-display text-[1.9rem] leading-none">
                      {rupees(total)}
                    </p>
                  </figure>
                );
              })}
            </div>
            <p className="mt-5 max-w-prose text-[13px] leading-relaxed opacity-60">
              Work out your own the same way: add up the per-head lines you
              want, then multiply by the size of your group.
            </p>
        </div>
      </div>

      <CostCalculator />
      <WeddingPrices />
    </>
  );
}
