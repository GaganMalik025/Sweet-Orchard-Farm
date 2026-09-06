import { Reviews } from "@/components/Reviews";
import { Rates } from "@/components/Rates";
import { EnquiryForm } from "@/components/EnquiryForm";
import {
  ADDRESS_LINE,
  FARM_NAME,
  MAPS_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "@/lib/constants";

export function Footer() {
  return (
    <>
      <section
        id="reviews"
        aria-labelledby="reviews-title"
        className="bg-ground-dust"
      >
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
          <h2
            id="reviews-title"
            className="font-display text-[clamp(1.8rem,5vw,2.8rem)] leading-tight"
          >
            What guests have said
          </h2>
          <p className="mb-9 mt-2 text-[15px] opacity-60">
            Pulled live from our Google listing.
          </p>
          <Reviews />
        </div>
      </section>

      <Rates />

      <section
        id="enquire"
        aria-labelledby="enquire-title"
        className="bg-ground-dust"
      >
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
          <h2
            id="enquire-title"
            className="font-display text-[clamp(1.8rem,5vw,2.8rem)] leading-tight"
          >
            Come and stay
          </h2>
          <p className="mb-10 mt-2 max-w-prose text-[1.02rem] leading-relaxed opacity-75">
            Tell us when and how many, and we&rsquo;ll come back to you with
            dates and rates. It goes straight to WhatsApp.
          </p>
          <EnquiryForm />
        </div>
      </section>

      <footer className="bg-ground-night text-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-3 md:px-8 md:py-20">
          <div>
            <p className="font-display text-[1.6rem] leading-tight">{FARM_NAME}</p>
            <p className="mt-2 text-[15px] opacity-70">{ADDRESS_LINE}</p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-[14px] underline decoration-paper/40 underline-offset-4 opacity-80 hover:opacity-100"
            >
              Google Maps →
            </a>
          </div>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] opacity-55">
              Call or WhatsApp
            </p>
            <a
              href={`tel:${PHONE_TEL}`}
              className="tnum mt-2 block text-[1.25rem] font-medium"
            >
              {PHONE_DISPLAY}
            </a>
            <p className="mt-2 text-[13px] opacity-60">
              Someone picks up between 8 AM and 10:30 PM IST.
            </p>
          </div>
          <nav aria-label="The day">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] opacity-55">
              The day
            </p>
            <ul className="mt-2 space-y-1 text-[15px]">
              {[
                ["breakfast", "Breakfast"],
                ["arrival", "Getting here"],
                ["rooms", "The rooms"],
                ["lunch", "Lunch"],
                ["afternoon", "Pool & rain dance"],
                ["snacks", "Snacks"],
                ["dinner", "Dinner"],
                ["rates", "What it costs"],
                ["enquire", "Enquire"],
              ].map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="opacity-75 underline decoration-transparent underline-offset-4 transition hover:decoration-paper/50 hover:opacity-100"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="border-t border-paper/12">
          <p className="mx-auto max-w-6xl px-4 py-6 pb-24 text-[13px] opacity-50 md:px-8 md:pb-6">
            © {new Date().getFullYear()} {FARM_NAME}. All times shown are IST.
          </p>
        </div>
      </footer>
    </>
  );
}
