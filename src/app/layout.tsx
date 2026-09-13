import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { isPreviewDeployment, site, siteUrl } from "@/lib/seo";
import "./globals.css";

const spaceMono = localFont({
  src: [
    {
      path: "../../public/assets/SpaceMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/assets/SpaceMono-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-space-mono",
  display: "swap",
  preload: true,
  adjustFontFallback: false,
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
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-motion="off" className={spaceMono.variable}>
      <body className="bg-background text-foreground font-mono">
        {children}
      </body>
    </html>
  );
}
