import Image from "next/image";
import { photoSrc } from "@/lib/photos";


import { NowPill } from "@/components/clock/NowPill";
import { ADDRESS_LINE, FARM_NAME, PHONE_DISPLAY, PHONE_TEL } from "@/lib/constants";

/**
 * Full-bleed house-and-lawn photograph from photo-22-cleaned.png, deliberately
 * blurred into atmosphere under a dusk-indigo vignette. This reverses the
 * original no-overlay direction knowingly; keep the farm recognisable and
 * preserve readable text rather than treating the scrim as a generic black fill.
 *
 * The desktop gradient weights darkness behind the left text column. Phones
 * use an even vertical gradient and an explicit focal point, because object-
 * cover reveals only a narrow slice of the wide frame there.
 *
 * Every photograph, focal point, blur or gradient change requires a fresh
 * scripts/contrast-audit.js run. Ratios from the previous phone snapshot do
 * not transfer. Current measurements are recorded in README.
 *
 * The image is decorative: the copy identifies the farm and the sharp social
 * preview and section photos show its details. Keep its alt text empty.
 */
/** Every vignette stop is mixed from --color-dusk, never a raw black. */
const dusk = (pct: number) =>
  `color-mix(in srgb, var(--color-dusk) ${pct}%, transparent)`;

export function Masthead() {
  return (
    <header
      id="masthead"
      className="dark-segment relative isolate overflow-hidden text-paper"
    >
      {/* The dusk ground lives on this layer, not on <header>. A background
          on the header itself paints over absolutely-positioned children
          sitting at a negative z-index, which silently hid the photograph
          entirely; keeping every layer at the default stacking level and
          letting the content sit `relative` above them avoids the trap, and
          this layer doubles as the fallback ground if the image fails. */}
      <div aria-hidden className="absolute inset-0 bg-dusk">
        <Image
          src={photoSrc("/photos/hero.jpg")}
          alt=""
          fill
          priority
          sizes="100vw"
          /* Scale keeps the blur edges outside the frame. The mobile crop
             favours the house and palms on the right of the wide lawn view. */
          className="scale-110 object-cover object-[83%_50%] blur-[10px] md:object-center"
        />
      </div>

      {/* Vignette in three passes: a light overall wash to settle the whole
          frame, a horizontal pass that stays heavy across the text column and
          then drops away fast, and a vertical pass that pulls down the bright
          sky at the top. Values are measured, not guessed — see above. */}
      <div aria-hidden className="absolute inset-0" style={{ background: dusk(22) }} />

      {/* Desktop: text sits in the left column, so the darkness is weighted
          there and the right-hand side is left for the picture. */}
      <div
        aria-hidden
        className="absolute inset-0 hidden md:block"
        style={{
          background: `linear-gradient(to right, ${dusk(95)}, ${dusk(93)} 52%, ${dusk(6)})`,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 hidden md:block"
        style={{
          background: `linear-gradient(to bottom, ${dusk(82)}, ${dusk(58)} 40%, ${dusk(12)} 65%, ${dusk(28)})`,
        }}
      />

      {/* Phones need an even vertical vignette instead of desktop's
          left-weighted gradient. Recheck contrast after changing these stops. */}
      <div
        aria-hidden
        className="absolute inset-0 md:hidden"
        style={{
          background: `linear-gradient(to bottom, ${dusk(80)}, ${dusk(70)} 42%, ${dusk(74)})`,
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 md:px-8 md:pb-24 md:pt-28">
        {/* Full opacity keeps this small address readable over the sky. */}
        <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.2em]">
          {ADDRESS_LINE}
        </p>
        <h1 className="font-display text-[clamp(2.6rem,10vw,6.5rem)] leading-[0.92] tracking-[-0.03em]">
          {FARM_NAME}
        </h1>
        <p className="mt-6 max-w-xl text-[clamp(1.05rem,2.4vw,1.3rem)] leading-relaxed">
          A farmhouse in Gurgaon, tucked into the green under the Aravalli
          hills. A private pool filled from our own tubewell and properly
          chlorinated, a rain dance whenever you want it, and a kitchen that
          keeps proper hours.
        </p>

        <div className="mt-9">
          <NowPill dark />
        </div>

        {/*
          The hero carries its own call and enquire entry points, in addition
          to the sticky bar — someone who lands here shouldn't have to hunt
          for the number. Both are plain links, so they work with no JS: the
          anchor smooth-scrolls via `scroll-behavior` in globals.css, which
          already yields to prefers-reduced-motion.
        */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${PHONE_TEL}`}
              className="rounded-full bg-terracotta px-6 py-3.5 text-[15px] font-semibold text-paper transition-opacity hover:opacity-90"
            >
              Call now
            </a>
            <a
              href="#enquire"
              className="rounded-full border border-paper/40 px-6 py-3.5 text-[15px] font-semibold transition-colors hover:bg-paper/10"
            >
              Enquire
            </a>
          </div>
          <a href={`tel:${PHONE_TEL}`} className="phone phone-hero">
            {PHONE_DISPLAY}
          </a>
        </div>

        <p className="mt-10 max-w-xl border-l-2 border-firelight/60 pl-4 text-[15px] leading-relaxed opacity-85">
          First what it costs, and then a day here in order — from the first
          paratha at eight to the kitchen shutting at half past ten.
        </p>
      </div>
    </header>
  );
}
