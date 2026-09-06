#!/usr/bin/env node
/**
 * Resolves the farm's coordinates from the Google Places API so they can be
 * hard-coded into lib/constants.ts (GEO). Run once:
 *
 *   GOOGLE_MAPS_API_KEY=... npm run place:geo
 *
 * We hard-code the result rather than fetching at runtime: coordinates don't
 * move, and structured data shouldn't depend on a live API call.
 */
import { readFileSync } from "node:fs";

function envFromFile() {
  try {
    const raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* no .env.local, rely on the shell */
  }
}
envFromFile();

const key = process.env.GOOGLE_MAPS_API_KEY;
const placeId = process.env.GOOGLE_PLACE_ID ?? "ChIJsZmXpgMjDTkRbai01ZFSLcQ";

if (!key) {
  console.error("GOOGLE_MAPS_API_KEY is not set. Add it to .env.local first.");
  process.exit(1);
}

const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
  headers: {
    "X-Goog-Api-Key": key,
    "X-Goog-FieldMask": "location,formattedAddress,displayName,rating,userRatingCount",
  },
});

if (!res.ok) {
  console.error("Places API error", res.status, await res.text());
  process.exit(1);
}

const data = await res.json();
console.log("\n" + (data.displayName?.text ?? "(no name)"));
console.log(data.formattedAddress ?? "(no address)");
console.log(`rating: ${data.rating ?? "—"} from ${data.userRatingCount ?? 0} reviews`);
console.log("\nPaste this into lib/constants.ts:\n");
console.log(
  `export const GEO: { lat: number; lng: number } | null = { lat: ${data.location.latitude}, lng: ${data.location.longitude} };`,
);
