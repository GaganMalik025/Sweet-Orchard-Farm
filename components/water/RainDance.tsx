"use client";

import { useEffect, useMemo, useState } from "react";

/** Seeded so the drop field is stable between renders. */
function drops(count: number) {
  let seed = 20250906;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  return Array.from({ length: count }, () => ({
    left: rand() * 100,
    delay: rand() * 1.6,
    duration: 0.85 + rand() * 0.75,
    height: 14 + rand() * 26,
    opacity: 0.25 + rand() * 0.45,
  }));
}

/**
 * The rain dance: sprinklers overhead, guests underneath. There are no fixed
 * hours for it — guests use it whenever they like — so this is a control the
 * visitor operates, not a schedule they read.
 *
 * The strongest thing on the page that needs no photograph.
 */
export function RainDance() {
  const [on, setOn] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const [small, setSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setSmall(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const field = useMemo(() => drops(small ? 34 : 80), [small]);

  return (
    <div
      className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-ink/10 transition-colors duration-700"
      style={{ background: on ? "#c3d3d0" : "#e3e0d6" }}
    >
      {/* Sprinkler line along the top edge */}
      <div className="absolute inset-x-0 top-0 z-20">
        <div
          className="h-[3px] w-full"
          style={{ background: "var(--color-neem)", opacity: 0.75 }}
        />
        <div className="flex justify-around px-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <span
              key={i}
              aria-hidden
              className="block h-2 w-1.5 rounded-b-full transition-colors duration-500"
              style={{ background: on ? "var(--color-tubewell)" : "var(--color-neem)" }}
            />
          ))}
        </div>
      </div>

      {/* Rain */}
      {on && (
        <div aria-hidden className="absolute inset-0 z-10">
          {field.map((d, i) => (
            <span
              key={i}
              className="absolute top-0 w-px rounded-full"
              style={{
                left: `${d.left}%`,
                height: `${d.height}px`,
                background:
                  "linear-gradient(180deg, transparent, var(--color-tubewell-light))",
                opacity: d.opacity,
                animation: reduced
                  ? undefined
                  : `sof-fall ${d.duration}s linear ${d.delay}s infinite`,
                transform: reduced ? `translateY(${(i % 9) * 11}vh)` : undefined,
              }}
            />
          ))}
        </div>
      )}

      {/* Wet ground */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 h-10 transition-opacity duration-700"
        style={{
          opacity: on ? 0.9 : 0,
          background:
            "linear-gradient(180deg, transparent, var(--color-tubewell) 90%)",
        }}
      />

      <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-2 p-4">
        <button
          type="button"
          onClick={() => setOn((v) => !v)}
          aria-pressed={on}
          className="w-full max-w-xs rounded-full px-5 py-3.5 text-[15px] font-semibold transition-colors md:w-auto"
          style={{
            background: on ? "var(--color-ink)" : "var(--color-tubewell)",
            color: "var(--color-paper)",
          }}
        >
          {on ? "Turn the sprinklers off" : "Turn the sprinklers on"}
        </button>
      </div>

      <p className="absolute left-4 top-8 z-30 max-w-[70%] text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/45">
        Rain dance · whenever you like
      </p>
    </div>
  );
}
