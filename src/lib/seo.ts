/** Public identity and canonical URLs shared by metadata, structured data, and crawlers. */
export const site = {
  name: "Zeyad Omran",
  url: "https://zeyadomran.com/",
  title: "Zeyad Omran | Software Developer at IBM",
  description:
    "Zeyad Omran is a software developer at IBM building intuitive interfaces, reusable frontend systems, and practical AI tools. Explore his work and experience.",
  socialImageAlt:
    "Zeyad Omran — Software Developer at IBM. Intuitive interfaces and practical AI tools.",
  profiles: [
    "https://linkedin.com/in/zeyadomran",
    "https://github.com/zeyadomran",
  ],
} as const;

export const isPreviewDeployment =
  process.env.VERCEL_ENV === "preview" ||
  process.env.VERCEL_ENV === "development";

export function siteUrl(path = "/") {
  return new URL(path, site.url).href;
}

export const portfolioStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": siteUrl("#website"),
      url: site.url,
      name: site.name,
      description: site.description,
      inLanguage: "en-CA",
      publisher: { "@id": siteUrl("#person") },
    },
    {
      "@type": "ProfilePage",
      "@id": siteUrl("#profile"),
      url: site.url,
      name: site.title,
      description: site.description,
      inLanguage: "en-CA",
      isPartOf: { "@id": siteUrl("#website") },
      mainEntity: { "@id": siteUrl("#person") },
    },
    {
      "@type": "Person",
      "@id": siteUrl("#person"),
      name: site.name,
      url: site.url,
      jobTitle: "Software Developer",
      description: site.description,
      mainEntityOfPage: { "@id": siteUrl("#profile") },
      sameAs: site.profiles,
      worksFor: { "@type": "Organization", name: "IBM" },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "University of Calgary",
      },
      knowsAbout: [
        "Frontend development",
        "Human-computer interaction",
        "AI agents",
        "React",
        "Next.js",
        "TypeScript",
        "Web accessibility",
      ],
    },
  ],
};
