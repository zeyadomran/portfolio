/** Public identity and canonical URLs shared by metadata, structured data, and crawlers. */
export const site = {
  name: "Zeyad Omran",
  url: "https://zeyadomran.com/",
  title: "Zeyad Omran | Software Developer & Interface Design",
  description:
    "Software developer at IBM focused on clear interfaces. Explore Zeyad Omran's work in AI assistants, reusable UI builders and frontend optimization.",
  socialImageAlt:
    "Zeyad Omran. Complexity, made human. Software developer at IBM.",
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
      hasPart: [
        {
          "@type": "WebPageElement",
          "@id": siteUrl("#assistant"),
          url: siteUrl("#assistant"),
          name: "AI Assistant",
          description:
            "Frontend delivery of an AI assistant with expandable workspaces that keep tasks and conversation together.",
          isPartOf: { "@id": siteUrl("#profile") },
        },
        {
          "@type": "WebPageElement",
          "@id": siteUrl("#systems"),
          url: siteUrl("#systems"),
          name: "Modularity",
          description:
            "Shared frontend components and UI builders that help teams deliver new pages and use cases faster.",
          isPartOf: { "@id": siteUrl("#profile") },
        },
        {
          "@type": "WebPageElement",
          "@id": siteUrl("#optimization"),
          url: siteUrl("#optimization"),
          name: "Optimization",
          description:
            "Frontend performance optimization using parallel execution and early exit guards, reducing reported rendering time from eight seconds to three.",
          isPartOf: { "@id": siteUrl("#profile") },
        },
      ],
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
        "AI assistant interfaces",
        "Reusable UI builders",
        "Frontend performance optimization",
        "React",
        "Angular",
        "NgRx",
        "Next.js",
        "TypeScript",
        "Web accessibility",
      ],
    },
  ],
};
