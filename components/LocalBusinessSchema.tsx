import {
  ADDRESS,
  FARM_NAME,
  GEO,
  MAPS_URL,
  OCCUPANCY,
  PHONE_TEL,
  SITE_URL,
} from "@/lib/constants";

/**
 * Structured data. Two entities:
 *   - the LodgingBusiness itself, which has no opening hours (it's a stay)
 *   - the kitchen, which very much does
 *
 * `geo` is omitted entirely until real coordinates are resolved from the
 * Places API (`npm run place:geo`). A guessed pin is worse than no pin.
 */
export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": `${SITE_URL}/#farm`,
    name: FARM_NAME,
    description:
      "A quiet farmhouse stay in the Aravalli hills near Gurgaon, with a private pool filled from our own tubewell and properly chlorinated, a rain dance, and meals on a fixed daily schedule.",
    url: SITE_URL,
    telephone: PHONE_TEL,
    image: `${SITE_URL}/photos/og.jpg`,
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    hasMap: MAPS_URL,
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS.street,
      addressLocality: ADDRESS.locality,
      addressRegion: ADDRESS.region,
      postalCode: ADDRESS.postalCode,
      addressCountry: ADDRESS.country,
    },
    ...(GEO
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: GEO.lat,
            longitude: GEO.lng,
          },
        }
      : {}),
    numberOfRooms: OCCUPANCY.kingRooms + OCCUPANCY.queenBedRooms,
    maximumAttendeeCapacity: OCCUPANCY.maxGuests,
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Private swimming pool", value: true },
      { "@type": "LocationFeatureSpecification", name: "Tubewell-filled, chlorinated pool water", value: true },
      { "@type": "LocationFeatureSpecification", name: "Rain dance", value: true },
      { "@type": "LocationFeatureSpecification", name: "Attached washrooms", value: true },
      { "@type": "LocationFeatureSpecification", name: "Meals served on site", value: true },
    ],
    subOrganization: {
      "@type": "FoodEstablishment",
      name: `${FARM_NAME} kitchen`,
      servesCuisine: "Indian",
      priceRange: "₹₹",
      openingHoursSpecification: [
        { opens: "08:00", closes: "10:00", name: "Breakfast" },
        { opens: "13:00", closes: "15:00", name: "Lunch" },
        { opens: "18:30", closes: "20:30", name: "Snacks & starters" },
        { opens: "21:00", closes: "22:30", name: "Dinner" },
      ].map((s) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: s.opens,
        closes: s.closes,
        name: s.name,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      // Structured data is static and author-controlled.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
