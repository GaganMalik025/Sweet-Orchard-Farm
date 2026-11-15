import { PhotoDrift } from "@/components/gallery/PhotoDrift";
import { FarmVideo } from "@/components/gallery/FarmVideo";

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

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-14 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16 md:px-8 md:pb-24 md:pt-20">
        <div className="max-w-prose">
          <h3 className="font-display text-[clamp(1.6rem,4vw,2.2rem)] leading-tight">
            A walk round the farm
          </h3>
          <p
            id="farm-video-description"
            className="mt-3 text-[1.05rem] leading-relaxed"
          >
            From the veranda out across the lawn, past the pool to the covered
            dining table, through three of the rooms, and back onto the lawn
            after dark.
          </p>
        </div>
        <div className="mx-auto w-full max-w-[300px] md:mx-0 md:w-[300px] lg:w-[340px] lg:max-w-[340px]">
          <FarmVideo describedBy="farm-video-description" />
        </div>
      </div>
    </section>
  );
}
