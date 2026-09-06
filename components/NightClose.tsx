import { KITCHEN_RULES } from "@/lib/menu";
import { PhotoWindow } from "@/components/PhotoWindow";

/**
 * The day runs out of hours, and we say so. Nothing invented to fill the
 * slot — the kitchen closing is the last scheduled thing that happens here,
 * and that is exactly the point of the place.
 */
export function NightClose() {
  return (
    <div>
      <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:gap-14">
        <div>
          <p className="max-w-prose text-[1.15rem] leading-relaxed">
            At half past ten the kitchen shuts and the staff go home to their
            families. After that the farm is yours and it is very, very quiet.
          </p>

          <blockquote className="mt-9 border-l-2 border-firelight/60 pl-5">
            {KITCHEN_RULES.map((line) => (
              <p key={line} className="font-display text-[1.25rem] leading-snug">
                {line}
              </p>
            ))}
            <footer className="mt-3 text-[13px] uppercase tracking-[0.14em] opacity-50">
              From the menu card
            </footer>
          </blockquote>

          <p className="mt-9 max-w-prose text-[1.02rem] leading-relaxed opacity-80">
            We&rsquo;re a farmhouse for families and small groups, not a party
            venue. If you&rsquo;re looking for a place to be loud until three in
            the morning, we&rsquo;ll be the wrong farm — and we&rsquo;d rather
            say so here than have you find out at the gate.
          </p>
        </div>
        <PhotoWindow
          src="/photos/night.jpg"
          ratio="16:9"
          label="Sweet Orchard Farm at night"
          caption="Placeholder until the real photographs arrive."
          dark
        />
      </div>
    </div>
  );
}
