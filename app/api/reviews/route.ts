import { NextResponse } from "next/server";
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

const EMPTY: ReviewsPayload = {
  ok: false,
  rating: null,
  count: null,
  mapsUrl: MAPS_URL,
  reviews: [],
};

/**
 * Google Places API (New). The key is server-side only — it is read from
 * process.env here and never reaches the client bundle.
 *
 * Google returns at most 5 reviews; that is their limit, not ours.
 * Attribution (author name, photo, link) is required by Google's terms and
 * is rendered by ReviewCard.
 */
export async function GET() {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID ?? GOOGLE_PLACE_ID;

  if (!key) {
    console.warn("[reviews] GOOGLE_MAPS_API_KEY not set");
    return NextResponse.json(EMPTY, { status: 200 });
  }

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask":
            "rating,userRatingCount,reviews,googleMapsUri,location,displayName",
        },
        next: { revalidate },
      },
    );

    if (!res.ok) {
      console.error("[reviews] places responded", res.status, await res.text());
      return NextResponse.json(EMPTY, { status: 200 });
    }

    const data = await res.json();

    const reviews: NormalisedReview[] = (data.reviews ?? [])
      .map((r: Record<string, any>) => ({
        author: r.authorAttribution?.displayName ?? "Google guest",
        authorPhoto: r.authorAttribution?.photoUri ?? null,
        authorUrl: r.authorAttribution?.uri ?? null,
        rating: Number(r.rating ?? 0),
        text: r.originalText?.text ?? r.text?.text ?? "",
        relativeTime: r.relativePublishTimeDescription ?? "",
      }))
      .filter((r: NormalisedReview) => r.text.trim().length > 0);

    // Never hand Google's raw payload to the client.
    return NextResponse.json({
      ok: true,
      rating: typeof data.rating === "number" ? data.rating : null,
      count: typeof data.userRatingCount === "number" ? data.userRatingCount : null,
      mapsUrl: data.googleMapsUri ?? MAPS_URL,
      reviews,
    } satisfies ReviewsPayload);
  } catch (err) {
    console.error("[reviews] request failed", err);
    return NextResponse.json(EMPTY, { status: 200 });
  }
}
