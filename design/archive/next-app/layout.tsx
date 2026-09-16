import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { isPreviewDeployment, site, siteUrl } from "@/lib/seo";
import "./globals.css";

const neueDisplay = localFont({
  src: [
    {
      path: "./fonts/PPNeueMontreal-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/PPNeueMontreal-Semibold.otf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-neue-display",
  display: "swap",
  preload: true,
});
const neueText = localFont({
  src: [
    {
      path: "./fonts/PPNeueMontrealText-Book.otf",
      weight: "375",
      style: "normal",
    },
  ],
  variable: "--font-neue-text",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: site.url },
  robots: {
    index: !isPreviewDeployment,
    follow: true,
    googleBot: {
      index: !isPreviewDeployment,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [
      {
        url: siteUrl("/opengraph-image"),
        alt: site.socialImageAlt,
        width: 1200,
        height: 630,
      },
    ],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#f1f3ef",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${neueDisplay.variable} ${neueText.variable}`}>
      <body>{children}</body>
    </html>
  );
}
