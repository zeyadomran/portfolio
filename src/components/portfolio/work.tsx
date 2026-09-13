import Image from "next/image";
import type { CSSProperties } from "react";

export function Work() {
  return (
    <section
      className="section"
      id="work"
      aria-labelledby="work-title"
      data-scene-scope=""
    >
      <h2 className="sr-only" id="work-title">
        Work experience
      </h2>
      <div className="story-track work-story" data-story="work">
        <div className="story-panel wrap">
          <div className="story-top">
            <p className="employer-mark">
              <Image
                className="company-logo"
                src="/assets/ibm-lettering.png"
                width="960"
                height="381"
                alt="IBM"
                decoding="async"
              />
            </p>
            <div className="story-tools">
              <nav className="stage-nav" aria-label="IBM roles">
                <button
                  type="button"
                  className="stage-button"
                  data-stage-button="0"
                  aria-label="Show Developer"
                >
                  <span className="stage-square" aria-hidden="true"></span>
                  <span>Developer</span>
                </button>
                <button
                  type="button"
                  className="stage-button"
                  data-stage-button="1"
                  aria-label="Show Intern"
                >
                  <span className="stage-square" aria-hidden="true"></span>
                  <span>Intern</span>
                </button>
              </nav>
            </div>
          </div>
          <div className="story-frame">
            <div className="story-visual">
              <figure
                className="scene work-scene"
                data-art="work"
                aria-hidden="true"
              >
                <svg
                  viewBox="-8 -8 176 336"
                  width="176"
                  height="336"
                  focusable="false"
                >
                  <g className="scroll-unit" data-poses="-8,0,1;8,0,1">
                    <g className="pointer-unit" data-depth="-0.8">
                      <g
                        className="ambient-unit"
                        style={{ "--phase": "-5s" } as CSSProperties}
                      >
                        <rect x="24" y="24" width="64" height="48" />
                        <path d="M32 48h48" />
                      </g>
                    </g>
                  </g>
                  <g className="scroll-unit" data-poses="0,-8,1;-16,0,1">
                    <g className="pointer-unit" data-depth="0.8">
                      <g
                        className="ambient-unit"
                        style={{ "--phase": "-6s" } as CSSProperties}
                      >
                        <rect x="88" y="88" width="48" height="48" />
                        <path d="M96 120l32-24" />
                      </g>
                    </g>
                  </g>
                  <g className="scroll-unit" data-poses="-8,0,.95;8,0,1">
                    <g className="pointer-unit" data-depth="-0.5">
                      <g
                        className="ambient-unit"
                        style={{ "--phase": "-7s" } as CSSProperties}
                      >
                        <rect x="24" y="152" width="88" height="48" />
                        <path d="M68 160v32" />
                      </g>
                    </g>
                  </g>
                  <g className="scroll-unit" data-poses="0,8,1;-16,0,1">
                    <g className="pointer-unit" data-depth="0.65">
                      <g
                        className="ambient-unit"
                        style={{ "--phase": "-0s" } as CSSProperties}
                      >
                        <rect x="64" y="216" width="72" height="48" />
                        <rect
                          className="solid"
                          x="90"
                          y="230"
                          width="20"
                          height="20"
                        />
                      </g>
                    </g>
                  </g>
                  <g className="scroll-unit" data-poses="0,8,1;16,0,1">
                    <g className="pointer-unit" data-depth="-0.75">
                      <g
                        className="ambient-unit"
                        style={{ "--phase": "-1s" } as CSSProperties}
                      >
                        <rect x="24" y="280" width="32" height="16" />
                      </g>
                    </g>
                  </g>
                </svg>
              </figure>
            </div>
            <div className="stage-stack">
              <article
                className="stage role-body"
                data-stage=""
                data-reading-anchor=""
                aria-labelledby="role-current"
              >
                <div className="role-heading od-stack flex flex-col gap-[var(--od-gap,8px)]">
                  <p className="date-range">
                    <time dateTime="2024-06">June 2024</time> - Present
                  </p>
                  <h3 className="role-title" id="role-current">
                    Software developer
                  </h3>
                  <p className="work-location">Markham, Ontario</p>
                </div>
                <div className="work-description od-stack flex flex-col gap-[var(--od-gap,8px)]">
                  <p>
                    Owned frontend features from design to production, including
                    an AI assistant and reusable components across IBM products.
                  </p>
                  <p>
                    Shaped user flows with designers, mentored new hires, and
                    led AI adoption through developer tools and knowledge
                    sharing.
                  </p>
                </div>
                <div
                  className="kpi-grid od-grid grid gap-[var(--od-gap,12px)] grid-cols-[repeat(var(--od-cols,3),minmax(0,1fr))]"
                  aria-label="Software Developer results"
                >
                  <article className="kpi-card od-stack flex flex-col gap-[var(--od-gap,8px)]">
                    <div className="od-stat grid gap-[var(--od-gap,2px)]">
                      <strong className="kpi-value">5</strong>
                      <h4 className="kpi-label">Partner teams</h4>
                    </div>
                    <p className="kpi-description">
                      Coordinated on AI assistant delivery.
                    </p>
                  </article>
                  <article className="kpi-card od-stack flex flex-col gap-[var(--od-gap,8px)]">
                    <div className="od-stat grid gap-[var(--od-gap,2px)]">
                      <strong className="kpi-value">50%+</strong>
                      <h4 className="kpi-label">Less implementation time</h4>
                    </div>
                    <p className="kpi-description">
                      On average through AI-assisted development.
                    </p>
                  </article>
                  <article className="kpi-card od-stack flex flex-col gap-[var(--od-gap,8px)]">
                    <div className="od-stat grid gap-[var(--od-gap,2px)]">
                      <strong className="kpi-value">2</strong>
                      <h4 className="kpi-label">Repositories</h4>
                    </div>
                    <p className="kpi-description">
                      With standardized AI development guidance.
                    </p>
                  </article>
                  <article className="kpi-card od-stack flex flex-col gap-[var(--od-gap,8px)]">
                    <div className="od-stat grid gap-[var(--od-gap,2px)]">
                      <strong className="kpi-value">10</strong>
                      <h4 className="kpi-label">Locales</h4>
                    </div>
                    <p className="kpi-description">
                      Supported by the AI assistant interface.
                    </p>
                  </article>
                </div>
              </article>
              <article
                className="stage role-body"
                data-stage=""
                data-reading-anchor=""
                aria-labelledby="role-intern"
              >
                <div className="role-heading od-stack flex flex-col gap-[var(--od-gap,8px)]">
                  <p className="date-range">
                    <time dateTime="2022-05">May 2022</time> -{" "}
                    <time dateTime="2024-05">May 2024</time>
                  </p>
                  <h3 className="role-title" id="role-intern">
                    Front-End Developer Intern
                  </h3>
                  <p className="work-location">Markham, Ontario</p>
                </div>
                <div className="work-description od-stack flex flex-col gap-[var(--od-gap,8px)]">
                  <p>
                    Built interactive dashboards and reusable interfaces for
                    climate-risk and supply-chain applications.
                  </p>
                  <p>
                    Refined user interactions, improved accessibility, and
                    automated dashboard migrations to support the wider
                    development team.
                  </p>
                </div>
                <div
                  className="kpi-grid od-grid grid gap-[var(--od-gap,12px)] grid-cols-[repeat(var(--od-cols,3),minmax(0,1fr))]"
                  aria-label="Internship results"
                >
                  <article className="kpi-card od-stack flex flex-col gap-[var(--od-gap,8px)]">
                    <div className="od-stat grid gap-[var(--od-gap,2px)]">
                      <strong className="kpi-value">6</strong>
                      <h4 className="kpi-label">Climate-risk views</h4>
                    </div>
                    <p className="kpi-description">
                      Delivered for location analysis, asset exploration,
                      reporting, and exports.
                    </p>
                  </article>
                  <article className="kpi-card od-stack flex flex-col gap-[var(--od-gap,8px)]">
                    <div className="od-stat grid gap-[var(--od-gap,2px)]">
                      <strong className="kpi-value">4</strong>
                      <h4 className="kpi-label">Dashboards</h4>
                    </div>
                    <p className="kpi-description">
                      Migrated through automation.
                    </p>
                  </article>
                  <article className="kpi-card od-stack flex flex-col gap-[var(--od-gap,8px)]">
                    <div className="od-stat grid gap-[var(--od-gap,2px)]">
                      <strong className="kpi-value">
                        <span className="kpi-qualifier">Over</span> 80%
                      </strong>
                      <h4 className="kpi-label">Unit-test coverage</h4>
                    </div>
                    <p className="kpi-description">
                      On the asynchronous dashboard-processing path.
                    </p>
                  </article>
                </div>
              </article>
            </div>
          </div>
          <div className="story-progress">
            <span className="stage-count" aria-hidden="true">
              01 / 02
            </span>
            <span className="progress-line" aria-hidden="true">
              <span className="progress-marker"></span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
