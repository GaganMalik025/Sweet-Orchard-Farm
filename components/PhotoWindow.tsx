import Image from "next/image";
import { photoSrc } from "@/lib/photos";

const RATIO: Record<string, string> = {
  "3:2": "aspect-[3/2]",
  "4:5": "aspect-[4/5]",
  "16:9": "aspect-[16/9]",
};

/**
 * Photo slots keep fixed filenames and aspect ratios to prevent layout shift.
 * All ten assets were replaced on 10 October 2026 from the owner's
 * Farmhouse Photos no watermark folder. README records the source for each.
 *
 * Captions must describe the actual frame: arrival shows the paved veranda
 * approach; dining shows the covered poolside table, with no food served.
 * The closing section now has a real night photograph. Portrait pool and
 * rain-dance assets remain available but the animated set-pieces still render.
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
          src={photoSrc(src)}
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
