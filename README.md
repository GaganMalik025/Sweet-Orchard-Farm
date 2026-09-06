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

## Adding the real photos

Every photo slot has a **locked aspect ratio**. Replace the file at the exact
path below, keeping the same filename and roughly the same ratio, and nothing
else needs to change — no layout shift, no code edits.

| Replace this file | Ratio | Where it appears |
|---|---|---|
| `public/photos/arrival.jpg` | 3:2 | Getting here — the kutcha approach road |
| `public/photos/pool-01.jpg` | 4:5 | Pool, portrait *(currently unused — the animated pool renders instead; drop a photo in and swap it into `components/Afternoon.tsx` if you'd rather show the real thing)* |
| `public/photos/pool-02.jpg` | 3:2 | Afternoon — pool, wide |
| `public/photos/rain-dance-01.jpg` | 4:5 | Rain dance, portrait *(same note as pool-01)* |
| `public/photos/rain-dance-02.jpg` | 3:2 | Afternoon — rain dance, wide, people under it |
| `public/photos/rooms.jpg` | 3:2 | The rooms |
| `public/photos/dining.jpg` | 3:2 | Snacks & starters — the table |
| `public/photos/night.jpg` | 16:9 | The kitchen closes |
| `public/photos/og.jpg` | 1200×630 | Social preview card (WhatsApp, Twitter, Facebook) |

**Rules**

- **Keep the filenames exactly as they are.** They're referenced in code.
- Keep the ratio close. The frame crops to fill, so a slightly different ratio
  is fine; a portrait photo in a 3:2 slot will lose its top and bottom.
- Target ~2400px on the long edge, around 500KB or less as JPEG.
- Anything you don't replace keeps rendering its placeholder. There are no
  broken images at any point, so you can swap them in one at a time.
- **Do `og.jpg` last** — it's the image that shows when someone shares the
  link, so make it the best one you have.

The current files are generated placeholders in the site's own palette, each
labelled with its slot and ratio.

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

`GEO` in `lib/constants.ts` is `null`, so the JSON-LD currently ships without
a `geo` block — a guessed pin is worse than no pin. Once the API key is in
place, resolve the real coordinates:

```bash
npm run place:geo
```

It prints a line to paste straight into `lib/constants.ts`.

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
  per night or per stay hasn't been confirmed, so the site doesn't say. The
  worked examples in the "What it costs" section are computed from the same
  constants as the menu, so the arithmetic can't drift.
- **No tariff.** Room rates aren't published anywhere in the source material,
  so they go through WhatsApp.
- **Raita** is printed on the breakfast page of the menu card but belongs to
  the dinner set. It's placed with dinner, with a note explaining the
  discrepancy to anyone holding the printed card.
