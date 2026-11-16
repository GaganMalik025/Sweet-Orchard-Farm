"use client";

import { useEffect, useRef, useState } from "react";
import { PER_HEAD, rupees } from "@/lib/menu";
import { OCCUPANCY } from "@/lib/constants";
import { CALC_MAX_NIGHTS, NO_MEALS, quote, type MealSelection, type Quote } from "@/lib/pricing";

interface Result extends Quote {
  /** Bumped on every calculation so the reveal replays. */
  run: number;
}

const MEALS: { key: keyof MealSelection; label: string }[] = [
  { key: "breakfast", label: "Breakfast" },
  { key: "lunch", label: "Lunch" },
  { key: "dinner", label: "Dinner" },
];

type Errors = { people?: string; nights?: string };

/** A whole number from min to max, or null. */
function wholeNumber(raw: string, min: number, max: number): number | null {
  const s = raw.trim();
  if (!/^\d+$/.test(s)) return null;
  const n = Number(s);
  return n >= min && n <= max ? n : null;
}

export function CostCalculator() {
  const [people, setPeople] = useState("");
  const [nights, setNights] = useState("1");
  const [meals, setMeals] = useState<MealSelection>(NO_MEALS);
  const [errors, setErrors] = useState<Errors>({});
  const [result, setResult] = useState<Result | null>(null);
  const runRef = useRef(0);

  function calculate() {
    const p = wholeNumber(people, 1, OCCUPANCY.maxGroup);
    const n = wholeNumber(nights, 1, CALC_MAX_NIGHTS);
    const found: Errors = {};
    if (p === null) {
      found.people = people.trim()
        ? `We take groups of 1 to ${OCCUPANCY.maxGroup}.`
        : "Tell us how many people are coming.";
    }
    if (n === null) {
      found.nights = `Enter a number of nights from 1 to ${CALC_MAX_NIGHTS}.`;
    }
    setErrors(found);
    if (p === null || n === null) {
      setResult(null);
      return;
    }
    runRef.current += 1;
    setResult({ ...quote(p, n, meals), run: runRef.current });
  }

  const onEnter = (e: React.KeyboardEvent) => e.key === "Enter" && calculate();

  return (
    <div className="mt-14 border-t border-ink/12 pt-10">
      <h3 className="font-display text-[clamp(1.4rem,3.5vw,1.9rem)] leading-tight">
        Work out your own
      </h3>
      <p className="mb-8 mt-1.5 max-w-prose text-[15px] leading-relaxed opacity-70">
        The stay is always charged. Tick the meals you want on top of it.
      </p>

      <div className="grid gap-10 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] md:gap-14">
        <div>
          <div className="grid grid-cols-2 gap-4 sm:max-w-80">
            <NumberField
              label="People"
              value={people}
              onChange={(v) => {
                setPeople(v);
                setErrors((e) => ({ ...e, people: undefined }));
              }}
              onKeyDown={onEnter}
              error={errors.people}
              errorId="calc-people-error"
              max={OCCUPANCY.maxGroup}
            />
            <NumberField
              label="Nights"
              value={nights}
              onChange={(v) => {
                setNights(v);
                setErrors((e) => ({ ...e, nights: undefined }));
              }}
              onKeyDown={onEnter}
              error={errors.nights}
              errorId="calc-nights-error"
              max={CALC_MAX_NIGHTS}
            />
          </div>
          {(errors.people || errors.nights) && (
            <div role="alert" className="mt-2 space-y-1 text-[13px] text-terracotta">
              {errors.people && <p id="calc-people-error">{errors.people}</p>}
              {errors.nights && <p id="calc-nights-error">{errors.nights}</p>}
            </div>
          )}

          <fieldset className="mt-7">
            <legend className="mb-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] opacity-70">
              Meals
            </legend>
            <div className="space-y-2">
              {MEALS.map((m) => {
                const on = meals[m.key];
                return (
                  // The real checkbox is sr-only, so its own focus outline is
                  // invisible. The label draws the same outline as the global
                  // :focus-visible rule whenever the checkbox inside it has
                  // keyboard focus (WCAG 2.4.7).
                  <label
                    key={m.key}
                    className={[
                      "flex cursor-pointer items-center gap-3 rounded-sm border px-3.5 py-3 transition-colors",
                      "has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-terracotta",
                      on
                        ? "border-terracotta bg-terracotta/8"
                        : "border-ink/20 hover:bg-ink/4",
                    ].join(" ")}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={(e) =>
                        setMeals((v) => ({ ...v, [m.key]: e.target.checked }))
                      }
                      className="sr-only"
                    />
                    <span
                      aria-hidden
                      className={[
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] border transition-colors",
                        on ? "border-terracotta bg-terracotta" : "border-ink/35",
                      ].join(" ")}
                    >
                      {on && (
                        <svg viewBox="0 0 12 10" className="h-2.5 w-3" aria-hidden>
                          <path
                            d="M1 5.2 4.3 8.5 11 1.5"
                            fill="none"
                            stroke="var(--color-paper)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[16px] font-medium">{m.label}</span>
                      <span className="tnum block text-[13px] opacity-70">
                        {rupees(PER_HEAD[m.key])} per head, per night
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <button
            type="button"
            onClick={calculate}
            className="mt-7 w-full rounded-full bg-terracotta px-7 py-3.5 text-[15px] font-semibold text-paper transition-opacity hover:opacity-90 sm:w-auto"
          >
            Calculate Cost
          </button>
        </div>

        <div className="min-h-[1px]">
          {result ? (
            <ResultRail key={result.run} result={result} />
          ) : (
            <p className="text-[14px] italic opacity-70">
              Your total will appear here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  onKeyDown,
  error,
  errorId,
  max,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  error?: string;
  errorId: string;
  max: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.12em] opacity-70">
        {label}
      </span>
      <input
        type="number"
        min={1}
        max={max}
        step={1}
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="tnum w-full rounded-sm border border-ink/25 bg-transparent px-3.5 py-3 text-[17px] outline-none transition-colors focus:border-terracotta aria-[invalid=true]:border-terracotta"
      />
    </label>
  );
}

/**
 * The reveal. Rather than a spinner or a fade, the result assembles the way
 * the rest of the page reads: a hairline rail draws downward, each line of
 * the working ticks onto it in sequence, and the total lands last and counts
 * up in tabular figures — the same rail-and-marker language as the day above.
 *
 * Terracotta throughout: the reserved water teal never appears outside the
 * pool and the rain dance.
 */
function ResultRail({ result }: { result: Result }) {
  const rows = result.lines.length;
  const STEP = 110;
  const totalDelay = (rows + 1) * STEP;

  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const shown = useCountUp(result.total, totalDelay, reduced);

  const anim = (delay: number, name: string, dur = 420) =>
    reduced
      ? undefined
      : { animation: `${name} ${dur}ms cubic-bezier(.2,.7,.3,1) ${delay}ms both` };

  const nightWord = result.nights === 1 ? "night" : "nights";
  const peopleWord = result.people === 1 ? "person" : "people";

  const summary = [
    ...result.lines.map((l) => `${l.label}: ${l.count} × ${rupees(l.rate)} = ${rupees(l.amount)}`),
    `${rupees(result.perNight)} per night`,
    `Total ${rupees(result.total)} for ${result.people} ${peopleWord}, ${result.nights} ${nightWord}`,
  ].join(". ");

  return (
    <div className="relative pl-7">
      {/*
        The visual total counts up frame by frame, so it must not sit inside
        a live region — announcing it 60 times a second would flood a screen
        reader and thrashes the accessibility tree badly enough to lock the
        renderer. Instead this status fires once per calculation (the parent
        remounts on each run) with the settled figures, and the animating
        number below is hidden from assistive tech.
      */}
      <p role="status" className="sr-only">
        {summary}
      </p>

      {/* the rail */}
      <span
        aria-hidden
        className="absolute bottom-0 left-1.5 top-1 w-px origin-top bg-ink/20"
        style={anim(0, "sof-rail-draw", totalDelay + 220)}
      />

      <ul className="space-y-3">
        {result.lines.map((l, i) => (
          <li
            key={l.label}
            className="relative flex items-baseline"
            style={anim((i + 1) * STEP, "sof-tick-in")}
          >
            <span
              aria-hidden
              className="absolute -left-[22px] top-[0.55em] h-px w-3 bg-ink/35"
            />
            <span className="text-[16px]">
              <span className="opacity-80">{l.label}</span>
              <span className="tnum block whitespace-nowrap text-[13px] opacity-70 sm:ml-2 sm:inline">
                {l.count} × {rupees(l.rate)}
              </span>
            </span>
            <span aria-hidden className="leader" />
            <span className="tnum shrink-0 text-[16px]">{rupees(l.amount)}</span>
          </li>
        ))}
      </ul>

      <div
        className="relative mt-4 flex items-baseline border-t border-ink/15 pt-4"
        style={anim((result.lines.length + 0.5) * STEP, "sof-tick-in")}
      >
        <span className="text-[16px] font-medium">Per night</span>
        <span aria-hidden className="leader" />
        <span className="tnum shrink-0 text-[16px] font-semibold">
          {rupees(result.perNight)}
        </span>
      </div>

      <div className="relative mt-7" style={anim(totalDelay, "sof-total-in", 520)}>
        <span
          aria-hidden
          className="absolute -left-[26px] top-[1.1rem] block h-3 w-3 -translate-y-1/2 rounded-full border-2 border-terracotta bg-terracotta"
          style={reduced ? undefined : { animation: "sof-pulse 2.8s ease-out 1" }}
        />
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-70">
          Total
        </p>
        <p
          aria-hidden="true"
          className="tnum mt-1 font-display text-[clamp(2.2rem,7vw,3.2rem)] leading-none text-terracotta"
        >
          {rupees(shown)}
        </p>
        <p className="tnum mt-2 text-[14px] opacity-70">
          {rupees(result.perNight)} × {result.nights} {nightWord}, for{" "}
          {result.people} {peopleWord}
        </p>
      </div>
    </div>
  );
}

/** Counts to `target` after `delay`, easing out. Skipped under reduced motion. */
function useCountUp(target: number, delay: number, reduced: boolean) {
  const [value, setValue] = useState(reduced ? target : 0);

  useEffect(() => {
    // requestAnimationFrame does not run while the tab is hidden, so a count-up
    // started there would sit at zero. The figure is the whole point of this
    // component; the animation is decoration. Show it outright instead.
    if (reduced || document.visibilityState === "hidden") {
      setValue(target);
      return;
    }

    let raf = 0;
    let start = 0;
    const DUR = 620;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / DUR);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const timer = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);

    // Backstop: land on the exact total even if the frame loop stalls or the
    // tab is backgrounded part-way through.
    const settle = window.setTimeout(() => setValue(target), delay + DUR + 150);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(settle);
      cancelAnimationFrame(raf);
    };
  }, [target, delay, reduced]);

  return value;
}
