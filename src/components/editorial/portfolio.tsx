import {
  Navigation,
  HeroFigure,
  AssistantFigure,
  BuilderFigure,
  PerformanceFigure,
  CopyEmail,
  Arrow,
  StoryMotion,
} from "./interactions";

function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <p className="section-label flex items-center">
      <span className="tiny-square" />
      {number}
      <span>{children}</span>
    </p>
  );
}

const caseStudies = [
  ["assistant", "1.1", "AI assistant", "Proof of concept to production"],
  ["systems", "1.2", "Modularity", "A shared table across 50+ pages"],
  ["optimization", "1.3", "Optimization", "Eight seconds to three at 50 rows"],
];

export function EditorialPortfolio() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
      <StoryMotion />
      <main id="main" tabIndex={-1}>
        <section
          className="ed-hero ed-wrap flex flex-col"
          id="home"
          data-chapter
          aria-labelledby="hero-title"
        >
          <div className="hero-meta flex justify-between text-muted">
            <span>SOFTWARE DEVELOPER AT IBM</span>
            <span>ENGINEERING × HUMAN COMPUTER INTERACTION</span>
          </div>
          <div className="hero-composition grid flex-1 items-center">
            <div className="hero-copy relative z-[2]">
              <h1 id="hero-title">
                Complexity,
                <br />
                made <span>human.</span>
              </h1>
              <div className="hero-intro">
                <p>
                  I’m Zeyad. I build interfaces that help people understand
                  what’s in front of them and what to do next.
                </p>
                <a
                  className="editorial-link inline-flex items-center"
                  href="#work"
                >
                  Explore my work
                  <Arrow />
                </a>
              </div>
            </div>
            <HeroFigure />
          </div>
        </section>

        <section
          className="work-intro ed-wrap grid"
          id="work"
          data-chapter
          aria-labelledby="work-title"
        >
          <SectionLabel number="01">SELECTED WORK</SectionLabel>
          <div>
            <h2 id="work-title">A clearer path. At every level.</h2>
            <p>
              My work spans AI assistant interfaces, reusable UI builders and
              rendering performance.
            </p>
          </div>
          <ol className="work-index grid" aria-label="Case studies">
            {caseStudies.map(([id, number, title, note]) => (
              <li key={id}>
                <a className="flex items-center" href={`#${id}`}>
                  <span className="work-index-number">{number}</span>
                  <span className="work-index-text">
                    <span className="font-display">{title}</span>
                    <span>{note}</span>
                  </span>
                  <Arrow down />
                </a>
              </li>
            ))}
          </ol>
        </section>

        <article
          className="case-section ed-wrap"
          id="assistant"
          data-chapter
          data-nav="work"
          aria-labelledby="assistant-title"
        >
          <div className="case-header flex justify-between">
            <span>1.1 / AI ASSISTANT</span>
            <span>IBM · SOFTWARE DEVELOPER</span>
          </div>
          <div className="case-grid grid items-start">
            <div className="case-intro">
              <p className="eyebrow">AI ASSISTANT INTERFACES</p>
              <h3 id="assistant-title">
                An answer is only
                <br />
                the beginning.
              </h3>
              <p className="case-lead">
                The useful part is what someone can do with it.
              </p>
              <p className="case-role">
                My role · Frontend architecture & delivery
              </p>
            </div>
            <AssistantFigure />
            <div className="case-copy">
              <p>
                I led the frontend architecture and delivery of an AI assistant
                from proof of concept to production, working with five partner
                teams. I also pushed for workspaces that open to the left of a
                full height assistant panel. In internal builds, forms and
                embedded reports fill the remaining space, so people can work
                while keeping the conversation in view.
              </p>
              <div className="case-facts flex">
                <div>
                  <strong>5</strong>
                  <span>partner teams</span>
                </div>
                <div>
                  <strong>10</strong>
                  <span>supported locales</span>
                </div>
              </div>
              <details className="story-detail">
                <summary>
                  Behind the work
                  <span className="detail-plus" aria-hidden="true" />
                </summary>
                <div>
                  <h4>The challenge</h4>
                  <p>
                    Bring a conversational experience into an existing
                    enterprise application, with the consistency and behavior
                    people expect from the rest of the product.
                  </p>
                  <h4>My contribution</h4>
                  <p>
                    I led frontend architecture and release planning, defined
                    API contracts with the backend team, and integrated a React
                    chat interface into an Angular application. I worked across
                    product, design, content, backend and design system teams.
                  </p>
                  <h4>A decision under a deadline</h4>
                  <p>
                    The component library could not support conversation history
                    in time for the preview release. I built custom history
                    search, rename and delete, and coordinated accessibility
                    fixes with the design system team, so the release kept its
                    planned date.
                  </p>
                  <h4>What shipped</h4>
                  <p>
                    The preview release covers documentation help, feedback and
                    conversation history. The workspace tasks, including forms
                    and embedded reports, were built internally and have not
                    been released.
                  </p>
                  <h4>The principle</h4>
                  <p>
                    An assistant should make the next action clearer. The
                    interface around an answer matters as much as the answer
                    itself.
                  </p>
                  <p className="story-tools">
                    React · Angular · TypeScript · Accessibility · Localization
                  </p>
                </div>
              </details>
            </div>
          </div>
        </article>

        <article
          className="case-section case-systems ed-wrap"
          id="systems"
          data-chapter
          data-nav="work"
          aria-labelledby="systems-title"
        >
          <div className="case-header flex justify-between">
            <span>1.2 / MODULARITY</span>
            <span>IBM · SHARED FRONTEND PLATFORMS</span>
          </div>
          <div className="case-grid grid items-start">
            <div className="case-intro">
              <p className="eyebrow">REUSABLE INTERFACES & UI BUILDERS</p>
              <h3 id="systems-title">
                Build it well.
                <br />
                Build on it.
              </h3>
              <p className="case-lead">
                Reusable components make new pages faster to deliver.
              </p>
              <p className="case-role">
                My role · Shared components & UI builder expansion
              </p>
            </div>
            <BuilderFigure />
            <div className="case-copy">
              <p>
                I built shared frontend widgets and product pages, and
                redesigned how widgets coordinate and share data. I also led the
                expansion of Angular UI builders, so charts, tables and filters
                can be configured without writing JSON by hand. The goal was to
                deliver new pages and use cases faster without rebuilding the
                same interfaces.
              </p>
              <div className="case-facts flex">
                <div>
                  <strong>50+</strong>
                  <span>product pages use the shared table</span>
                </div>
                <div>
                  <strong>3</strong>
                  <span>shared packages across two teams</span>
                </div>
              </div>
              <details className="story-detail">
                <summary>
                  Behind the work
                  <span className="detail-plus" aria-hidden="true" />
                </summary>
                <div>
                  <h4>The challenge</h4>
                  <p>
                    Shared interfaces need room to support different workflows
                    without repeating the same work across every page.
                  </p>
                  <h4>My contribution</h4>
                  <p>
                    I expanded UI builder capabilities, added raw source viewing
                    and editing, and introduced NgRx patterns for widget data
                    dependencies and reuse. In separate table work, I
                    architected a TanStack Table component used across 50+
                    product pages. It kept existing configurations, so migrating
                    a table meant changing only its widget type.
                  </p>
                  <p>
                    I also published three TypeScript packages, used by three
                    repositories and two teams, for shared components, messaging
                    between the application shell and its pages, and loading
                    states.
                  </p>
                  <h4>The principle</h4>
                  <p>
                    Reusable components and configuration help teams deliver new
                    pages and use cases quickly, with consistent behavior across
                    the product.
                  </p>
                  <p className="story-tools">
                    Angular · NgRx · React · TanStack Table · Shared packages
                  </p>
                </div>
              </details>
            </div>
          </div>
        </article>

        <article
          className="case-section ed-wrap"
          id="optimization"
          data-chapter
          data-nav="work"
          aria-labelledby="optimization-title"
        >
          <div className="case-header flex justify-between">
            <span>1.3 / OPTIMIZATION</span>
            <span>IBM · INTERFACE PERFORMANCE</span>
          </div>
          <div className="case-grid grid items-start">
            <div className="case-intro">
              <p className="eyebrow">RENDERING PERFORMANCE</p>
              <h3 id="optimization-title">
                Faster rendering.
                <br />
                Less waiting.
              </h3>
              <p className="case-lead">
                From sequential work to parallel execution.
              </p>
              <p className="case-role">
                My role · Rendering performance optimization
              </p>
            </div>
            <PerformanceFigure />
            <div className="case-copy">
              <p>
                I optimized a shared parsing path used across 100+ product
                pages. In the reported 50 row table scenario, rendering time
                fell from eight seconds to three.
              </p>
              <div className="case-facts flex">
                <div>
                  <strong>62%</strong>
                  <span>less rendering time at 50 rows</span>
                </div>
                <div>
                  <strong>100+</strong>
                  <span>product pages share the path</span>
                </div>
              </div>
              <details className="story-detail">
                <summary>
                  Behind the work
                  <span className="detail-plus" aria-hidden="true" />
                </summary>
                <div>
                  <h4>The challenge</h4>
                  <p>
                    A shared field template parser, used by widgets and layouts
                    across the product, relied on sequential promise work. At 50
                    rows, a table took about eight seconds to render.
                  </p>
                  <h4>My contribution</h4>
                  <p>
                    I replaced sequential promise work with parallel execution
                    and added early exit guards. The reported rendering time
                    fell from eight seconds to three. This was a separate
                    optimization from the shared table replacement.
                  </p>
                  <h4>The principle</h4>
                  <p>
                    Run independent work in parallel, exit early when possible,
                    and measure the effect on rendering time.
                  </p>
                  <p className="story-tools">
                    Frontend performance · Async execution · Table parsing
                  </p>
                </div>
              </details>
            </div>
          </div>
        </article>

        <section
          className="about-section"
          id="about"
          data-chapter
          aria-labelledby="about-title"
        >
          <div className="ed-wrap">
            <SectionLabel number="02">ABOUT</SectionLabel>
            <div className="about-grid grid">
              <h2 id="about-title">
                I care about
                <br />
                what happens
                <br />
                <span>
                  on the other side
                  <br />
                  of the screen.
                </span>
              </h2>
              <div className="about-copy">
                <p className="about-statement">
                  I enjoy making complex systems easier to use, and building
                  shared tools that other developers can build on.
                </p>
                <p>
                  It started with spending my free time exploring websites on
                  Behance and Awwwards. I was drawn to what people could make a
                  website feel like. Studying human computer interaction gave
                  that curiosity a more useful question: how can the design use
                  its space well and make an interface clearer and easier to
                  use?
                </p>
                <p>
                  That question follows me into my work at IBM: collaborating
                  with designers, building shared interfaces and thinking about
                  how AI can fit into a real workflow. I enjoy the visual craft,
                  but I care just as much about whether someone knows what to do
                  next.
                </p>
              </div>
            </div>
            <div className="experience grid">
              <div>
                <span className="eyebrow">EXPERIENCE</span>
              </div>
              <ol>
                <li>
                  <span>JUN 2024 TO PRESENT</span>
                  <div>
                    <h3>Software Developer</h3>
                    <p>IBM · Markham, Ontario</p>
                    <p>
                      AI assistant interfaces, reusable frontend systems and AI
                      developer tooling for supply chain, environmental risk,
                      sustainability and order management products.
                    </p>
                  </div>
                </li>
                <li>
                  <span>MAY 2022 TO MAY 2024</span>
                  <div>
                    <h3>Frontend Developer Intern</h3>
                    <p>IBM</p>
                    <p>
                      Dashboards and interfaces for climate risk and supply
                      chain applications.
                    </p>
                  </div>
                </li>
                <li>
                  <span>SEP 2019 TO JUN 2024</span>
                  <div>
                    <h3>Computer Science, BSc</h3>
                    <p>University of Calgary</p>
                    <p>Human Computer Interaction concentration</p>
                  </div>
                </li>
              </ol>
            </div>
            <div className="toolkit grid">
              <span className="eyebrow">RECOGNITION</span>
              <p>
                IBM Growth Award, 2025 /<br />
                Developer Jumpstart Judge’s Choice, team award
              </p>
            </div>
            <div className="toolkit grid">
              <span className="eyebrow">SKILLS</span>
              <p>
                React / Angular / TypeScript / NgRx /<br />
                Next.js / AI assisted development
              </p>
            </div>
          </div>
        </section>

        <section
          className="writing-section ed-wrap"
          id="writing"
          data-chapter
          aria-labelledby="writing-title"
        >
          <SectionLabel number="03">WRITING</SectionLabel>
          <div className="writing-grid grid">
            <div>
              <p className="eyebrow">DESIGN BLOG</p>
              <h2 id="writing-title">
                Behind the
                <br />
                <span>Interface.</span>
              </h2>
            </div>
            <div className="writing-copy">
              <p>
                I write about the design decisions behind interesting websites,
                from typography and layout to motion and interaction.
              </p>
              <p>
                An open research notebook, with interactive stories and a closer
                look at the details that shape an experience.
              </p>
              <a
                className="editorial-link inline-flex items-center"
                href="https://design.zeyadomran.com/"
                target="_blank"
                rel="noreferrer"
              >
                Explore the design blog
                <Arrow diagonal />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <span className="writing-domain">design.zeyadomran.com</span>
            </div>
          </div>
        </section>
      </main>
      <footer className="contact-screen">
        <section
          className="contact-section ed-wrap"
          id="links"
          data-chapter
          aria-labelledby="contact-title"
        >
          <SectionLabel number="04">START A CONVERSATION</SectionLabel>
          <div className="contact-intro grid items-end">
            <h2 id="contact-title">
              Something complex?
              <br />
              <span>Let’s make it clear.</span>
            </h2>
            <p>
              I’m interested in thoughtful products, difficult problems and
              teams that care about the people using what they build.
            </p>
          </div>
          <a
            className="email-link flex items-center justify-between font-display"
            href="mailto:ziomran@gmail.com"
          >
            <span>ziomran@gmail.com</span>
            <Arrow diagonal />
          </a>
          <div className="contact-bottom flex items-center justify-between">
            <div className="contact-actions">
              <CopyEmail />
              <a
                className="resume-download"
                href="/Zeyad_Omran_Resume.pdf"
                download="Zeyad_Omran_Resume.pdf"
              >
                Resume
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />
                </svg>
                <span className="sr-only"> (PDF)</span>
              </a>
            </div>
            <div>
              <a
                href="https://linkedin.com/in/zeyadomran"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
                <Arrow diagonal />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a
                href="https://github.com/zeyadomran"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
                <Arrow diagonal />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </section>
        <div className="ed-footer ed-wrap">
          <p className="footer-name flex items-center justify-between font-display text-ink whitespace-nowrap">
            Zeyad Omran
          </p>
          <div>
            <span>© {new Date().getFullYear()}</span>
            <a className="back-to-top" href="#home">
              Back to top ↑
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
