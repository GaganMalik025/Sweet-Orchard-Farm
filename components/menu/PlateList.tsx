import { rupees } from "@/lib/menu";

interface Item {
  readonly name: string;
  readonly price: number;
}

/** À la carte, set with dot leaders — a menu, not a pricing grid. */
export function PlateList({
  heading,
  unit,
  items,
}: {
  heading: string;
  unit: string;
  items: readonly Item[];
}) {
  return (
    <div>
      <h3 className="mb-1 text-[12px] font-semibold uppercase tracking-[0.18em] opacity-60">
        {heading}
      </h3>
      <p className="mb-4 text-[13px] italic opacity-55">{unit}</p>
      <ul className="space-y-2.5">
        {items.map((i) => (
          <li key={i.name} className="flex items-baseline">
            <span className="text-[17px] leading-snug">{i.name}</span>
            <span aria-hidden className="leader" />
            <span className="tnum shrink-0 text-[17px] font-medium">
              {rupees(i.price)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
