"use client";

import Image from "next/image";
import { useState } from "react";
import { GALLERY_COLUMNS, gallerySrc, type GalleryPhoto } from "@/lib/gallery";
import { photoSrc } from "@/lib/photos";

/*
 * Rendered widths, matching .drift-big / .drift-small in globals.css at each
 * breakpoint (strip height 240 / 360 / 420px). Next picks the file size
 * from these, so keep them in step with --drift-h if the height changes.
 */
const BIG_SIZES = "(max-width: 767px) 360px, (max-width: 1023px) 540px, 630px";
const SMALL_SIZES = "(max-width: 767px) 174px, (max-width: 1023px) 261px, 306px";

/**
 * The photo collage under the masthead, drifting slowly right to left on a
 * seamless loop: columns alternate one large photo and a stacked pair.
 *
 * The loop is pure CSS. The track holds the set twice and slides left by
 * exactly one set (-50%), then starts again, so there is never a gap. The
 * second copy is hidden from assistive tech, so each photo is announced once.
 *
 * Motion: about 30px a second at every width. It pauses while a mouse is over
 * it, and the Pause button stops it outright: moving content that starts on
 * its own and runs past five seconds needs a way to stop it (WCAG 2.2.2).
 * Under prefers-reduced-motion it doesn't move at all. The second copy goes,
 * and the strip becomes a row the visitor scrolls themselves.
 */
export function PhotoDrift() {
  const [paused, setPaused] = useState(false);

  return (
    <div className="drift" data-paused={paused}>
      <div className="drift-viewport">
        <div className="drift-track flex w-max">
          <PhotoSet />
          <PhotoSet copy />
        </div>
      </div>

      {/* Left-aligned: on desktop the sticky contact pill is fixed to the
          bottom-right corner and would cover a right-aligned button. */}
      <div className="mx-auto flex max-w-6xl px-4 pt-4 md:px-8 motion-reduce:hidden">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-[13px] font-semibold transition-colors hover:bg-ink/5"
        >
          <span aria-hidden className="tnum text-[11px]">
            {paused ? "▶" : "❙❙"}
          </span>
          {paused ? "Play photos" : "Pause photos"}
        </button>
      </div>
    </div>
  );
}

function PhotoSet({ copy = false }: { copy?: boolean }) {
  return (
    <ul
      aria-hidden={copy || undefined}
      aria-label={copy ? undefined : "Photos of the farm"}
      className={["drift-set flex flex-none", copy ? "motion-reduce:hidden" : ""].join(" ")}
    >
      {GALLERY_COLUMNS.map((col, i) =>
        col.kind === "big" ? (
          <li key={i} className="flex-none">
            <Tile photo={col.photo} size="big" decorative={copy} />
          </li>
        ) : (
          <li key={i} className="drift-pair flex flex-none flex-col">
            <Tile photo={col.photos[0]} size="small" decorative={copy} />
            <Tile photo={col.photos[1]} size="small" decorative={copy} />
          </li>
        ),
      )}
    </ul>
  );
}

function Tile({
  photo,
  size,
  decorative,
}: {
  photo: GalleryPhoto;
  size: "big" | "small";
  decorative: boolean;
}) {
  return (
    <div
      className={[
        size === "big" ? "drift-big" : "drift-small",
        "relative overflow-hidden rounded-sm bg-ink/5",
      ].join(" ")}
    >
      <Image
        src={photoSrc(gallerySrc(photo.file))}
        alt={decorative ? "" : photo.alt}
        fill
        sizes={size === "big" ? BIG_SIZES : SMALL_SIZES}
        className="object-cover"
      />
    </div>
  );
}
