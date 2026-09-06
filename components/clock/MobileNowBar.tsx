"use client";

import { NowPill } from "./NowPill";

/**
 * On small screens the pill becomes a sticky bar at the top rather than
 * living in the rail gutter, which has no room for it.
 */
export function MobileNowBar() {
  return (
    <div className="sticky top-0 z-30 border-b border-ink/10 bg-paper/95 backdrop-blur md:hidden">
      <NowPill compact />
    </div>
  );
}
