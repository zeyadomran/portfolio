import type { CSSProperties, ReactNode } from "react";
import { Navigation } from "./navigation";
import { FigLens } from "./fig-lens";
import { FigRace } from "./fig-race";
import { FigShared } from "./fig-shared";
import { FigAsk } from "./fig-ask";
import { CopyEmail } from "./copy-email";
import { Icon } from "./icon";
import { StoryDetail } from "./story-detail";
import { themeColors } from "../../lib/theme";

const stories = [
  {
    id: "assistant",
    kicker: "AI assistant",
    title: "An answer is only the beginning.",
    result: (
      <>
        Proof of concept <Icon name="right" /> production
      </>
    ),
    body: "I led the frontend of an AI assistant at IBM, from the first proof of concept all the way to production, alongside five other teams. The idea I pushed hardest for: open the work right next to the chat. In our internal builds, forms and reports sit beside the conversation, so you never lose your place.",
    facts: [
      ["Teams I worked with", "5"],
      ["Languages it speaks", "10"],
    ],
    detail: [
      [
        "What went wrong",
        "The component library couldn’t handle conversation history in time for the preview release. Rather than move the date, I built search, rename and delete myself and worked through the accessibility fixes with the design system team. We shipped on time.",
      ],
      [
        "What I took from it",
        "The answer is only half the job. The interface around it decides whether anyone can actually do something with it.",
      ],
      [
        "Release scope",
        "The preview release covers documentation help, feedback and conversation history. Workspace forms and embedded reports were built internally and have not been released.",
      ],
    ],
    stack: "React inside Angular · TypeScript · Accessibility · Localization",
    Figure: FigAsk,
  },
  {
    id: "systems",
    kicker: "Shared components",
    title: "Build it well. Build on it.",
    result: "One table, 50+ pages",
    body: "Team after team was rebuilding the same tables and charts. I worked on the shared pieces instead, and on UI builders that let people set up a chart, table or filter without hand-writing JSON. The table I built now runs on more than 50 pages, and moving an old one over means changing a single field.",
    facts: [
      ["Pages using the table", "50+"],
      ["Packages other teams use", "3"],
    ],
    detail: [
      [
        "How it worked",
        "The new table kept the old configuration format, so nobody had to rewrite anything to switch. I also published three small TypeScript packages, now used by two teams, for shared components, app-shell messaging and loading states.",
      ],
    ],
    stack: "Angular · NgRx · TanStack Table",
    Figure: FigShared,
  },
  {
    id: "optimization",
    kicker: "Performance",
    title: "Eight seconds to three.",
    result: "62% faster at 50 rows",
    body: "One of our tables took about eight seconds to appear with 50 rows. The culprit was a shared parser doing its work one step at a time. I let the independent steps run together and stop early when they could. Same table, about three seconds. That parser sits behind more than 100 pages.",
    facts: [
      ["Faster at 50 rows", "62%"],
      ["Pages behind that parser", "100+"],
    ],
    detail: [
      [
        "The rule I keep coming back to",
        "If two things don’t depend on each other, don’t make one wait for the other. Then measure it.",
      ],
    ],
    stack: "Async execution · Profiling",
    Figure: FigRace,
  },
];

const projects = [
  {
    title: "Behind the Interface",
    code: "02.1 · Research library",
    status: "Live",
    description:
      "A library of design research. I take apart websites I admire, look closely at their typography, layout, motion and interaction, and write it up with interactive demos you can play with. It grew out of the same habit that got me into this work.",
    tags: ["Next.js", "Fumadocs", "Tailwind CSS"],
    links: [
      ["Read it", "https://design.zeyadomran.com/"],
      ["Source", "https://github.com/zeyadomran/behind-the-interface"],
    ],
  },
  {
    title: "Promptly",
    code: "02.2 · Windows app",
    status: "Open source",
    description:
      "A small Windows app for the text you want to reuse: AI prompts, replies, notes, bits of code. Select some text, press a shortcut, and it’s saved. Tag it, search it, copy it back. Everything stays on your computer and works offline.",
    tags: ["Windows", "Local-first", "Offline"],
    links: [["Source", "https://github.com/zeyadomran/promptly"]],
  },
];
const products = [
  [
    "SCIS",
    "IBM Sterling Supply Chain Intelligence Suite",
    "https://www.ibm.com/products/supply-chain-intelligence-suite",
  ],
  [
    "EIS",
    "IBM Environmental Intelligence Suite",
    "https://www.ibm.com/products/environmental-intelligence-suite",
  ],
  ["Envizi", "IBM Envizi ESG Suite", "https://www.ibm.com/products/envizi"],
  [
    "OMS",
    "IBM Sterling Order Management",
    "https://www.ibm.com/solutions/order-management",
  ],
];

function SectionLabel({
  number,
  children,
  note,
}: {
  number: string;
  children: ReactNode;
  note: ReactNode;
}) {
  return (
    <div className="section-label">
      <span>
        <span className="accent">{number}</span> / {children}
      </span>
      <span>{note}</span>
    </div>
  );
}

export function EditorialPortfolio() {
  const [bg, surface, line, ink, accent] = themeColors;
  return (
    <div
      className="instrument"
      style={
        {
          "--bg": bg,
          "--surface": surface,
          "--line": line,
          "--ink": ink,
          "--accent": accent,
        } as CSSProperties
      }
    >
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
      <main id="main" tabIndex={-1}>
        <section id="top" className="hero ed-wrap" data-section>
          <span id="home" className="anchor-alias" />
          <div className="hero-copy">
            <p className="eyebrow accent">
              <Icon name="dot" />
              Hi, I’m Zeyad
            </p>
            <h1>
              Hard things,
              <br />
              made <span>easy to use.</span>
            </h1>
            <p className="hero-intro">
              I’m a curious software developer at IBM who likes turning complex
              problems into interfaces that feel obvious. I build reusable
              frontend pieces for supply chain, climate risk, sustainability and
              order management products, and I led the UI of an AI assistant
              from first prototype to production.
            </p>
            <p className="hero-secondary">
              After hours I build small tools and experiment with AI agents,
              looking for practical ways to make everyday work easier. I like
              making useful things, watching how people use them, and sharing
              what I learn.
            </p>
          </div>
          <div className="hero-figure">
            <FigLens />
          </div>
        </section>
        <section
          id="work"
          className="section ed-wrap"
          data-section
          aria-labelledby="work-title"
        >
          <SectionLabel number="01" note="3 stories · 3 figures to play with">
            Work
          </SectionLabel>
          <h2 id="work-title">Three things I’m proud of.</h2>
          <p className="section-intro">
            All from my work at IBM. The figures are illustrations with sample
            content, not product screenshots.
          </p>
          <ol className="case-index" aria-label="Case studies">
            {stories.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>
                  <span>1.{i + 1}</span>
                  <span>{s.title}</span>
                  <span>{s.result}</span>
                </a>
              </li>
            ))}
          </ol>
        </section>
        {stories.map(
          ({ id, kicker, title, body, facts, detail, stack, Figure }, i) => (
            <article
              className="story ed-wrap"
              id={id}
              key={id}
              data-section
              data-nav="work"
              aria-labelledby={`${id}-title`}
            >
              <div className="case-header">
                <span>Story 1.{i + 1}</span>
                <span />
                <span>Fig. 0{i + 2} · Try it</span>
              </div>
              <div className="story-grid">
                <div className="case-intro">
                  <p className="eyebrow accent">{kicker}</p>
                  <h3 id={`${id}-title`}>{title}</h3>
                  <p className="story-copy">{body}</p>
                  <dl className="facts">
                    {facts.map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <StoryDetail>
                    {detail.map(([heading, text]) => (
                      <div key={heading}>
                        <h4>{heading}</h4>
                        <p>{text}</p>
                      </div>
                    ))}
                  </StoryDetail>
                  <p className="stack">{stack}</p>
                </div>
                <div className="case-figure">
                  <i />
                  <i />
                  <i />
                  <i />
                  <Figure />
                </div>
              </div>
            </article>
          ),
        )}
        <section
          id="projects"
          className="section ed-wrap"
          data-section
          aria-labelledby="projects-title"
        >
          <span id="writing" className="anchor-alias" />
          <SectionLabel number="02" note="Built in the open">
            Projects &amp; writing
          </SectionLabel>
          <h2 id="projects-title">
            Things I make
            <br />
            after hours.
          </h2>
          <div className="projects-grid">
            {projects.map((p) => (
              <article className="project-card" key={p.title}>
                <div className="project-header">
                  <span>{p.code}</span>
                  <span>
                    <Icon name="dot" />
                    {p.status}
                  </span>
                </div>
                <div className="project-body">
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <div className="project-tags">
                    {p.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <div className="project-links">
                    {p.links.map(([label, href]) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {label}
                        <Icon name="external" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section
          id="about"
          className="section ed-wrap"
          data-section
          aria-labelledby="about-title"
        >
          <SectionLabel
            number="03"
            note={
              <>
                Engineering <Icon name="close" /> HCI
              </>
            }
          >
            About
          </SectionLabel>
          <div className="about-grid">
            <h2 id="about-title">
              I care about what happens{" "}
              <span>on the other side of the screen.</span>
            </h2>
            <div className="about-copy">
              <p>
                I got into this by poking around Behance and Awwwards, trying to
                work out why some websites felt so good.
              </p>
              <p>
                Studying human-computer interaction at the University of Calgary
                gave me better questions to ask. Is this clear? Does it use its
                space well? Would someone know what to do next?
              </p>
              <p>
                These days I’m at IBM, on software for supply chains, climate
                risk, sustainability and order management. Alongside that, I
                build tools that make other developers’ days easier, and I’ve
                mentored five engineers from onboarding to shipping on their
                own.
              </p>
            </div>
          </div>
          <ol className="experience-log">
            {[
              ["June 2024 – Present", "Software Developer, IBM", 4],
              ["May 2022 – May 2024", "Front-End Developer Intern, IBM", 2],
              [
                "September 2019 – June 2024",
                "BSc Computer Science, University of Calgary",
                0,
              ],
            ].map(([when, what, count]) => (
              <li key={when}>
                <span>{when}</span>
                <span>{what}</span>
                <span>
                  {count === 0
                    ? "HCI concentration"
                    : products
                        .slice(0, Number(count))
                        .map(([label, full, href]) => (
                          <a
                            key={label}
                            href={href}
                            title={full}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {label}
                            <Icon name="external" />
                            <span className="sr-only">
                              {" "}
                              (opens in a new tab)
                            </span>
                          </a>
                        ))}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <footer
        id="contact"
        className="section contact-section ed-wrap"
        data-section
        aria-labelledby="contact-title"
      >
        <span id="links" className="anchor-alias" />
        <SectionLabel number="04" note="Email is best">
          Contact
        </SectionLabel>
        <h2 id="contact-title">
          Want to work together?
          <br />
          <span>Let’s talk.</span>
        </h2>
        <p className="section-intro">
          I’m happiest on thoughtful products, hard problems, and teams who care
          about the people using what they build.
        </p>
        <div className="contact-terminal">
          <div className="email-row">
            <div>
              <Icon name="right" />
              <a className="email-link" href="mailto:ziomran@gmail.com">
                ziomran@gmail.com
              </a>
              <span className="terminal-cursor" aria-hidden="true" />
            </div>
            <CopyEmail />
          </div>
          <div className="contact-links">
            <a href="/Zeyad_Omran_Resume.pdf" download="Zeyad_Omran_Resume.pdf">
              Resume
              <span>
                PDF <Icon name="down" />
              </span>
            </a>
            <a
              href="https://linkedin.com/in/zeyadomran"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <Icon name="external" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a
              href="https://github.com/zeyadomran"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <Icon name="external" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
        <div className="footer-row">
          <span>© 2026 Zeyad Omran</span>
          <a href="#top">
            Back to top <Icon name="up" />
          </a>
        </div>
      </footer>
    </div>
  );
}
