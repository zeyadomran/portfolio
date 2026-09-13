import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
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
  title: "Zeyad Omran — Software Developer",
  description:
    "Zeyad Omran — software developer at IBM, building intuitive interfaces and practical AI tools.",
  openGraph: {
    title: "Zeyad Omran — Software Developer",
    description: "I build software that helps people do more, faster.",
    type: "website",
    locale: "en_CA",
  },
  twitter: { card: "summary" },
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
