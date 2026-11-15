"use client";

import { useEffect, useRef, useState } from "react";
import { FARM_VIDEO } from "@/lib/gallery";
import { photoSrc } from "@/lib/photos";

/**
 * The owner's walk-through video: a silent loop (the audio was removed at
 * encode time, by the owner's choice).
 *
 * - Plays only while at least 30% of it is on screen, and pauses when
 *   scrolled away, so it isn't decoding video nobody is looking at.
 * - Pause / Play button: it starts on its own and runs past five seconds,
 *   so it needs a way to stop (WCAG 2.2.2). Once the visitor pauses it,
 *   scrolling back doesn't restart it.
 * - prefers-reduced-motion: never starts on its own; the button plays it.
 * - Before hydration, and with no JS at all, the native controls are shown,
 *   so the video can still be played.
 *
 * Playback goes through play() in an effect rather than the autoplay
 * attribute: React sets `muted` as a property, not an attribute, so
 * server-rendered HTML would carry autoplay without muted, which mobile
 * browsers refuse.
 */
export function FarmVideo({ describedBy }: { describedBy: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [hydrated, setHydrated] = useState(false);
  const [playing, setPlaying] = useState(false);

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
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);

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

  return (
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
        aria-describedby={describedBy}
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
  );
}
