import type { CSSProperties } from "react";

export function Contact() {
  return (
    <section
      className="section"
      id="links"
      aria-labelledby="links-title"
      data-scene-scope=""
    >
      <div className="wrap contact-layout">
        <div className="contact-intro od-stack flex flex-col gap-[var(--od-gap,8px)]">
          <h2 id="links-title">Get in touch</h2>
          <p className="contact-prompt">
            Have a challenging workflow or an idea worth building? Let’s talk.
          </p>
          <figure
            className="scene links-scene"
            data-art="links"
            aria-hidden="true"
          >
            <svg
              viewBox="-8 -8 272 192"
              width="272"
              height="192"
              focusable="false"
            >
              <g className="scroll-unit" data-poses="0,0,1;16,-8,1">
                <g className="pointer-unit" data-depth="-0.7">
                  <g
                    className="ambient-unit"
                    style={{ "--phase": "-2s" } as CSSProperties}
                  >
                    <rect x="24" y="24" width="64" height="40" />
                    <path d="M32 44h48" />
                  </g>
                </g>
              </g>
              <g className="scroll-unit" data-poses="0,0,1;8,8,1">
                <g className="pointer-unit" data-depth="0.8">
                  <g
                    className="ambient-unit"
                    style={{ "--phase": "-3s" } as CSSProperties}
                  >
                    <rect x="104" y="24" width="56" height="40" />
                    <path d="M132 32v24" />
                  </g>
                </g>
              </g>
              <g className="scroll-unit" data-poses="0,0,1;0,-8,1">
                <g className="pointer-unit" data-depth="-0.5">
                  <g
                    className="ambient-unit"
                    style={{ "--phase": "-4s" } as CSSProperties}
                  >
                    <rect x="176" y="24" width="56" height="40" />
                    <rect
                      className="solid"
                      x="194"
                      y="34"
                      width="20"
                      height="20"
                    />
                  </g>
                </g>
              </g>
              <g className="scroll-unit" data-poses="0,0,1;0,-8,1">
                <g className="pointer-unit" data-depth="0.6">
                  <g
                    className="ambient-unit"
                    style={{ "--phase": "-5s" } as CSSProperties}
                  >
                    <rect x="24" y="80" width="64" height="72" />
                    <path d="M40 136l32-40" />
                  </g>
                </g>
              </g>
              <g className="scroll-unit" data-poses="0,0,1;8,-8,1">
                <g className="pointer-unit" data-depth="-0.8">
                  <g
                    className="ambient-unit"
                    style={{ "--phase": "-6s" } as CSSProperties}
                  >
                    <rect x="104" y="112" width="56" height="40" />
                  </g>
                </g>
              </g>
              <g className="scroll-unit" data-poses="0,0,1;-8,8,1">
                <g className="pointer-unit" data-depth="0.5">
                  <g
                    className="ambient-unit"
                    style={{ "--phase": "-7s" } as CSSProperties}
                  >
                    <rect x="176" y="80" width="56" height="72" />
                  </g>
                </g>
              </g>
            </svg>
          </figure>
        </div>
        <div className="contact-links">
          <a className="contact-link" href="mailto:ziomran@gmail.com">
            <span className="link-label">
              Email<span className="sr-only"> Zeyad at ziomran@gmail.com</span>
            </span>
            <span className="link-arrow">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 18 18 6M6 6h12v12" />
              </svg>
            </span>
          </a>
          <a
            className="contact-link"
            href="https://linkedin.com/in/zeyadomran"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="link-label">
              Linkedin
              <span className="sr-only">
                {" "}
                — Zeyad Omran, opens in a new tab
              </span>
            </span>
            <span className="link-arrow">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 18 18 6M6 6h12v12" />
              </svg>
            </span>
          </a>
          <a
            className="contact-link"
            href="https://github.com/zeyadomran"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="link-label">
              Github
              <span className="sr-only"> — zeyadomran, opens in a new tab</span>
            </span>
            <span className="link-arrow">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 18 18 6M6 6h12v12" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
