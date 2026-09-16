import { EditorialPortfolio } from "@/components/editorial/portfolio";
import { portfolioStructuredData } from "@/lib/seo";

export default function PortfolioPage() {
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
    </>
  );
}
