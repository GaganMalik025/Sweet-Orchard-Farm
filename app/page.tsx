import { COSTS_BLOCK, SEGMENTS } from "@/lib/schedule";
import { RailSegment, SegmentHeading } from "@/components/rail/RailSegment";
import { Masthead } from "@/components/Masthead";
import { MobileNowBar } from "@/components/clock/MobileNowBar";
import { GettingHere } from "@/components/GettingHere";
import { Rooms } from "@/components/Rooms";
import { Rates } from "@/components/Rates";
import { Afternoon } from "@/components/Afternoon";
import { NightClose } from "@/components/NightClose";
import { Footer } from "@/components/Footer";
import { ChooseThree } from "@/components/menu/ChooseThree";
import { ChooseOneSet } from "@/components/menu/ChooseOneSet";
import { PlateList } from "@/components/menu/PlateList";
import { PhotoWindow } from "@/components/PhotoWindow";
import { BEVERAGES, NONVEG_SNACKS, PER_HEAD, VEG_SNACKS } from "@/lib/menu";

const seg = (id: string) => {
  const found = SEGMENTS.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown segment: ${id}`);
  return found;
};

export default function Home() {
  return (
    <>
      <MobileNowBar />
      <Masthead />

      <main>
        {/* Untimed: the costs block isn't part of the day, but it is the
            first thing anyone wants after the hero. */}
        <RailSegment segment={COSTS_BLOCK}>
          <SegmentHeading segment={COSTS_BLOCK} kicker="Before you ask" />
          <Rates />
        </RailSegment>

        <RailSegment segment={seg("breakfast")}>
          <SegmentHeading segment={seg("breakfast")} />
          <p className="mb-9 max-w-prose text-[1.05rem] leading-relaxed">
            Served on demand — tell us the night before roughly when you want it
            and the kitchen will be ready.
          </p>
          <ChooseThree />
        </RailSegment>

        <RailSegment segment={seg("arrival")}>
          <SegmentHeading segment={seg("arrival")} kicker="Whenever you land" />
          <GettingHere />
        </RailSegment>

        <RailSegment segment={seg("rooms")}>
          <SegmentHeading segment={seg("rooms")} kicker="Once you're in" />
          <Rooms />
        </RailSegment>

        <RailSegment segment={seg("lunch")}>
          <SegmentHeading segment={seg("lunch")} />
          <p className="mb-9 max-w-prose text-[1.05rem] leading-relaxed">
            The same set as dinner — one thing from each row, cooked to order
            and brought out together. Tell us your picks when you book.
          </p>
          <ChooseOneSet price={PER_HEAD.lunch} idPrefix="lunch" />
        </RailSegment>

        <RailSegment segment={seg("afternoon")}>
          <SegmentHeading segment={seg("afternoon")} kicker="No fixed hours" />
          <Afternoon />
        </RailSegment>

        <RailSegment segment={seg("snacks")}>
          <SegmentHeading segment={seg("snacks")} />
          <p className="mb-10 max-w-prose text-[1.05rem] leading-relaxed">
            Ordered by the plate, as much or as little as you want. This is the
            stretch of the evening where nobody is in a hurry.
          </p>
          <div className="grid gap-10 md:grid-cols-2 md:gap-x-14">
            <PlateList heading="Veg" unit="per plate" items={VEG_SNACKS} />
            <div className="space-y-10">
              <PlateList heading="Non-veg" unit="per plate" items={NONVEG_SNACKS} />
              <PlateList heading="Beverages" unit="per cup" items={BEVERAGES} />
            </div>
          </div>
          <div className="mt-12 max-w-2xl">
            <PhotoWindow
              src="/photos/dining.jpg"
              ratio="3:2"
              label="Garden table and chairs on the lawn at Sweet Orchard Farm"
            />
          </div>
        </RailSegment>

        <RailSegment segment={seg("dinner")}>
          <SegmentHeading segment={seg("dinner")} />
          <p className="mb-9 max-w-prose text-[1.05rem] leading-relaxed">
            Dinner is a set, not a buffet. You pick one thing from each row and
            that is what comes out of the kitchen — hot, all at once, at nine.
            The menu is the same one you had at lunch.
          </p>
          <ChooseOneSet price={PER_HEAD.dinner} idPrefix="dinner" />
        </RailSegment>

        <RailSegment segment={seg("night")}>
          <SegmentHeading segment={seg("night")} />
          <NightClose />
        </RailSegment>
      </main>

      <Footer />
    </>
  );
}
