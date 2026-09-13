import type { CSSProperties } from "react";

export function Hero() {
  return (
    <section
      className="hero wrap"
      id="home"
      aria-labelledby="hero-title"
      data-scene-scope=""
    >
      <div className="hero-main">
        <div className="hero-identity od-stack flex flex-col gap-[var(--od-gap,8px)]">
          <p className="hero-role">Software developer</p>
          <h1 id="hero-title">
            <span className="hero-line">
              <span className="hero-word" data-scroll-word="-1">
                ZEYAD
              </span>
            </span>
            <span className="hero-line hero-surname">
              <span className="hero-word" data-scroll-word="1">
                OMRAN
              </span>
              <span className="hero-period" aria-hidden="true"></span>
            </span>
          </h1>
        </div>
        <div className="hero-side od-stack flex flex-col gap-[var(--od-gap,8px)]">
          <p className="hero-description">
            I build software that helps people do more, faster.
          </p>
          <a className="text-link" href="#work">
            Explore my work{" "}
            <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4v16m-7-7 7 7 7-7" />
            </svg>
          </a>
          <figure
            className="scene hero-scene"
            data-art="hero"
            aria-hidden="true"
          >
            <svg
              viewBox="-8 -8 376 304"
              width="376"
              height="304"
              focusable="false"
            >
              <g className="scroll-unit" data-poses="-16,-16,.94;0,0,1">
                <g className="pointer-unit" data-depth="-0.7">
                  <g
                    className="ambient-unit"
                    style={{ "--phase": "-0s" } as CSSProperties}
                  >
                    <rect x="32" y="32" width="64" height="48" />
                    <path d="M40 56h48" />
                  </g>
                </g>
              </g>
              <g className="scroll-unit" data-poses="0,-24,.94;0,0,1">
                <g className="pointer-unit" data-depth="0.65">
                  <g
                    className="ambient-unit"
                    style={{ "--phase": "-1s" } as CSSProperties}
                  >
                    <rect x="112" y="32" width="96" height="48" />
                    <path d="M160 40v32" />
                  </g>
                </g>
              </g>
              <g className="scroll-unit" data-poses="16,-16,.94;0,0,1">
                <g className="pointer-unit" data-depth="-0.9">
                  <g
                    className="ambient-unit"
                    style={{ "--phase": "-2s" } as CSSProperties}
                  >
                    <rect x="224" y="32" width="104" height="48" />
                    <path d="M240 64l24-16h48" />
                  </g>
                </g>
              </g>
              <g className="scroll-unit" data-poses="-16,0,.94;0,0,1">
                <g className="pointer-unit" data-depth="0.8">
                  <g
                    className="ambient-unit"
                    style={{ "--phase": "-3s" } as CSSProperties}
                  >
                    <rect x="32" y="96" width="48" height="88" />
                  </g>
                </g>
              </g>
              <g className="scroll-unit" data-poses="0,0,.88;0,0,1">
                <g className="pointer-unit" data-depth="-0.4">
                  <g
                    className="ambient-unit"
                    style={{ "--phase": "-4s" } as CSSProperties}
                  >
                    <rect x="96" y="96" width="112" height="88" />
                    <path d="M112 112l80 56" />
                  </g>
                </g>
              </g>
              <g className="scroll-unit" data-poses="16,0,.94;0,0,1">
                <g className="pointer-unit" data-depth="1">
                  <g
                    className="ambient-unit"
                    style={{ "--phase": "-5s" } as CSSProperties}
                  >
                    <rect x="224" y="96" width="104" height="88" />
                  </g>
                </g>
              </g>
              <g className="scroll-unit" data-poses="-16,16,.94;0,0,1">
                <g className="pointer-unit" data-depth="-0.6">
                  <g
                    className="ambient-unit"
                    style={{ "--phase": "-6s" } as CSSProperties}
                  >
                    <rect x="32" y="200" width="112" height="56" />
                  </g>
                </g>
              </g>
              <g className="scroll-unit" data-poses="0,24,.94;0,0,1">
                <g className="pointer-unit" data-depth="0.7">
                  <g
                    className="ambient-unit"
                    style={{ "--phase": "-7s" } as CSSProperties}
                  >
                    <rect x="160" y="200" width="48" height="56" />
                  </g>
                </g>
              </g>
              <g className="scroll-unit" data-poses="16,16,.94;0,0,1">
                <g className="pointer-unit" data-depth="-0.85">
                  <g
                    className="ambient-unit"
                    style={{ "--phase": "-0s" } as CSSProperties}
                  >
                    <rect x="224" y="200" width="104" height="56" />
                    <rect
                      className="solid"
                      x="266"
                      y="218"
                      width="20"
                      height="20"
                    />
                  </g>
                </g>
              </g>
            </svg>
          </figure>
        </div>
      </div>
    </section>
  );
}
