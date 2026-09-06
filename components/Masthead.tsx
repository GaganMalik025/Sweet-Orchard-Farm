import { NowPill } from "@/components/clock/NowPill";
import { ADDRESS_LINE, FARM_NAME } from "@/lib/constants";

export function Masthead() {
  return (
    <header className="relative bg-ground-morning">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-20 md:px-8 md:pb-24 md:pt-28">
        <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.2em] opacity-55">
          {ADDRESS_LINE}
        </p>
        <h1 className="font-display text-[clamp(2.6rem,10vw,6.5rem)] leading-[0.92] tracking-[-0.03em]">
          {FARM_NAME}
        </h1>
        <p className="mt-6 max-w-xl text-[clamp(1.05rem,2.4vw,1.3rem)] leading-relaxed">
          A farmhouse in the Aravalli hills, an hour or so out of Gurgaon. A
          private pool fed straight from the tubewell, a rain dance whenever you
          want it, and a kitchen that keeps proper hours.
        </p>

        <div className="mt-9">
          <NowPill />
        </div>

        <p className="mt-10 max-w-xl border-l-2 border-terracotta/50 pl-4 text-[15px] leading-relaxed opacity-75">
          Everything below is a day here, in order — from the first paratha at
          eight to the kitchen shutting at half past ten.
        </p>
      </div>
    </header>
  );
}
