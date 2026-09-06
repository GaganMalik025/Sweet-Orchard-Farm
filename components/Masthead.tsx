import { NowPill } from "@/components/clock/NowPill";
import { ADDRESS_LINE, FARM_NAME, PHONE_DISPLAY, PHONE_TEL } from "@/lib/constants";

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
          private pool filled from our own tubewell and properly chlorinated, a
          rain dance whenever you want it, and a kitchen that keeps proper
          hours.
        </p>

        <div className="mt-9">
          <NowPill />
        </div>

        {/*
          The hero carries its own call and enquire entry points, in addition
          to the sticky bar — someone who lands here shouldn't have to hunt
          for the number. Both are plain links, so they work with no JS: the
          anchor smooth-scrolls via `scroll-behavior` in globals.css, which
          already yields to prefers-reduced-motion.
        */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${PHONE_TEL}`}
              className="rounded-full bg-terracotta px-6 py-3.5 text-[15px] font-semibold text-paper transition-opacity hover:opacity-90"
            >
              Call now
            </a>
            <a
              href="#enquire"
              className="rounded-full border border-ink/25 px-6 py-3.5 text-[15px] font-semibold transition-colors hover:bg-ink/5"
            >
              Enquire
            </a>
          </div>
          <a
            href={`tel:${PHONE_TEL}`}
            className="tnum text-[1.05rem] font-medium underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink/60"
          >
            {PHONE_DISPLAY}
          </a>
        </div>

        <p className="mt-10 max-w-xl border-l-2 border-terracotta/50 pl-4 text-[15px] leading-relaxed opacity-75">
          Everything below is a day here, in order — from the first paratha at
          eight to the kitchen shutting at half past ten.
        </p>
      </div>
    </header>
  );
}
