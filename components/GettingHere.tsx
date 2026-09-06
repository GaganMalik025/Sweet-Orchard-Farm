import { PhotoWindow } from "@/components/PhotoWindow";
import { ADDRESS_LINE, MAPS_URL } from "@/lib/constants";

export function GettingHere() {
  return (
    <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:gap-14">
      <div>
        <p className="max-w-prose text-[1.05rem] leading-relaxed">
          We&rsquo;re behind the Shiv Temple at Garat Pur Bas, with the Aravallis
          at your back. Keep the temple on your right and carry on.
        </p>
        <p className="mt-5 max-w-prose text-[1.05rem] leading-relaxed">
          The last stretch of road is kutcha — unpaved, and honestly a bit
          rough. Go slow. It is the reason the place is as quiet as it is, and
          by the time you&rsquo;re through it you&rsquo;ll have left the traffic
          somewhere well behind you.
        </p>
        <address className="mt-8 not-italic">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] opacity-55">
            The address
          </p>
          <p className="mt-1.5 text-[1.05rem]">{ADDRESS_LINE}</p>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-[15px] underline decoration-current/40 underline-offset-4 hover:decoration-current"
          >
            Open in Google Maps →
          </a>
        </address>
      </div>
      <PhotoWindow
        src="/photos/arrival.jpg"
        ratio="3:2"
        label="The approach road to Sweet Orchard Farm"
        caption="The last kutcha stretch — placeholder until the real photographs arrive."
      />
    </div>
  );
}
