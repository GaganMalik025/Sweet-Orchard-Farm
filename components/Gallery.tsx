import { PhotoDrift } from "@/components/gallery/PhotoDrift";
import { Walkthrough } from "@/components/gallery/Walkthrough";

/**
 * Photos and the walk-through video, straight after the masthead and before
 * the costs.
 *
 * Like the costs block, this isn't part of the day, so it sits outside the
 * time rail and has no tick. The photo strip runs full-bleed, edge to edge,
 * because a drifting collage boxed into the content column would read as a
 * carousel.
 *
 * The copy describes only what the photos and the video actually show. The
 * video has no people and no sound, so nothing here suggests otherwise.
 */
export function Gallery() {
  return (
    <section
      id="gallery"
      aria-labelledby="gallery-title"
      className="overflow-hidden bg-ground-morning text-ink"
    >
      <div className="mx-auto max-w-6xl px-4 pt-16 md:px-8 md:pt-24">
        <header className="mb-8 md:mb-10">
          <p className="mb-2 text-[13px] font-semibold uppercase tracking-[0.16em] opacity-70">
            A look round
          </p>
          <h2
            id="gallery-title"
            className="font-display text-[clamp(2rem,6vw,3.4rem)] leading-[1.05] tracking-[-0.02em]"
          >
            The farm, in pictures
          </h2>
          <p className="mt-4 max-w-prose text-[1.05rem] leading-relaxed">
            The rooms, the lawn, the verandas and the pool, by day and after
            dark.
          </p>
        </header>
      </div>

      <PhotoDrift />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 md:px-8 md:pb-24 md:pt-16">
        <Walkthrough />
      </div>
    </section>
  );
}
