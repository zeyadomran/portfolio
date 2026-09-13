import { Header } from "@/components/portfolio/header";
import { Hero } from "@/components/portfolio/hero";
import { About } from "@/components/portfolio/about";
import { Work } from "@/components/portfolio/work";
import { Contact } from "@/components/portfolio/contact";
import { Footer } from "@/components/portfolio/footer";
import { PortfolioMotion } from "@/components/portfolio/motion";

export default function PortfolioPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="viewport-probe" aria-hidden="true" />
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Work />
        <Contact />
      </main>
      <Footer />
      <PortfolioMotion />
    </>
  );
}
