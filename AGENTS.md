# Working on this codebase

Orientation for anyone — person or coding agent — picking this up cold.
`README.md` is the real documentation and is kept current; this file exists to
point you at it and to record the things that are easy to break because the
reason for them isn't visible in the code.

Nothing here is tool-specific. There is no agent config to install.

---

## Start here

| Question | Read |
|---|---|
| How do I run it? | `README.md` → *Running it* |
| What drives the page? | `lib/schedule.ts`, then `README.md` → *The one file that matters* |
| How do I replace a photo? | `README.md` → *Adding the real photos* |
| Why is the masthead like that? | `components/Masthead.tsx` doc comment, then `README.md` → *The masthead photograph* |
| What can I say on the page? | `README.md` → *Notes on content* |
| Where do secrets live? | `README.md` → *Environment variables* |

Most components carry a doc comment explaining *why* they are the way they
are. Read it before changing one. Several record decisions that look like
mistakes until you know the reason.

---

## Invariants

Breaking one of these is a regression even when the build passes.

**One source of truth per kind of fact.** Times live in `lib/schedule.ts`;
the rail, the clock, the section order and the sticky button all derive from
it. Dishes and prices live in `lib/menu.ts`, transcribed from
`Sweet-Orchard-Farm-Menu-A4-Print.pdf`. Money runs through `lib/pricing.ts`,
which the published worked examples and the interactive calculator both call,
so they cannot disagree. Don't hard-code a time, a dish or a rate anywhere
else.

**Where a fact doesn't exist, the site says nothing.** This is the strongest
content rule here and it is deliberate: no bonfire, no fixed hours for the
pool or rain dance, no published room tariff, and the stay rate carries no
time period because per-night vs per-stay was never confirmed. Don't fill
these gaps with plausible copy. `README.md` → *Notes on content* lists them.

**Reviews are never invented.** `/api/reviews` degrades to a link to the
Google listing if the call fails or the key is missing. Google's attribution
(author name, photo, link) is rendered because their terms require it.

**No secret carries a `NEXT_PUBLIC_` prefix.** Secrets are read from
`process.env` inside route handlers at request time. After touching anything
env-related, verify nothing leaked into the client bundle:

```bash
npm run build
grep -r "$YOUR_KEY_VALUE" .next/static   # must return nothing
```

**Photo slots have locked aspect ratios and fixed filenames**, because the
filenames are referenced in code and the ratios stop the layout shifting when
a photo is swapped. All ten assets now use the owner-provided October 2026
photo batch — see the source mapping in `README.md`.

**Contrast is measured, not eyeballed**, and held to WCAG AA. Two palette
facts follow from that and shouldn't be reverted as stray tidy-ups:
`--color-terracotta` is `#a04d24` (the older `#b85c2e` scored 3.98:1 and
failed), and muted small caps sit at `opacity-70`, not `opacity-55`. See
*Contrast* in the README, and `scripts/contrast-audit.js` to re-run it.

**The masthead deliberately contradicts the creative direction.** The
direction rules out "a headline over a darkened photo" as the generic
template look; the masthead is exactly that, chosen knowingly after an
earlier revision did it the other way. Its blur strength and every vignette
stop are tuned against *this specific photograph* by measurement. If you
change the image, the blur, or any stop, re-run the audit — the recorded
numbers won't transfer.

---

## Verify before you call it done

```bash
npx tsc --noEmit     # types
npm run build        # must generate all static pages
```

For anything visual, look at it in a browser rather than trusting the build.
Note that `npm run lint` is wired to `next lint`, which is deprecated in
Next 15 and may not do anything useful.

### Checking contrast

`scripts/contrast-audit.js` is a console script — open the page, paste it in,
and it prints a pass/fail table. It composites the real painted layers rather
than reading colour values, which matters because two things here defeat the
naive approach: the NowPill's background is an `oklab(… / 0.55)` value that
string-parsing scores as near-black, and the masthead's text sits over a
photograph, which has no single background colour. Over the masthead it
samples every pixel under each line and reports the worst one.

Two environment traps, both of which cost time to rediscover:

- **Narrow viewports.** Resizing the browser window may silently not change
  the viewport. Rendering the site in an `<iframe>` of the target width does
  work, because an iframe's width drives media queries.
- **IntersectionObserver.** Callbacks are deferred while a document is
  `visibilityState: "hidden"`, which is the case for a backgrounded or
  automated tab. An observer firing nothing there is the environment, not
  your code.

---

## Open threads

State of things as of the last session, so you don't re-derive it:

- **All ten photo assets were replaced on 10 October 2026** from
  `Farmhouse Photos no watermark/`. Source mapping and reproduction command
  are in `README.md`; the original PNGs are untouched and gitignored.
- **The closing section now renders a real night photograph.** The new batch
  includes night shots, so `components/NightClose.tsx` restores that slot.
- **Still missing:** the kutcha road itself, food on a laid table, and people
  using the rain dance. Captions must describe what the selected images show.
- **44 contrast failures remain outside the masthead** — small print at
  `opacity-40/-50/-60` in the pricing and menu sections, untouched by the
  palette fix. The worst is 2.7:1 on the calculator's *"Your total will appear
  here."* placeholder. Worth a pass of its own.
- **Unverified:** that the sticky contact bar reappears after scrolling past
  the masthead on a real phone. The hide-while-hero-visible half is confirmed;
  the return could not be tested because of the IntersectionObserver trap
  above. If it doesn't come back on a device, a scroll-position fallback is
  the fix.
- **Unconfirmed fact:** whether the ₹1,500 stay rate is per night or per stay.
  Until someone asks the owner, the site must keep saying neither.
