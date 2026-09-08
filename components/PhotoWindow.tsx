import Image from "next/image";

const RATIO: Record<string, string> = {
  "3:2": "aspect-[3/2]",
  "4:5": "aspect-[4/5]",
  "16:9": "aspect-[16/9]",
};

/**
 * A photo slot with a locked aspect ratio. Until a real photograph is
 * dropped in at the same path, this renders a placeholder in the site's own
 * palette. Swapping the file changes pixels and nothing else — no reflow,
 * no restructuring. See README, "Adding the real photos".
 *
 * TEMPORARY PHOTOS — added 2026-09-07, due for replacement.
 * arrival.jpg, dining.jpg, rooms.jpg, pool-02.jpg, rain-dance-02.jpg and
 * og.jpg all currently hold phone-camera snaps used as stand-ins, NOT the
 * final professional set. The proper shoot is expected within 1–2 weeks;
 * replace those six files (same paths, same ratios) when it lands.
 *
 * hero.jpg is a seventh stand-in but not a slot in here — it is the
 * masthead's full-bleed background, and Masthead.tsx renders it directly.
 * It is also the one place resolution barely matters, because it is blurred
 * on purpose.
 *
 * The closing section no longer renders a photo slot at all: the phone batch
 * was shot entirely in daylight, and a daytime frame under "the kitchen
 * closes" would read as a lie, so NightClose.tsx is deliberately text-only.
 * Putting it back is a local change documented in that file.
 *
 * Two of these carry copy that was rewritten to match what the stand-in
 * actually shows, and that copy should be revisited when the photo is
 * replaced: arrival.jpg pictures the paved drive up to the house, not the
 * kutcha stretch (GettingHere.tsx), and dining.jpg pictures the garden
 * seating rather than a laid table (app/page.tsx). The kutcha road is
 * still described in full in the prose beside the arrival photo.
 * See README, "Adding the real photos", for the state of every slot.
 */
export function PhotoWindow({
  src,
  ratio,
  label,
  caption,
  dark = false,
  priority = false,
}: {
  src: string;
  ratio: "3:2" | "4:5" | "16:9";
  label: string;
  caption?: string;
  dark?: boolean;
  priority?: boolean;
}) {
  return (
    <figure className="w-full">
      <div
        className={[
          RATIO[ratio],
          "relative w-full overflow-hidden rounded-sm border",
          dark ? "border-paper/15" : "border-ink/10",
        ].join(" ")}
      >
        <Image
          src={src}
          alt={label}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={priority}
          className="object-cover"
        />
      </div>
      {caption && (
        <figcaption className="mt-2.5 text-[13px] leading-snug opacity-60">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
