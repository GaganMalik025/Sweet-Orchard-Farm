import { KITCHEN_RULES } from "@/lib/menu";

/**
 * The day runs out of hours, and we say so. Nothing invented to fill the
 * slot — the kitchen closing is the last scheduled thing that happens here,
 * and that is exactly the point of the place.
 *
 * DELIBERATELY TEXT-ONLY. This section had a 16:9 PhotoWindow on
 * /photos/night.jpg, removed because every photograph we have was shot in
 * daylight and a daytime frame under "the kitchen closes" reads as a lie.
 * It is not missing — there is nothing to show yet.
 *
 * To put the photo back once real night shots exist, the change is local to
 * this file: drop a 16:9 image at /photos/night.jpg, re-import PhotoWindow,
 * wrap the block below in
 *
 *   <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:gap-14">
 *
 * (the same two-column shape GettingHere.tsx still uses), swap the
 * `max-w-2xl` on that block for `max-w-prose`, and add as its sibling:
 *
 *   <PhotoWindow src="/photos/night.jpg" ratio="16:9" dark
 *     label="Sweet Orchard Farm at night" />
 *
 * Nothing outside this file needs to change. See README, "Adding the real
 * photos".
 */
export function NightClose() {
  return (
    <div>
      <div className="max-w-2xl">
        <p className="text-[1.15rem] leading-relaxed">
          At half past ten the kitchen shuts and the staff go home to their
          families. After that the farm is yours and it is very, very quiet.
        </p>

        <blockquote className="mt-10 border-l-2 border-firelight/60 py-1 pl-6">
          {KITCHEN_RULES.map((line) => (
            <p key={line} className="font-display text-[1.25rem] leading-snug">
              {line}
            </p>
          ))}
          <footer className="mt-3 text-[13px] uppercase tracking-[0.14em] opacity-50">
            From the menu card
          </footer>
        </blockquote>

        <p className="mt-10 text-[1.02rem] leading-relaxed opacity-80">
          We&rsquo;re a farmhouse for families and small groups, not a party
          venue. If you&rsquo;re looking for a place to be loud until three in
          the morning, we&rsquo;ll be the wrong farm — and we&rsquo;d rather
          say so here than have you find out at the gate.
        </p>
      </div>
    </div>
  );
}
