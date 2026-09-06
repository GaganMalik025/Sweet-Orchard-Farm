import type { Metadata } from "next";
import { Fraunces, Inter_Tight } from "next/font/google";
import "./globals.css";
import { ClockProvider } from "@/components/clock/ClockProvider";
import { StickyContact } from "@/components/StickyContact";
import { LocalBusinessSchema } from "@/components/LocalBusinessSchema";
import { SITE_URL, FARM_NAME, ADDRESS_LINE } from "@/lib/constants";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const TITLE = `${FARM_NAME} — farmhouse stay near Gurgaon`;
const DESCRIPTION =
  "A quiet farmhouse stay in the Aravalli hills near Gurgaon. Private tubewell-fed pool, rain dance, and meals on a fixed daily schedule. Sleeps 14.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s — ${FARM_NAME}`,
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  keywords: [
    "farmhouse stay near Gurgaon",
    "Aravalli farm stay",
    "private pool farmhouse Haryana",
    "rain dance farmhouse",
    "Garat Pur Bas",
    "family farm stay Gurgaon",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: FARM_NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_IN",
    images: [
      {
        url: "/photos/og.jpg",
        width: 1200,
        height: 630,
        alt: `${FARM_NAME} — ${ADDRESS_LINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/photos/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={`${fraunces.variable} ${interTight.variable}`}>
      <body>
        <LocalBusinessSchema />
        <ClockProvider>
          <a
            href="#breakfast"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
          >
            Skip to the day
          </a>
          {children}
          <StickyContact />
        </ClockProvider>
      </body>
    </html>
  );
}
