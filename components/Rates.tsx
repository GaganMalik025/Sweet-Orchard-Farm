import { PER_HEAD, rupees } from "@/lib/menu";
import { OCCUPANCY } from "@/lib/constants";
import { STAY_BANDS, bandRange, quote, type MealSelection } from "@/lib/pricing";
import { CostCalculator } from "@/components/CostCalculator";

/**
 * Every rate in one place, first thing after the photos.
 *
 * The stay is stepped by group size, like tax bands, so the rate card shows
 * the bands, the explanation spells out how they stack, and both worked
 * examples show the band-by-band working rather than a bare total. Every
 * figure comes from lib/pricing.ts: the examples call the same `quote()`
 * as the calculator below, so the published and interactive numbers can
 * never disagree.
 *
 * The examples are chosen to teach: one small group inside the first band,
 * one large enough to reach all three, over more than one night, with meals.
 */

const MEAL_LINES = [
  { label: "Breakfast", amount: PER_HEAD.breakfast, note: "per head, per night · choose any three" },
  { label: "Lunch", amount: PER_HEAD.lunch, note: "per head, per night · set meal" },
  { label: "Dinner", amount: PER_HEAD.dinner, note: "per head, per night · set meal" },
] as const;

interface Example {
  title: string;
  people: number;
  nights: number;
  meals: MealSelection;
}

const EXAMPLES: Example[] = [
  {
    title: "Ten of you, one night, no food",
    people: 10,
    nights: 1,
    meals: { breakfast: false, lunch: false, dinner: false },
  },
  {
    title: "Twenty-eight of you, two nights, breakfast and dinner",
    people: 28,
    nights: 2,
    meals: { breakfast: true, lunch: false, dinner: true },
  },
];

const [first, second] = STAY_BANDS;

export function Rates() {
  return (
    <>
      <p className="mb-5 max-w-prose text-[1.05rem] leading-relaxed">
        The stay is charged per person, per night, and it gets cheaper per
        person the bigger your group. It works in steps: the first{" "}
        {first.to} people are {rupees(first.rate)} each, people {first.to + 1}{" "}
        to {second.to} are {rupees(second.rate)} each, and everyone after that
        is {rupees(STAY_BANDS[2].rate)}. Adding someone never makes the total
        go down.
      </p>
      <p className="mb-10 max-w-prose text-[1.05rem] leading-relaxed">
        Meals are added on top, per head, for each night you want them. We
        take groups of up to {OCCUPANCY.maxGroup}.
      </p>

      <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-16">
        {/* The rate card */}
        <div>
          <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] opacity-70">
            The stay, per person, per night
          </h3>
          <ul className="border-y border-ink/12">
            {STAY_BANDS.map((b) => (
              <RateRow
                key={b.from}
                label={`People ${bandRange(b)}`}
                note={
                  b.from === 1
                    ? `each of the first ${b.to} people`
                    : `each person from the ${ordinal(b.from)} to the ${ordinal(b.to)}`
                }
                amount={b.rate}
              />
            ))}
          </ul>

          <h3 className="mb-3 mt-9 text-[12px] font-semibold uppercase tracking-[0.18em] opacity-70">
            Meals, added on
          </h3>
          <ul className="border-y border-ink/12">
            {MEAL_LINES.map((l) => (
              <RateRow key={l.label} label={l.label} note={l.note} amount={l.amount} />
            ))}
          </ul>
          <p className="mt-4 text-[13px] leading-relaxed opacity-70">
            Snacks and starters are ordered separately, by the plate. Those
            prices are in the evening section further down.
          </p>
        </div>

        {/* Worked examples */}
        <div>
          <h3 className="mb-5 text-[12px] font-semibold uppercase tracking-[0.18em] opacity-70">
            Two examples
          </h3>
          <div className="grid gap-5">
            {EXAMPLES.map((ex) => {
              const q = quote(ex.people, ex.nights, ex.meals);
              return (
                <figure
                  key={ex.title}
                  className="flex flex-col rounded-sm border border-ink/15 p-5"
                >
                  <figcaption className="mb-4 text-[15px] font-medium leading-snug">
                    {ex.title}
                  </figcaption>

                  <dl className="space-y-2">
                    {q.lines.map((l) => (
                      <div key={l.label} className="flex items-baseline">
                        <dt className="text-[15px]">
                          <span className="opacity-80">{l.label}</span>
                          <span className="tnum block whitespace-nowrap text-[13px] opacity-70 sm:ml-2 sm:inline">
                            {l.count} × {rupees(l.rate)}
                          </span>
                        </dt>
                        <span aria-hidden className="leader" />
                        <dd className="tnum shrink-0 text-[15px]">{rupees(l.amount)}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-3 flex items-baseline border-t border-ink/15 pt-3">
                    <span className="text-[15px] font-medium">Per night</span>
                    <span aria-hidden className="leader" />
                    <span className="tnum shrink-0 text-[15px] font-semibold">
                      {rupees(q.perNight)}
                    </span>
                  </div>

                  <p className="tnum mt-4 text-[14px] opacity-70">
                    {rupees(q.perNight)} × {q.nights} {q.nights === 1 ? "night" : "nights"}
                  </p>
                  <p className="tnum mt-1 font-display text-[1.9rem] leading-none">
                    {rupees(q.total)}
                  </p>
                </figure>
              );
            })}
          </div>
        </div>
      </div>

      <CostCalculator />
    </>
  );
}

function RateRow({ label, note, amount }: { label: string; note: string; amount: number }) {
  return (
    <li className="flex items-baseline border-b border-ink/10 py-4 last:border-b-0">
      <span className="min-w-0">
        <span className="block text-[17px] font-medium">{label}</span>
        <span className="block text-[13px] opacity-70">{note}</span>
      </span>
      <span aria-hidden className="leader" />
      <span className="tnum shrink-0 font-display text-[1.5rem] leading-none">
        {rupees(amount)}
      </span>
    </li>
  );
}

function ordinal(n: number): string {
  const s = n % 100 >= 11 && n % 100 <= 13 ? "th" : (["th", "st", "nd", "rd"][n % 10] ?? "th");
  return `${n}${s}`;
}
