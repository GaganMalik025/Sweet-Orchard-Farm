import { PER_HEAD, STAY_PER_HEAD, rupees } from "@/lib/menu";

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
  parts: { label: string; amount: number }[];
}

const EXAMPLES: Example[] = [
  {
    title: "Twelve of you, no food",
    people: 12,
    parts: [{ label: "Stay", amount: STAY_PER_HEAD }],
  },
  {
    title: "Ten of you, breakfast and dinner",
    people: 10,
    parts: [
      { label: "Stay", amount: STAY_PER_HEAD },
      { label: "Breakfast", amount: PER_HEAD.breakfast },
      { label: "Dinner", amount: PER_HEAD.dinner },
    ],
  },
];

export function Rates() {
  return (
    <section id="rates" aria-labelledby="rates-title" className="bg-ground-morning">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
        <h2
          id="rates-title"
          className="font-display text-[clamp(1.8rem,5vw,2.8rem)] leading-tight"
        >
          What it costs
        </h2>
        <p className="mb-10 mt-2 max-w-prose text-[1.02rem] leading-relaxed opacity-75">
          Everything is charged per head, and meals are added on to the stay —
          so you only pay for the ones you want.
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
                    <span className="block text-[13px] opacity-55">{l.note}</span>
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
                const perHead = ex.parts.reduce((sum, p) => sum + p.amount, 0);
                const total = perHead * ex.people;
                return (
                  <figure
                    key={ex.title}
                    className="flex flex-col rounded-sm border border-ink/15 p-5"
                  >
                    <figcaption className="mb-4 text-[15px] font-medium leading-snug">
                      {ex.title}
                    </figcaption>

                    <dl className="space-y-1.5">
                      {ex.parts.map((p) => (
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
                        {rupees(perHead)}
                      </span>
                    </div>

                    <p className="tnum mt-4 text-[14px] opacity-70">
                      {rupees(perHead)} × {ex.people} {ex.people === 1 ? "person" : "people"}
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
      </div>
    </section>
  );
}
