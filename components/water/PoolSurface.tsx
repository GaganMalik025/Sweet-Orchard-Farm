"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The pool is filled from the farm's own tubewell, so the water rises into
 * the frame from below — which is literally where it comes from. This is one
 * of only two places on the site the reserved water teal is allowed to
 * appear (the rain dance is the other).
 *
 * Works with no photograph at all.
 */
export function PoolSurface() {
  const ref = useRef<HTMLDivElement>(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFilled(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-ink/10 bg-[#dfe7e4]"
    >
      {/* Water body, rising from below the frame */}
      <div
        className="absolute inset-x-0 bottom-0 h-full transition-transform duration-[2200ms] ease-out"
        style={{ transform: filled ? "translateY(22%)" : "translateY(100%)" }}
      >
        <svg
          className="absolute inset-x-0 top-0 h-8 w-[200%] md:h-10"
          viewBox="0 0 800 40"
          preserveAspectRatio="none"
          aria-hidden
          style={{ animation: "sof-drift 9s ease-in-out infinite" }}
        >
          <path
            d="M0,22 C100,6 180,34 280,22 C380,10 460,34 560,22 C660,10 740,30 800,20 L800,40 L0,40 Z"
            fill="var(--color-water)"
          />
        </svg>
        <div
          className="absolute inset-x-0 bottom-0 top-7 md:top-9"
          style={{
            background:
              "linear-gradient(180deg, var(--color-water) 0%, var(--color-water-deep) 100%)",
          }}
        />
        <svg
          className="absolute inset-x-0 top-6 h-full w-full opacity-25 md:top-8"
          viewBox="0 0 400 500"
          preserveAspectRatio="none"
          aria-hidden
        >
          {[60, 140, 220, 300, 380].map((y, i) => (
            <path
              key={y}
              d={`M0,${y} C80,${y - 8} 140,${y + 8} 220,${y} C300,${y - 8} 350,${y + 6} 400,${y}`}
              fill="none"
              stroke="#cfe6e3"
              strokeWidth={1.5}
              style={{
                animation: `sof-drift ${7 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </svg>
      </div>

      <p className="absolute left-4 top-4 max-w-[70%] text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/45">
        Tubewell-filled · properly chlorinated
      </p>
    </div>
  );
}
