import { NextResponse } from "next/server";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { GOOGLE_PLACE_ID, MAPS_URL } from "@/lib/constants";

export const runtime = "nodejs";
// Cached for a day: we are not paying Google per visitor.
export const revalidate = 86400;

export interface NormalisedReview {
  author: string;
  authorPhoto: string | null;
  authorUrl: string | null;
  rating: number;
  text: string;
  relativeTime: string;
}

export interface ReviewsPayload {
  ok: boolean;
  rating: number | null;
  count: number | null;
  mapsUrl: string;
  reviews: NormalisedReview[];
}

/** Lowest star rating a review needs to be shown on the page. */
const MIN_RATING = 4;

/** How many review cards the page shows. */
const REVIEWS_SHOWN = 3;

const EMPTY: ReviewsPayload = {
  ok: false,
  rating: null,
  count: null,
  mapsUrl: MAPS_URL,
  reviews: [],
};

/** Fetches the place from Google. Throws on any failure, including a non-2xx response. */
async function fetchPlace(key: string, placeId: string): Promise<Record<string, any>> {
  const res = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
    {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask":
          "rating,userRatingCount,reviews,googleMapsUri,location,displayName",
      },
      // Next only stores 200 responses in its fetch cache, so a failed
      // call is never remembered here.
      next: { revalidate },
    },
  );
  if (!res.ok) {
    throw new Error(`Places API responded ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

/**
 * Google Places API (New). The key is server-side only — it is read from
 * process.env here and never reaches the client bundle.
 *
 * Google returns at most 5 reviews; that is their limit, not ours. Of
 * those, the page shows only 4- and 5-star reviews, longest text first, up
 * to three. If none qualify the list is empty and the section falls back to
 * the Maps link. The aggregate rating and count are Google's figures for
 * every review, and are passed through unfiltered.
 *
 * Attribution (author name, photo, link) is required by Google's terms and
 * is rendered by ReviewCard.
 *
 * This route is prerendered at build and regenerated once a day. Whatever it
 * returns replaces the cached copy, so a Google failure must not *return*
 * the empty fallback: that would replace good reviews with nothing for a
 * whole day. Outside the build it *throws* instead. Next then keeps serving
 * the last good copy and tries again on the next request after that.
 *
 * During `next build` there is no earlier copy to keep, and a throw would
 * fail the deploy over a third-party outage. So the build alone falls back
 * to EMPTY, which the next daily regeneration replaces.
 *
 * A missing key isn't an outage. It's how the site is configured, and it
 * can't change without a redeploy, so it always gets the empty payload.
 */
export async function GET() {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID ?? GOOGLE_PLACE_ID;

  if (!key) {
    console.warn("[reviews] GOOGLE_MAPS_API_KEY not set");
    return NextResponse.json(EMPTY, { status: 200 });
  }

  let data: Record<string, any>;
  try {
    data = await fetchPlace(key, placeId);
  } catch (err) {
    if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
      console.error("[reviews] request failed during build — shipping the empty fallback", err);
      return NextResponse.json(EMPTY, { status: 200 });
    }
    console.error("[reviews] request failed — keeping the last cached copy", err);
    throw err;
  }

  const reviews: NormalisedReview[] = (data.reviews ?? [])
    .map((r: Record<string, any>) => ({
      author: r.authorAttribution?.displayName ?? "Google guest",
      authorPhoto: r.authorAttribution?.photoUri ?? null,
      authorUrl: r.authorAttribution?.uri ?? null,
      rating: Number(r.rating ?? 0),
      text: r.originalText?.text ?? r.text?.text ?? "",
      relativeTime: r.relativePublishTimeDescription ?? "",
    }))
    .filter((r: NormalisedReview) => r.text.trim().length > 0 && r.rating >= MIN_RATING)
    // Longest text first; equal lengths fall back to the higher rating.
    .sort(
      (a: NormalisedReview, b: NormalisedReview) =>
        b.text.trim().length - a.text.trim().length || b.rating - a.rating,
    )
    .slice(0, REVIEWS_SHOWN);

  // Never hand Google's raw payload to the client.
  return NextResponse.json({
    ok: true,
    rating: typeof data.rating === "number" ? data.rating : null,
    count: typeof data.userRatingCount === "number" ? data.userRatingCount : null,
    mapsUrl: data.googleMapsUri ?? MAPS_URL,
    reviews,
  } satisfies ReviewsPayload);
}
