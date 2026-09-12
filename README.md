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

> ### ⚠️ Seven slots currently hold **temporary phone photos**
>
> Added **2026-09-07** as stand-ins. They are ordinary phone-camera snaps,
> **not** the final professional set, and the proper shoot is expected within
> **1–2 weeks**. `hero.jpg`, `arrival.jpg`, `dining.jpg`, `rooms.jpg`,
> `pool-02.jpg`, `rain-dance-02.jpg` and `og.jpg` are all due for
> replacement — overwrite
> them at the same paths when the real photographs land. The same warning is
> repeated in the doc comment at the top of `components/PhotoWindow.tsx`.
>
> **Two of them also changed the copy around them.** See *Copy tied to a
> stand-in* below — that wording needs revisiting when the photos are
> replaced.

Every photo slot has a **locked aspect ratio**. Replace the file at the exact
path below, keeping the same filename and roughly the same ratio, and nothing
else needs to change — no layout shift, no code edits.

| Replace this file | Ratio | Status | Where it appears |
|---|---|---|---|
| `public/photos/hero.jpg` | 16:9 | ⚠️ **Temp phone photo** | Masthead — full-bleed background, blurred *(not a `PhotoWindow` slot; rendered directly by `Masthead.tsx`)* |
| `public/photos/arrival.jpg` | 3:2 | ⚠️ **Temp phone photo** | Getting here — the approach *(stand-in shows the paved drive, not the kutcha road)* |
| `public/photos/pool-01.jpg` | 4:5 | Placeholder, unused | Pool, portrait *(the animated `PoolSurface` renders instead; drop a photo in and swap it into `components/Afternoon.tsx` if you'd rather show the real thing)* |
| `public/photos/pool-02.jpg` | 3:2 | ⚠️ **Temp phone photo** | Afternoon — pool, wide |
| `public/photos/rain-dance-01.jpg` | 4:5 | Placeholder, unused | Rain dance, portrait *(same note as pool-01)* |
| `public/photos/rain-dance-02.jpg` | 3:2 | ⚠️ **Temp phone photo** | Afternoon — rain dance, wide, people under it |
| `public/photos/rooms.jpg` | 3:2 | ⚠️ **Temp phone photo** | The rooms |
| `public/photos/dining.jpg` | 3:2 | ⚠️ **Temp phone photo** | Snacks & starters *(stand-in shows the garden seating, not a laid table)* |
| `public/photos/night.jpg` | 16:9 | **Not rendered** | The kitchen closes — *the section is deliberately text-only; see `components/NightClose.tsx`* |
| `public/photos/og.jpg` | 1200×630 | ⚠️ **Temp phone photo** | Social preview card (WhatsApp, Twitter, Facebook) |

**The closing section renders no photo at all.** The phone batch was shot
entirely in daylight, and a daytime frame under a section about the kitchen
shutting at 10:30 PM would be its own kind of misleading — so rather than
leave a placeholder graphic sitting there, `components/NightClose.tsx` drops
the slot and lays the section out as a text-only block.

That is meant to be reversible. Once real night photographs exist, the doc
comment at the top of `NightClose.tsx` gives the exact three-line change that
puts a `PhotoWindow` back — re-import it, restore the two-column grid wrapper,
add the element. Nothing outside that file is involved. The `night.jpg`
placeholder file is left in `public/photos` so the path stays valid.

**Shot list for the real photographs** — three subjects nothing in the phone
batch covers: the **kutcha approach road** itself, a **laid table with food on
it**, and **anything after dark**.

### Copy tied to a stand-in

Two slots had their image copy rewritten so it doesn't claim something the
stand-in doesn't show. Revisit both when the real photographs land:

| File | What changed | Why |
|---|---|---|
| `components/GettingHere.tsx` | Caption is now *“The drive up to the house, once the rough stretch is behind you.”* — it was *“The last kutcha stretch”*. Alt text follows. | The stand-in is interlocking pavers. The old caption labelled the pictured surface unpaved, which the photo flatly contradicts. |
| `app/page.tsx` | Alt text is now *“Garden table and chairs on the lawn”* — it was *“Snacks being served”*. | Nothing is being served in the stand-in. |

**The prose is untouched in both cases.** The paragraph beside the arrival
photo still describes the kutcha road in full — it reads as a description of
the journey rather than a caption on the image, so it stands on its own
without a photograph backing it up.

### Contrast

Text colours are held to WCAG AA — 4.5:1 for body text, 3:1 for large text —
measured by compositing the real painted layers, not by eye. Two palette
facts follow from that and shouldn't be reverted casually:

- **`--color-terracotta` is `#a04d24`.** It carries text in both directions
  (as link and phone colour on paper, and as the fill beneath paper-coloured
  button labels such as *Call now*, *Calculate Cost* and *Send this on
  WhatsApp*). The original `#b85c2e` scored 3.98:1 and failed both ways.
- **Muted small caps sit at `opacity-70`, not `opacity-55`.** At 55% the
  eyebrows and the NowPill label scored 3.56:1 and 3.65:1. At 70% they clear
  5.69:1 and 5.88:1, and the same lift helps the dark segments too.

A full-page sweep after that change measured 290 text elements: 46 moved from
fail to pass, and nothing regressed. **44 still fail** — small print at other
opacity levels (`opacity-40`, `-50`, `-60`) that this change didn't touch,
mostly notes and unit labels in the pricing and menu sections. Worth a pass
of its own; the lowest is 2.7:1 on the calculator's *"Your total will appear
here."* placeholder.

### The masthead photograph

The masthead is a full-bleed photograph of the farm, deliberately blurred,
under a vignette mixed from `--color-dusk`.

**This reverses an earlier decision, on purpose.** The creative direction
rules out "a headline over a darkened photo" as the generic template look,
and an earlier revision honoured that literally by framing the photo beside
the text instead. The current treatment goes the other way, and leans on two
things to keep it from being the generic pattern:

- **The blur is the point, not a workaround.** The photograph reads as
  atmosphere — shapes, colour, the light off the white walls and the green —
  rather than as a picture you are meant to inspect. It is also what makes a
  1280px phone snap safe to stretch across a 2560px display: there is no fine
  detail left to go soft. Compared at 8, 10, 12 and 22px and settled at
  **10px**: soft enough to be atmosphere, specific enough that you can see a
  white house with a red tile roof and palms in front of it within a second.
  At 22px the building stopped being a building; at 8px it still read as a
  photograph someone failed to focus. No pixels show at 10px — checked by
  zooming 2x into the highest-contrast area in the frame, the white wall
  against the red roof tiles.
- **The vignette is dusk indigo, never black.** Every stop is
  `color-mix`ed from `var(--color-dusk)`, so re-tinting that token re-tints
  the masthead. A black scrim is exactly what makes this pattern look like
  everyone else's.

#### On phones it is a different vignette

The desktop shape is wrong on a phone and had to be split. There, text sits
in the left column and the darkness is weighted to match; on a 390px screen
the same gradient holds 93% across half the viewport and leaves the picture
nowhere to show, which is what made the masthead read as a grey-blue smear
on a real device. Below `md` the horizontal and vertical passes are replaced
by a single even-handed vertical one.

`object-position` is also explicit below `md`. At 390px only about **28% of
the frame's width** survives `object-cover`, and the centred slice is blank
wall and sky — the roofline, the tower and the palms all sit to the right of
it. `83%` lands that slice on them. Zooming further (a larger `scale`) was
tried and is worse: the tower fills the frame as one soft mass and takes the
roofline and palms with it. Recognition comes from seeing several things at
once, not from magnifying one.

The mobile vignette is kept as light as it can be. Measured at 360, 375,
390, 414 and 430, a heavier version scored identically, because with the
phone number set large nothing photo-dependent is the binding constraint any
more — see `.phone-hero` in `globals.css`. Darkening past this buys no
contrast and costs picture.

#### The vignette is measured, not eyeballed

Text over a photograph has no single background colour, so it can't be
checked the way flat text can. The real composite — the photo, blurred, under
all three layers — is rebuilt in a canvas and sampled pixel by pixel under
every text box, taking the **worst** pixel.

That measurement drove the shape. An even wash dark enough to carry the text
flattened the photograph everywhere, so the darkness is concentrated where
the words are instead: held almost flat across the left 46%, then falling
away steeply, which buys the right-hand side back for the picture. A vertical
pass pulls down the sky, which is the brightest thing in the frame and sits
directly behind the eyebrow and the wordmark.

Softening the blur costs contrast — a less-blurred photograph has more local
variation, so text sits over brighter pixels. Going from 22px to 10px did not
break anything outright (the tightest, the phone number, held at 4.83) but it
thinned the worst margin to +0.26, which is not enough to trust at viewport
widths that crop the photograph differently. The vignette was strengthened to
recover it rather than the blur being put back. Past the current values there
is nothing left to gain: the floor becomes the Call now button at 5.12, which
sits on its own terracotta fill and never touches the photograph.

**The binding constraint is the phone number.** `.phone` is firelight on dark
grounds — a light amber — so it needs a genuinely dark backdrop to clear
4.5:1. It, not the wordmark, sets how heavy the left side has to be. The
address eyebrow also drops its usual `opacity-70` here and runs at full
strength; muted, it measured 3.15:1 against the bright end of the sky.

Worst-case ratios at 1470px wide, down the page: **5.41, 4.97** (wordmark,
large text, needs 3), **9.60, 7.14, 13.04, 9.90, 5.12, 9.91, 4.98, 7.70** —
all ten passing, the phone number the tightest at 4.98.

**The sticky contact bar hides on phones while the masthead is on screen.**
The masthead carries its own Call now and Enquire, and at that width the two
sat almost touching — "Call now" printed twice a few pixels apart, reading as
a bug rather than an offer. It returns once the masthead is scrolled past.
Desktop is unaffected: there the bar is a small pill in the bottom-right,
nowhere near the masthead's buttons. Without JavaScript a `<noscript>` rule
puts the bar back, so a contact route is never lost.

If you change the photograph, the blur, or any vignette stop, **re-run that
measurement** — the numbers above are specific to this image. A brighter
photo, or one where the sky sits lower, moves every one of them.

The animated pool and rain dance in `components/Afternoon.tsx` were
deliberately left in place — `pool-02.jpg` and `rain-dance-02.jpg` are
separate photo slots below them, so the interactive set-pieces are untouched.

The raw phone uploads are **not** in the repo: `temp photos/` is gitignored,
since the cropped, renamed, web-sized files in `public/photos` are what the
site actually serves.

**Rules**

- **Keep the filenames exactly as they are.** They're referenced in code.
- Keep the ratio close. The frame crops to fill, so a slightly different ratio
  is fine; a portrait photo in a 3:2 slot will lose its top and bottom.
- Target ~2400px on the long edge, around 500KB or less as JPEG.
- Anything you don't replace keeps rendering its placeholder. There are no
  broken images at any point, so you can swap them in one at a time.
- **Do `og.jpg` last** — it's the image that shows when someone shares the
  link, so make it the best one you have.

Slots marked *Placeholder* above are generated images in the site's own
palette, each labelled with its slot and ratio. Slots marked *Temp phone
photo* are real photographs of the farm, cropped to the locked ratio and
compressed for the web — good enough to ship, but replace them.

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
