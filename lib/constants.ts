/**
 * Public business facts. Deliberately NOT environment variables — this is
 * information we print on the page, so it belongs somewhere greppable.
 */

export const FARM_NAME = "Sweet Orchard Farm";

export const PHONE_DISPLAY = "+91 95996 39580";
export const PHONE_TEL = "+919599639580";
export const WHATSAPP_NUMBER = "919599639580";

export const ADDRESS = {
  street: "Behind Shiv Temple, Garat Pur Bas",
  locality: "Garat Pur Bas",
  region: "Haryana",
  postalCode: "122101",
  country: "IN",
} as const;

export const ADDRESS_LINE = `Behind Shiv Temple, Garat Pur Bas, Haryana ${ADDRESS.postalCode}`;

export const GOOGLE_PLACE_ID = "ChIJsZmXpgMjDTkRbai01ZFSLcQ";

export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=Sweet%20Orchard%20Farm&query_place_id=${GOOGLE_PLACE_ID}`;

/**
 * Geo-coordinates for the LocalBusiness schema.
 *
 * Intentionally null until resolved from the Places API — see
 * `npm run place:geo`. We do not guess coordinates: a wrong pin in
 * structured data is worse than no pin at all.
 */
export const GEO: { lat: number; lng: number } | null = { lat: 28.3405286, lng: 77.0132445 };

export const OCCUPANCY = {
  kingRooms: 5,
  queenBedRooms: 1,
  queenBedsPerRoom: 2,
  maxGuests: 14,
} as const;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sweet-orchard-farm.vercel.app";


