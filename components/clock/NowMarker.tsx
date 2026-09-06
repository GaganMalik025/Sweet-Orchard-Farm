"use client";

import { useClock } from "./ClockProvider";
import { SEGMENTS } from "@/lib/schedule";

/**
 * The dot on the rail. It lives in the gutter of whichever segment is
 * happening now, positioned proportionally through that segment's window —
 * so at 9:00 AM it sits halfway down Breakfast. Between segments it goes
 * hollow.
 */
export function NowMarker({ segmentId }: { segmentId: string }) {
  const clock = useClock();
  if (!clock.ready || clock.anchor !== segmentId) return null;

  const seg = SEGMENTS.find((s) => s.id === segmentId);
  if (!seg) return null;

  const span = Math.max(1, seg.to - seg.from);
  const pct = Math.min(1, Math.max(0, (clock.minutes - seg.from) / span));

  return (
    <div
      className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 transition-[top] duration-700 ease-out"
      style={{ top: `calc(${(pct * 100).toFixed(2)}% )` }}
    >
      <span
        aria-hidden
        className={[
          "block h-3 w-3 rounded-full border-2 border-terracotta",
          clock.active ? "bg-terracotta" : "bg-transparent",
        ].join(" ")}
        style={clock.active ? { animation: "sof-pulse 2.8s ease-out infinite" } : undefined}
      />
      <span className="sr-only">Now: {clock.status}</span>
    </div>
  );
}
