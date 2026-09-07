import { BREAKFAST_CHOICES, PER_HEAD, rupees } from "@/lib/menu";

/** Breakfast: ₹350 per head, choose any three. Quantity rules are the point. */
export function ChooseThree() {
  return (
    <div>
      <PriceLine amount={PER_HEAD.breakfast} note="choose any three" />
      <ul className="mt-6 divide-y divide-current/12 border-y border-current/12">
        {BREAKFAST_CHOICES.map((item) => (
          <li key={item.name} className="flex items-baseline gap-4 py-4">
            <span
              aria-hidden
              className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta"
            />
            <div className="min-w-0">
              <p className="text-[17px] font-medium md:text-[18px]">{item.name}</p>
              <p className="tnum mt-0.5 text-[13px] opacity-60">{item.rule}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PriceLine({ amount, note }: { amount: number; note: string }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="tnum font-display text-[2rem] leading-none">
        {rupees(amount)}
      </span>
      <span className="text-[14px] uppercase tracking-[0.14em] opacity-70">
        per head · {note}
      </span>
    </p>
  );
}
