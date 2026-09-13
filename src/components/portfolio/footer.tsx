import type { CSSProperties } from "react";

export function Footer() {
  return (
    <footer className="site-footer" data-scene-scope="">
      <div className="wrap footer-inner">
        <p className="footer-note">
          © <span id="year">{new Date().getFullYear()}</span> Zeyad Omran
        </p>
        <figure
          className="scene footer-scene"
          data-art="footer"
          aria-hidden="true"
        >
          <svg viewBox="-8 -8 176 64" width="176" height="64" focusable="false">
            <g className="scroll-unit" data-poses="0,-4,.85;0,0,1">
              <g className="pointer-unit" data-depth="-0.7">
                <g
                  className="ambient-unit"
                  style={{ "--phase": "-0s" } as CSSProperties}
                >
                  <rect x="8" y="12" width="24" height="24" />
                  <path d="M20 16v16" />
                </g>
              </g>
            </g>
            <g className="scroll-unit" data-poses="0,4,.85;0,0,1">
              <g className="pointer-unit" data-depth="0.5">
                <g
                  className="ambient-unit"
                  style={{ "--phase": "-1s" } as CSSProperties}
                >
                  <rect x="48" y="12" width="40" height="24" />
                  <path d="M56 28l8-8 16 8" />
                </g>
              </g>
            </g>
            <g className="scroll-unit" data-poses="0,-4,.85;0,0,1">
              <g className="pointer-unit" data-depth="-0.6">
                <g
                  className="ambient-unit"
                  style={{ "--phase": "-2s" } as CSSProperties}
                >
                  <rect x="104" y="12" width="16" height="24" />
                </g>
              </g>
            </g>
            <g className="scroll-unit" data-poses="0,4,.85;0,0,1">
              <g className="pointer-unit" data-depth="0.8">
                <g
                  className="ambient-unit"
                  style={{ "--phase": "-3s" } as CSSProperties}
                >
                  <rect x="128" y="12" width="24" height="24" />
                  <rect
                    className="solid"
                    x="130"
                    y="14"
                    width="20"
                    height="20"
                  />
                </g>
              </g>
            </g>
          </svg>
        </figure>
        <a href="#home" className="back-top">
          Back to top{" "}
          <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 20V4m-7 7 7-7 7 7" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
