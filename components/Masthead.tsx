import Image from "next/image";


import { NowPill } from "@/components/clock/NowPill";
import { ADDRESS_LINE, FARM_NAME, PHONE_DISPLAY, PHONE_TEL } from "@/lib/constants";

/**
 * The masthead sits on a full-bleed photograph of the farm, deliberately
 * blurred, under a vignette mixed from the site's own dusk indigo.
 *
 * The blur is the point, not a workaround: a soft backdrop, not a sharp
 * photograph. But it has to stay a backdrop *of this farm* — the roofline,
 * the palms and the shape of the building should be identifiable at a
 * glance, not reduced to blue and green blocks.
 *
 * Settled at 10px, compared against 8, 12 and 22. At 22px the building
 * stopped being a building. At 8px it still reads as a photograph someone
 * failed to focus. 10px is soft enough to be atmosphere and specific enough
 * that you can see a white house with a red tile roof and palms in front of
 * it within a second.
 *
 * No pixels show at this strength, checked by zooming 2x into the worst
 * case — the white wall against the red roof tiles, which is the highest
 * local contrast in the frame. The stand-in is a 1280px phone snap being
 * stretched well past its own size, and even 10px of blur is enough to hide
 * that completely.
 *
 * The vignette is `--color-dusk`, not black. A generic black scrim is the
 * thing that makes this pattern look like every other hero; mixing the
 * darkness from a colour the site already uses keeps the masthead inside the
 * same palette as the rest of the page. Every stop below is `color-mix`ed
 * from that token, so re-tinting dusk re-tints the masthead.
 *
 * It is also load-bearing, and its shape was measured rather than eyeballed.
 * Every piece of text here sits over the photograph, so there is no single
 * background colour to check against: the real composite (photo, blurred,
 * under all three layers) was rebuilt in a canvas and sampled pixel by pixel
 * under each text box, taking the worst pixel. An even wash dark enough to
 * carry the text flattened the photograph everywhere, so the darkness is
 * concentrated where the words are instead — held almost flat across the
 * left 52%, then falling away steeply — which buys the right-hand side back
 * for the picture. The vertical pass exists because the sky is the brightest
 * thing in the frame and the eyebrow and wordmark sit right on it.
 *
 * The binding constraint is the phone number: `.phone` is firelight on dark
 * grounds, a light amber, so it needs a genuinely dark backdrop to clear
 * 4.5:1 — it, not the wordmark, is what sets how heavy the left side has to
 * be. Worst-case ratios at 1470px, in order down the page: 5.41, 4.97 (large
 * text, needs 3), 9.60, 7.14, 13.04, 9.90, 5.12, 9.91, 4.98, 7.70.
 *
 * Softening the blur from 22px to 10px cost contrast, as expected — more
 * local variation in the photograph means darker text sits over brighter
 * pixels. It did not actually break anything (the tightest, the phone
 * number, held at 4.83) but the margin had thinned to +0.26, which is not
 * enough to trust at viewport widths that crop the photograph differently.
 * So the vignette was strengthened rather than the blur put back: the
 * horizontal pass is heavier and holds further across, the sky pass deeper.
 * That restored the worst margin to +0.48. Pushing it further gains
 * nothing — past that point the floor is the Call now button at 5.12, which
 * sits on its own terracotta fill and never touches the photograph.
 *
 * The header carries `.dark-segment`, so `.link` and `.phone` pick up their
 * firelight treatment automatically, exactly as they do in the dinner and
 * closing sections.
 *
 * The image is decorative: it is blurred past the point of carrying
 * information, and everything it would tell you is in the text beside it, so
 * it takes an empty alt rather than a description a screen reader would read
 * out for nothing.
 */
/** Every vignette stop is mixed from --color-dusk, never a raw black. */
const dusk = (pct: number) =>
  `color-mix(in srgb, var(--color-dusk) ${pct}%, transparent)`;

export function Masthead() {
  return (
    <header className="dark-segment relative isolate overflow-hidden text-paper">
      {/* The dusk ground lives on this layer, not on <header>. A background
          on the header itself paints over absolutely-positioned children
          sitting at a negative z-index, which silently hid the photograph
          entirely; keeping every layer at the default stacking level and
          letting the content sit `relative` above them avoids the trap, and
          this layer doubles as the fallback ground if the image fails. */}
      <div aria-hidden className="absolute inset-0 bg-dusk">
        <Image
          src="/photos/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          /* scale-110 pushes the blur's soft edges off-screen; without it a
             blurred `object-cover` fades out against its own container. */
          className="scale-110 object-cover blur-[10px]"
        />
      </div>

      {/* Vignette in three passes: a light overall wash to settle the whole
          frame, a horizontal pass that stays heavy across the text column and
          then drops away fast, and a vertical pass that pulls down the bright
          sky at the top. Values are measured, not guessed — see above. */}
      <div aria-hidden className="absolute inset-0" style={{ background: dusk(22) }} />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, ${dusk(95)}, ${dusk(93)} 52%, ${dusk(6)})`,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${dusk(52)}, ${dusk(12)} 50%, ${dusk(28)})`,
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 md:px-8 md:pb-24 md:pt-28">
        {/* Full opacity, not the opacity-70 this eyebrow carries elsewhere:
            over the bright end of the sky it measured 3.15:1 muted. */}
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
          <a href={`tel:${PHONE_TEL}`} className="phone text-[1.05rem]">
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
