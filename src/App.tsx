import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { EditorialPortfolio } from "./components/editorial/portfolio";
import { portfolioStructuredData } from "./lib/seo";

export function App() {
  return (
    <>
      <script
        id="portfolio-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(portfolioStructuredData).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <EditorialPortfolio />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
