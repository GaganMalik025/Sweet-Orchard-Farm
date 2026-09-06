import { PhotoWindow } from "@/components/PhotoWindow";
import { OCCUPANCY } from "@/lib/constants";

/**
 * Real numbers only. No tariff is published anywhere in the source material,
 * so none appears here — rates go through WhatsApp.
 */
export function Rooms() {
  return (
    <div className="grid gap-10 md:grid-cols-[1fr_1.05fr] md:gap-14">
      <div>
        <ul className="divide-y divide-current/12 border-y border-current/12">
          <li className="flex items-baseline gap-5 py-5">
            <span className="tnum font-display text-[2.4rem] leading-none">
              {OCCUPANCY.kingRooms}
            </span>
            <span className="min-w-0">
              <span className="block text-[17px] font-medium">
                rooms with a king-size bed
              </span>
              <span className="block text-[14px] opacity-60">
                each with its own attached washroom
              </span>
            </span>
          </li>
          <li className="flex items-baseline gap-5 py-5">
            <span className="tnum font-display text-[2.4rem] leading-none">
              {OCCUPANCY.queenBedRooms}
            </span>
            <span className="min-w-0">
              <span className="block text-[17px] font-medium">
                room with two queen-size beds
              </span>
              <span className="block text-[14px] opacity-60">
                the room for the cousins
              </span>
            </span>
          </li>
          <li className="flex items-baseline gap-5 py-5">
            <span className="tnum font-display text-[2.4rem] leading-none">
              {OCCUPANCY.maxGuests}
            </span>
            <span className="min-w-0">
              <span className="block text-[17px] font-medium">
                guests, comfortably
              </span>
              <span className="block text-[14px] opacity-60">
                extra mattresses can be arranged if you&rsquo;re more — just ask
              </span>
            </span>
          </li>
        </ul>
        <p className="mt-7 max-w-prose text-[15px] leading-relaxed opacity-75">
          It&rsquo;s one property, and you get all of it. Which is why we take
          families and small groups rather than large parties — the quiet is the
          thing people come here for.
        </p>
      </div>
      <PhotoWindow
        src="/photos/rooms.jpg"
        ratio="3:2"
        label="A room at Sweet Orchard Farm"
        caption="Placeholder until the real photographs arrive."
      />
    </div>
  );
}
