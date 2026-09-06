"use client";

import { useState } from "react";
import { useClock } from "./ClockProvider";

/**
 * "Right now at the farm". Always IST. If the visitor is not on IST we say
 * so plainly and show their own clock alongside, so nobody has to work out
 * the difference themselves.
 */
export function NowPill({ compact = false }: { compact?: boolean }) {
  const clock = useClock();
  const [open, setOpen] = useState(false);

  if (compact) {
    return (
      <div className="flex flex-col">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center gap-2 px-4 py-2.5 text-left"
        >
          <Dot active={clock.active} ready={clock.ready} />
          <span className="tnum text-[13px] font-medium tracking-tight">
            {clock.ready ? `${clock.istLabel} IST` : "Farm time"}
          </span>
          <span className="min-w-0 flex-1 truncate text-[13px] opacity-70">
            {clock.status}
          </span>
          {clock.viewerLabel && (
            <span aria-hidden className="text-[11px] opacity-50">
              {open ? "▲" : "▼"}
            </span>
          )}
        </button>
        {open && clock.viewerLabel && (
          <p className="px-4 pb-2.5 text-[12px] leading-snug opacity-70">
            All times on this page are IST. That&rsquo;s{" "}
            <span className="tnum font-medium">{clock.viewerLabel}</span> where you are.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex max-w-full flex-col gap-1.5">
      <div className="inline-flex items-center gap-2.5 rounded-full border border-current/15 bg-white/55 px-4 py-2 backdrop-blur-sm">
        <Dot active={clock.active} ready={clock.ready} />
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-55">
          Right now at the farm
        </span>
        <span className="tnum text-[15px] font-semibold">
          {clock.ready ? `${clock.istLabel} IST` : "—"}
        </span>
      </div>
      <p className="pl-1 text-[15px] leading-snug">{clock.status}</p>
      {clock.viewerLabel && (
        <p className="pl-1 text-[13px] opacity-65">
          All times are IST. That&rsquo;s{" "}
          <span className="tnum font-medium">{clock.viewerLabel}</span> where you are.
        </p>
      )}
    </div>
  );
}

function Dot({ active, ready }: { active: boolean; ready: boolean }) {
  return (
    <span
      aria-hidden
      className={[
        "h-2 w-2 shrink-0 rounded-full",
        !ready
          ? "bg-current opacity-25"
          : active
            ? "bg-terracotta"
            : "border border-current/50 bg-transparent",
      ].join(" ")}
      style={ready && active ? { animation: "sof-pulse 2.8s ease-out infinite" } : undefined}
    />
  );
}
