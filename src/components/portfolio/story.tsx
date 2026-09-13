import type { CSSProperties } from "react";

export function AboutStory() {
  return (
    <div className="story-track about-story" data-story="about">
      <div className="story-panel wrap">
        <div className="story-top">
          <div className="story-tools">
            <nav className="stage-nav" aria-label="About topics">
              <button
                type="button"
                className="stage-button"
                data-stage-button="0"
                aria-label="Show Frontend"
              >
                <span className="stage-square" aria-hidden="true"></span>
                <span>Frontend</span>
              </button>
              <button
                type="button"
                className="stage-button"
                data-stage-button="1"
                aria-label="Show HCI"
              >
                <span className="stage-square" aria-hidden="true"></span>
                <span>HCI</span>
              </button>
              <button
                type="button"
                className="stage-button"
                data-stage-button="2"
                aria-label="Show AI agents"
              >
                <span className="stage-square" aria-hidden="true"></span>
                <span>AI agents</span>
              </button>
            </nav>
          </div>
        </div>
        <div className="story-frame">
          <div className="story-visual">
            <figure
              className="scene about-scene"
              data-art="about"
              aria-hidden="true"
            >
              <svg
                viewBox="-8 -8 232 232"
                width="232"
                height="232"
                focusable="false"
              >
                <g className="scroll-unit" data-poses="0,0,1;16,16,.85;8,-8,1">
                  <g className="pointer-unit" data-depth="-0.8">
                    <g
                      className="ambient-unit"
                      style={{ "--phase": "-1s" } as CSSProperties}
                    >
                      <rect x="24" y="24" width="56" height="56" />
                      <path d="M32 64l20-24 20 24" />
                    </g>
                  </g>
                </g>
                <g className="scroll-unit" data-poses="0,0,1;-16,16,.85;8,8,1">
                  <g className="pointer-unit" data-depth="0.6">
                    <g
                      className="ambient-unit"
                      style={{ "--phase": "-2s" } as CSSProperties}
                    >
                      <rect x="136" y="24" width="56" height="56" />
                      <path d="M164 32v40" />
                    </g>
                  </g>
                </g>
                <g
                  className="scroll-unit"
                  data-poses="0,0,1;16,-16,.85;-8,-8,1"
                >
                  <g className="pointer-unit" data-depth="0.8">
                    <g
                      className="ambient-unit"
                      style={{ "--phase": "-3s" } as CSSProperties}
                    >
                      <rect x="24" y="136" width="56" height="56" />
                      <path d="M32 164h40" />
                    </g>
                  </g>
                </g>
                <g
                  className="scroll-unit"
                  data-poses="0,0,1;-16,-16,.85;-8,8,1"
                >
                  <g className="pointer-unit" data-depth="-0.6">
                    <g
                      className="ambient-unit"
                      style={{ "--phase": "-4s" } as CSSProperties}
                    >
                      <rect x="136" y="136" width="56" height="56" />
                      <rect
                        className="solid"
                        x="154"
                        y="154"
                        width="20"
                        height="20"
                      />
                    </g>
                  </g>
                </g>
              </svg>
            </figure>
          </div>
          <div className="stage-stack">
            <article className="stage" data-stage="" data-reading-anchor="">
              <div className="chapter-copy od-stack flex flex-col gap-[var(--od-gap,8px)]">
                <h3 className="stage-title" id="interest-frontend">
                  Frontend
                </h3>
                <p>
                  I chose frontend because it brings engineering and
                  human-computer interaction together. I enjoy shaping the
                  details that help someone look at an interface and know what
                  to do next, from a clear first step to feedback that helps
                  them move forward.
                </p>
              </div>
            </article>
            <article className="stage" data-stage="" data-reading-anchor="">
              <div className="chapter-copy od-stack flex flex-col gap-[var(--od-gap,8px)]">
                <h3 className="stage-title" id="interest-hci">
                  HCI
                </h3>
                <p>
                  I care about well thought-out interfaces and smart
                  interactions that make complex workflows simpler.
                  Accessibility and localization are part of that thinking from
                  the start. I want people to feel confident using an interface,
                  in their own language and in a way that works for them, so
                  they can do more, faster.
                </p>
              </div>
            </article>
            <article className="stage" data-stage="" data-reading-anchor="">
              <div className="chapter-copy od-stack flex flex-col gap-[var(--od-gap,8px)]">
                <h3 className="stage-title" id="interest-ai">
                  AI agents
                </h3>
                <p>
                  I&#8217;m interested in agents that help people build, learn,
                  and stay organized. I enjoy building agents for others, with
                  clear interfaces that make them useful in everyday work.
                  I&#8217;m also exploring how they can help developers be more
                  productive and ship useful software faster.
                </p>
              </div>
            </article>
          </div>
        </div>
        <div className="story-progress">
          <span className="stage-count" aria-hidden="true">
            01 / 03
          </span>
          <span className="progress-line" aria-hidden="true">
            <span className="progress-marker"></span>
          </span>
        </div>
      </div>
    </div>
  );
}
