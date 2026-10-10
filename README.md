# Sweet Orchard Farm

Website for Sweet Orchard Farm — a farmhouse stay behind the Shiv Temple at
Garat Pur Bas, Haryana, near the Aravalli hills.

Built on the **"The Day Has Hours"** creative direction: the site is the
farm's daily timetable. You don't scroll through features, you scroll through
a day — 8 AM breakfast down to the kitchen shutting at 10:30 PM — and a live
clock shows what's happening at the farm right now, in IST.

Next.js 15 (App Router) · TypeScript · Tailwind v4 · deployed on Vercel.

---

## Running it

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
```

---

## The one file that matters

**`lib/schedule.ts`** is the single source of truth for the whole page. The
rail ticks, the ground colours, the section order, the live clock and the
sticky contact button all derive from it. Change an hour there and everything
follows. Don't hard-code times anywhere else.

`lib/menu.ts` is the same idea for the food: every dish and price is
transcribed from `Sweet-Orchard-Farm-Menu-A4-Print.pdf`. If the printed card
changes, change that file.

---

## Photos

All ten assets in `public/photos` were replaced on **10 October 2026** with
selected images from `Farmhouse Photos no watermark/`. The source PNGs remain
untouched. Only cropping, resizing and JPEG compression are applied for the
website; no scenes or amenities are generated.

Every slot retains its fixed filename and aspect ratio. The photographs were
selected by subject and composition rather than filename order:

| Website asset | Ratio | Source PNG | Reason / placement |
|---|---|---|---|
| `hero.jpg` | 16:9 | `photo-22-cleaned.png` | Wide house and lawn establishing view; blurred masthead background |
| `arrival.jpg` | 3:2 | `photo-10-cleaned.png` | Clear paved approach and veranda; does not claim to show the kutcha road |
| `rooms.jpg` | 3:2 | `photo-7-cleaned.png` | Bedroom showing the bed, seating and blue feature wall |
| `pool-02.jpg` | 3:2 | `photo-23-cleaned.png` | Oblique pool view with garden and hedges |
| `rain-dance-02.jpg` | 3:2 | `photo-13-cleaned.png` | Front view of poolside overhead frame; caption does not claim active sprinklers or guests |
| `dining.jpg` | 3:2 | `photo-18-cleaned.png` | Covered poolside dining table; does not claim food is being served |
| `night.jpg` | 16:9 | `photo-21-cleaned.png` | Real illuminated farmhouse and lawn; restored in the closing section |
| `og.jpg` | 1200×630 | `photo-22-cleaned.png` | Sharp house-and-lawn image for social previews |
| `pool-01.jpg` | 4:5 | `photo-23-cleaned.png` | Replaced portrait asset; unused while PoolSurface renders |
| `rain-dance-01.jpg` | 4:5 | `photo-13-cleaned.png` | Replaced portrait asset; unused while RainDance renders |

The pool and rain-dance animations remain in place; the real photos below
them supplement those controls. The closing section now has its own night
photograph, because this batch finally includes nighttime coverage.

Source images are about 1600px wide. Web copies retain that resolution where
possible, stay below 500KB, and strip source metadata. Social preview size is
exactly 1200×630. Run `node scripts/prepare-photos.mjs` to reproduce the assets.
The source folder is gitignored so only the selected web copies are committed.
`lib/photos.ts` versions photo URLs, including the social preview, to bypass
old optimised-image and browser caches. Bump PHOTO_VERSION on future swaps.

Still missing from this batch: the kutcha stretch itself, food on a laid table,
and people using the rain dance. Captions must not imply these are pictured.

### Contrast

Text colours are held to WCAG AA — 4.5:1 for body text, 3:1 for large text —
measured by compositing the real painted layers, not by eye.
`scripts/contrast-audit.js` does this: open a page, paste it into the console,
and call `contrastAudit()`. Over the masthead it rebuilds the whole composite
and reports the worst pixel under each line. Two palette
facts follow from that and shouldn't be reverted casually:

- **`--color-terracotta` is `#a04d24`.** It carries text in both directions
  (as link and phone colour on paper, and as the fill beneath paper-coloured
  button labels such as *Call now*, *Calculate Cost* and *Send this on
  WhatsApp*). The original `#b85c2e` scored 3.98:1 and failed both ways.
- **Muted small caps sit at `opacity-70`, not `opacity-55`.** At 55% the
  eyebrows and the NowPill label scored 3.56:1 and 3.65:1. At 70% they clear
  5.69:1 and 5.88:1, and the same lift helps the dark segments too.

The earlier full-page sweep after the palette change measured 290 text elements: 46 moved from
fail to pass, and nothing regressed. **44 still fail** — small print at other
opacity levels (`opacity-40`, `-50`, `-60`) that this change didn't touch,
mostly notes and unit labels in the pricing and menu sections. Worth a pass
of its own; the lowest is 2.7:1 on the calculator's *"Your total will appear
here."* placeholder.

### The masthead photograph

The masthead uses `photo-22-cleaned.png`: the farmhouse roofline, palms and
lawn. Its **10px blur** is intentional, with a dusk-indigo vignette rather
than a black scrim. Desktop concentrates darkness behind the left text column;
phones use an even vertical gradient and a crop favouring the house and palms.

This deliberately reverses the original creative direction's no-overlay rule.
The sharp section photos and social preview carry the photographic detail.
The hero remains decorative with empty alt text.

The previous phone-photo contrast measurements are superseded. Re-run
`scripts/contrast-audit.js` after any change to the image, blur, focal point or
vignette, because text sits over actual image pixels rather than one colour.

**Verified on 10 October 2026:** all 90 masthead checks passed across nine
viewport widths. Body text requires 4.5:1; large text requires 3:1.

| Viewport | Text elements checked | Lowest body-text ratio | Lowest large-text ratio | Failures |
|---|---|---|---|---|
| 360px | 10 | 5.12:1 | 3.44:1 | 0 |
| 375px | 10 | 5.12:1 | 3.44:1 | 0 |
| 390px | 10 | 5.12:1 | 3.44:1 | 0 |
| 414px | 10 | 5.12:1 | 3.42:1 | 0 |
| 430px | 10 | 5.12:1 | 3.48:1 | 0 |
| 768px | 10 | 4.77:1 | 5.57:1 | 0 |
| 1024px | 10 | 4.92:1 | 5.57:1 | 0 |
| 1470px | 10 | 4.92:1 | 6.48:1 | 0 |
| 2560px | 10 | 4.91:1 | 8.18:1 | 0 |

The audit excludes hidden responsive layers, recognises CSS default vertical
gradients, and applies image scaling after object-position. The desktop sky
pass was strengthened for this photograph; mobile keeps its even vignette.

The sticky contact bar hides on phones while the masthead is visible, then
returns below it. This was verified in a 390px browser viewport; physical
phone behaviour remains a separate check. A noscript rule preserves contact
access when JavaScript is disabled.

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in. **`.env.local` is gitignored
and must never be committed.**

| Variable | Where it's used | Public? |
|---|---|---|
| `GOOGLE_MAPS_API_KEY` | `app/api/reviews/route.ts` | **No — server only** |
| `GOOGLE_PLACE_ID` | `app/api/reviews/route.ts` | **No — server only** |
| `WEB3FORMS_ACCESS_KEY` | `app/api/enquiry/route.ts` | **No — server only** |
| `NEXT_PUBLIC_SITE_URL` | canonical URL, sitemap, Open Graph | Yes, by design |

No secret carries the `NEXT_PUBLIC_` prefix, so none can be inlined into the
browser bundle. They're read from `process.env` inside route handlers at
request time. Verify after any change:

```bash
npm run build
grep -r "$YOUR_KEY_VALUE" .next/static   # must return nothing
```

The phone and WhatsApp numbers are deliberately **not** env vars — they're
public business information and live in `lib/constants.ts`.

---

## Google reviews

`/api/reviews` calls the Google **Places API (New)** server-side and returns a
normalised payload. Google's raw response never reaches the browser.

- Google returns **at most 5 reviews**. That's their limit.
- Cached for 24 hours, so traffic doesn't cost per visitor.
- Attribution (author name, photo, link) is rendered because Google's terms
  require it.
- If the call fails, is rate-limited, or the key is missing, the section
  degrades to a link to the Google Maps listing. **It never shows invented
  reviews.**

**Setup:** enable the *Places API (New)* in Google Cloud Console, create an
API key, enable billing, then restrict the key to the Places API and to your
deployed domain.

### Geo-coordinates

`GEO` in `lib/constants.ts` is resolved and the JSON-LD ships a `geo` block.
To re-resolve it:

```bash
npm run place:geo
```

It prints a line to paste straight into `lib/constants.ts`. The value is
hard-coded rather than fetched at runtime because coordinates don't move.
`GEO` stays nullable: a guessed pin is worse than no pin, so if it is ever
set back to `null` the schema drops the `geo` block instead of inventing one.

---

## Enquiry form

Fields: name, mobile, check-in, check-out, guests.

1. Validates client-side (10-digit Indian mobile `[6-9]\d{9}`, check-in not in
   the past, check-out strictly after check-in). `+91`, leading `0`, spaces and
   hyphens are stripped before checking, so a pasted number doesn't fail on
   formatting.
2. Fires a backup record to `/api/enquiry` → Web3Forms. **Not awaited**, with
   `keepalive: true`, so a slow or failed POST can never block or swallow the
   enquiry. The route re-validates server-side.
3. Navigates in the same tab to `wa.me` with the details pre-written. Same
   tab, same user gesture — no popup blocker, and it works inside in-app
   browsers (Instagram, Facebook) where `window.open` is unreliable.
4. If the browser blocks it anyway, a visible "WhatsApp didn't open — tap
   here" link appears.

Without `WEB3FORMS_ACCESS_KEY` set, the route logs a warning and returns
`{ ok: true, stored: false }` — a missing backup key never breaks a guest's
enquiry.

---

## Deploying to Vercel

1. `git init && git add -A && git commit -m "Sweet Orchard Farm website"`
2. Push to a new **private** GitHub repo.
3. Import the repo at [vercel.com/new](https://vercel.com/new). The Next.js
   preset is detected automatically — no build configuration needed.
4. Add all four environment variables under **Settings → Environment
   Variables**, for Production, Preview and Development.
5. Deploy. You'll get `https://<project>.vercel.app`.
6. Update `NEXT_PUBLIC_SITE_URL` to that URL and redeploy, so canonical tags,
   the sitemap and Open Graph point at the right place.
7. Restrict the Google API key to the deployed domain.

A custom domain is optional and changes nothing structural: add it in Vercel,
point the DNS, and update `NEXT_PUBLIC_SITE_URL`.

Every branch gets its own preview URL — useful for reviewing the photo swap
without touching production.

---

## Notes on content

Everything on the page comes from the owner or the printed menu card. Where a
fact doesn't exist, the site says nothing rather than inventing one:

- **No bonfire.** There isn't one. The day simply runs out of hours after
  dinner, and the closing section says so.
- **No fixed hours for the pool or the rain dance.** Guests use them whenever
  they like. They sit in the afternoon stretch of the rail for shape, but the
  copy never claims a window.
- **Lunch and dinner share one menu.** Identical set meal, one choice per
  category, at their own per-head rates (both ₹500). Both render the same
  `ChooseOneSet` component from the same `SET_MEAL_CATEGORIES` data — change
  a dish once and it updates in both places.
- **The stay rate (₹1,500 per head) carries no time period.** Whether it is
  per night or per stay hasn't been confirmed, so the site doesn't say.
- **All pricing runs through `lib/pricing.ts`.** The published worked
  examples and the interactive calculator call the same `perHead` /
  `totalFor` / `breakdown` functions, so they cannot disagree. The stay
  charge is always part of the total; meals are add-ons.
- **Wedding prices are flat, per event, and exclude food.** ₹30,000 up to 50
  guests, ₹35,000 for 51–80. Styled deliberately unlike the per-head list so
  they aren't misread as per person.
- **No tariff.** Room rates aren't published anywhere in the source material,
  so they go through WhatsApp.
- **Raita** sits with the set meal, matching the printed card. (An earlier
  revision of the card printed it on the breakfast page; the current one has
  it under Dinner, so the explanatory note the site used to carry is gone.)
