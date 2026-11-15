"use client";

import { useEffect, useRef, useState } from "react";
import { FARM_VIDEO, VIDEO_SCENES } from "@/lib/gallery";
import { photoSrc } from "@/lib/photos";

const stamp = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * The owner's walk-through video with a scene timeline beside it.
 *
 * The timeline borrows the time rail's look (a hairline, ticks, and a
 * terracotta dot on whatever is current) because it does the same job for
 * the video that the rail does for the day. The scene playing now is
 * highlighted, and choosing a scene jumps there and plays. The list doubles
 * as the text alternative for the video, which has no audio.
 *
 * Layout: on laptops the heading and timeline sit in the left column with
 * the video on the right, so the left side is filled rather than holding
 * two lines of text. On phones it stacks heading, video, then timeline.
 *
 * Playback, unchanged from before:
 * - A silent loop (the audio was removed at encode time).
 * - Plays only while at least 30% of it is on screen.
 * - Pause / Play button (WCAG 2.2.2). Once the visitor pauses, scrolling
 *   back doesn't restart it.
 * - prefers-reduced-motion: never starts on its own.
 * - Native controls until hydration, so it plays without JS.
 * - play() from an effect, not the autoplay attribute: React sets `muted`
 *   as a property, so SSR HTML would carry autoplay without muted.
 */
export function Walkthrough() {
  const ref = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [hydrated, setHydrated] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    setHydrated(true);
    v.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      userPaused.current = true;
    }

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => setTime(v.currentTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("timeupdate", onTime);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!userPaused.current) v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(v);

    return () => {
      io.disconnect();
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("timeupdate", onTime);
    };
  }, []);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  }

  function jump(start: number) {
    const v = ref.current;
    if (!v) return;
    v.currentTime = start;
    setTime(start);
    userPaused.current = false;
    v.play().catch(() => {});
  }

  let current = 0;
  VIDEO_SCENES.forEach((s, i) => {
    if (time >= s.start) current = i;
  });

  return (
    <div className="grid gap-x-16 gap-y-10 md:grid-cols-[minmax(0,1fr)_auto] md:grid-rows-[auto_1fr] md:items-center">
      <div className="max-w-prose md:self-end">
        <h3 className="font-display text-[clamp(1.6rem,4vw,2.4rem)] leading-tight">
          A walk round the farm
        </h3>
        <p className="mt-3 text-[1.05rem] leading-relaxed">
          A short, silent film from the veranda to the lawn after dark. Pick a
          scene to jump straight to it.
        </p>
      </div>

      <div className="mx-auto w-full max-w-[300px] md:col-start-2 md:row-span-2 md:row-start-1 md:mx-0 md:w-[300px] lg:w-[340px] lg:max-w-[340px]">
        <div className="relative aspect-[9/16] w-full overflow-hidden rounded-sm border border-ink/10 bg-ink/5">
          <video
            ref={ref}
            muted
            loop
            playsInline
            preload="metadata"
            controls={!hydrated}
            poster={photoSrc(FARM_VIDEO.poster)}
            width={FARM_VIDEO.width}
            height={FARM_VIDEO.height}
            aria-describedby="video-scenes"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={photoSrc(FARM_VIDEO.src)} type="video/mp4" />
          </video>

          {hydrated && (
            <button
              type="button"
              onClick={toggle}
              // Bottom-left: the sticky contact pill owns the bottom-right corner.
              className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-ink/75 px-4 py-2 text-[13px] font-semibold text-paper backdrop-blur-sm transition-colors hover:bg-ink/90"
            >
              <span aria-hidden className="text-[11px]">
                {playing ? "❙❙" : "▶"}
              </span>
              {playing ? "Pause video" : "Play video"}
            </button>
          )}
        </div>
      </div>

      <ol
        id="video-scenes"
        aria-label="Scenes in the video"
        className="relative max-w-prose md:self-start"
      >
        {/* the rail */}
        <span aria-hidden className="absolute bottom-3 left-[5px] top-3 w-px bg-ink/15" />
        {VIDEO_SCENES.map((s, i) => {
          const active = hydrated && i === current;
          return (
            <li key={s.start}>
              <button
                type="button"
                onClick={() => jump(s.start)}
                aria-current={active ? "time" : undefined}
                className="group relative flex w-full items-baseline gap-4 rounded-sm py-2.5 pl-8 pr-2 text-left transition-colors hover:bg-ink/[0.03]"
              >
                <span
                  aria-hidden
                  className={[
                    "absolute left-0 top-[1.05rem] h-[11px] w-[11px] rounded-full border-2 border-terracotta transition-colors",
                    active ? "bg-terracotta" : "bg-ground-morning",
                  ].join(" ")}
                />
                <span className="tnum w-9 shrink-0 text-[13px] font-semibold opacity-70">
                  {stamp(s.start)}
                </span>
                <span className="min-w-0">
                  <span
                    className={[
                      "block font-display text-[1.2rem] leading-snug transition-colors",
                      active ? "text-terracotta" : "",
                    ].join(" ")}
                  >
                    {s.title}
                  </span>
                  <span className="mt-0.5 block text-[14px] leading-snug opacity-70">
                    {s.detail}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
