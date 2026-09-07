"use client";

import { useClock } from "@/components/clock/ClockProvider";
import { PHONE_TEL, PHONE_DISPLAY } from "@/lib/constants";
import { whatsappHelloLink } from "@/lib/whatsapp";

/**
 * Call and WhatsApp. Which one leads depends on the hour at the farm: after
 * the kitchen closes we put WhatsApp first and say when we'll reply, rather
 * than inviting someone to ring a farmhouse at 1 AM. The phone link never
 * disappears — we signal etiquette, we don't block it.
 */
export function StickyContact() {
  const clock = useClock();
  const wa = whatsappHelloLink();
  const callLeads = !clock.ready || clock.calling;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 md:inset-x-auto md:bottom-6 md:right-6">
      <div className="pointer-events-auto border-t border-ink/10 bg-paper/95 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur md:rounded-full md:border md:border-ink/12 md:px-2.5 md:py-2.5 md:shadow-[0_6px_28px_rgb(36_31_26/0.14)]">
        <div className="mx-auto flex max-w-md items-center gap-2 md:max-w-none">
          {callLeads ? (
            <>
              <a
                href={`tel:${PHONE_TEL}`}
                className="flex-1 rounded-full bg-terracotta px-5 py-3 text-center text-[15px] font-semibold text-paper transition-opacity hover:opacity-90 md:flex-none"
              >
                Call now
              </a>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-full border border-ink/20 px-5 py-3 text-center text-[15px] font-semibold transition-colors hover:bg-ink/5 md:flex-none"
              >
                WhatsApp
              </a>
            </>
          ) : (
            <>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-full bg-neem px-5 py-3 text-center text-[15px] font-semibold leading-tight text-paper transition-opacity hover:opacity-90 md:flex-none"
              >
                WhatsApp
                <span className="ml-1.5 font-normal opacity-80">
                  — we&rsquo;ll reply after 8 AM
                </span>
              </a>
              <a
                href={`tel:${PHONE_TEL}`}
                className="link shrink-0 px-3 py-3 text-[14px]"
                aria-label={`Call ${PHONE_DISPLAY}`}
              >
                Call
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
