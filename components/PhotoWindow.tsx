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
