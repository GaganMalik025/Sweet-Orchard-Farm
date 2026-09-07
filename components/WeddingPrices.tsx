import { rupees } from "@/lib/menu";
import { WEDDING_INCLUDED, WEDDING_TIERS } from "@/lib/pricing";

/**
 * Flat event prices. Deliberately styled unlike everything above it — large
 * tiles, a "flat" label on every figure, and no dot leaders — because the
 * rest of this section is per head and these must not be read that way.
 */
export function WeddingPrices() {
  return (
    <div className="mt-14 border-t border-ink/12 pt-10">
      <h3 className="font-display text-[clamp(1.4rem,3.5vw,1.9rem)] leading-tight">
        Special wedding prices
      </h3>
      <p className="mb-8 mt-1.5 max-w-prose text-[15px] leading-relaxed opacity-70">
        Booking the farm for a wedding is priced for the whole event, by the
        size of the guest list.
      </p>

      <div className="grid gap-5 sm:grid-cols-2 lg:max-w-3xl">
        {WEDDING_TIERS.map((t) => (
          <div
            key={t.range}
            className="rounded-sm border-2 border-ink/20 bg-ink/[0.03] p-6"
          >
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] opacity-65">
              {t.range}
            </p>
            <p className="tnum mt-3 font-display text-[clamp(2rem,6vw,2.6rem)] leading-none">
              {rupees(t.price)}
            </p>
            <p className="mt-2.5 inline-block rounded-full border border-ink/25 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">
              Flat price for the event
            </p>
            <p className="mt-2 text-[13px] opacity-60">Not per head.</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:max-w-3xl">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] opacity-60">
            Included in the price
          </p>
          <ul className="mt-2.5 space-y-1.5">
            {WEDDING_INCLUDED.map((item) => (
              <li key={item} className="flex items-baseline gap-2.5 text-[16px]">
                <span
                  aria-hidden
                  className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] opacity-60">
            Not included
          </p>
          <p className="mt-2.5 border-l-2 border-terracotta/60 pl-4 text-[16px] leading-relaxed">
            <strong className="font-semibold">Food is not included</strong> in the
            wedding price. Meals and snacks are charged separately, at the
            per-head rates above.
          </p>
        </div>
      </div>
    </div>
  );
}
