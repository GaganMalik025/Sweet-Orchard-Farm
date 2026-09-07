import type { ReactNode } from "react";
import type { Segment } from "@/lib/schedule";
import { NowMarker } from "@/components/clock/NowMarker";

const GROUND: Record<string, string> = {
  rates: "var(--color-ground-dust)",
  breakfast: "var(--color-ground-morning)",
  arrival: "var(--color-ground-dust)",
  rooms: "var(--color-ground-morning)",
  lunch: "var(--color-ground-noon)",
  afternoon: "var(--color-ground-afternoon)",
  snacks: "var(--color-ground-dusk)",
  dinner: "var(--color-ground-dinner)",
  night: "var(--color-ground-night)",
};

/**
 * One hour of the day. Renders its own tick in the left gutter, its ground
 * colour, and the now-marker when the clock says this is the live segment.
 */
export function RailSegment({
  segment,
  children,
}: {
  segment: Segment;
  children: ReactNode;
}) {
  const dark = segment.dark;

  return (
    <section
      id={segment.id}
      aria-labelledby={`${segment.id}-title`}
      className={dark ? "dark-segment text-paper" : "text-ink"}
      style={{
        background: GROUND[segment.id] ?? "var(--color-ground-morning)",
        color: dark ? "var(--color-paper)" : "var(--color-ink)",
      }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[44px_minmax(0,1fr)] px-4 md:grid-cols-[132px_minmax(0,1fr)] md:px-8">
        {/* Gutter: the rail itself */}
        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0"
            style={{ background: "currentColor", opacity: 0.18 }}
          />
          <div className="sticky top-16 pt-10 md:top-24 md:pt-16">
            <div className="relative md:pr-12 md:text-right">
              <span
                aria-hidden
                className="absolute left-1/2 top-[0.55em] h-px w-2 -translate-x-1/2 md:left-auto md:right-6 md:w-3 md:translate-x-1/2"
                style={{ background: "currentColor", opacity: 0.45 }}
              />
              <span
                className="tnum block text-[10px] font-semibold uppercase tracking-[0.12em] opacity-70 [writing-mode:vertical-rl] md:text-[13px] md:tracking-[0.08em] md:[writing-mode:horizontal-tb]"
                aria-hidden={segment.rail === "—"}
              >
                {segment.rail}
              </span>
            </div>
          </div>
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-1/2">
            <div className="relative h-full">
              <NowMarker segmentId={segment.id} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 py-14 pl-4 md:py-24 md:pl-0">{children}</div>
      </div>
    </section>
  );
}

export function SegmentHeading({
  segment,
  kicker,
}: {
  segment: Segment;
  kicker?: string;
}) {
  return (
    <header className="mb-8 md:mb-10">
      {segment.timeLabel ? (
        <p className="tnum mb-2 text-[13px] font-semibold uppercase tracking-[0.16em] opacity-70">
          {segment.timeLabel} IST
        </p>
      ) : kicker ? (
        <p className="mb-2 text-[13px] font-semibold uppercase tracking-[0.16em] opacity-70">
          {kicker}
        </p>
      ) : null}
      <h2
        id={`${segment.id}-title`}
        className="font-display text-[clamp(2rem,6vw,3.4rem)] leading-[1.05] tracking-[-0.02em]"
      >
        {segment.title}
      </h2>
    </header>
  );
}
