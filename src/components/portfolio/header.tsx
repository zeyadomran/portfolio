export function Header() {
  return (
    <header className="site-header">
      <div className="wrap nav-inner">
        <a href="#home" className="brand" aria-label="Zeyad Omran, home">
          <svg
            className="brand-logo"
            xmlns="http://www.w3.org/2000/svg"
            width="200"
            height="200"
            viewBox="0 0 200 200"
            aria-hidden="true"
            focusable="false"
          >
            <g className="logo-part logo-rail logo-rail-top">
              <rect x="32" y="56" width="104" height="16" />
              <rect
                className="logo-rail-highlight"
                x="32"
                y="56"
                width="104"
                height="16"
              />
            </g>
            <g className="logo-part logo-rail logo-rail-bottom">
              <rect x="64" y="104" width="80" height="16" />
            </g>
            <g className="logo-part logo-terminal">
              <rect x="152" y="104" width="16" height="16" />
            </g>
          </svg>
        </a>
        <nav aria-label="Main navigation">
          <ul className="nav-list">
            <li>
              <a href="#home" aria-current="location">
                <span className="nav-label">
                  <span className="nav-text">Home</span>
                  <span className="nav-measure" aria-hidden="true">
                    Home
                  </span>
                  <span className="nav-slice slice-a" aria-hidden="true">
                    Home
                  </span>
                  <span className="nav-slice slice-b" aria-hidden="true">
                    Home
                  </span>
                </span>
              </a>
            </li>
            <li>
              <a href="#about">
                <span className="nav-label">
                  <span className="nav-text">About</span>
                  <span className="nav-measure" aria-hidden="true">
                    About
                  </span>
                  <span className="nav-slice slice-a" aria-hidden="true">
                    About
                  </span>
                  <span className="nav-slice slice-b" aria-hidden="true">
                    About
                  </span>
                </span>
              </a>
            </li>
            <li>
              <a href="#work">
                <span className="nav-label">
                  <span className="nav-text">Work</span>
                  <span className="nav-measure" aria-hidden="true">
                    Work
                  </span>
                  <span className="nav-slice slice-a" aria-hidden="true">
                    Work
                  </span>
                  <span className="nav-slice slice-b" aria-hidden="true">
                    Work
                  </span>
                </span>
              </a>
            </li>
            <li>
              <a href="#links">
                <span className="nav-label">
                  <span className="nav-text">Contact</span>
                  <span className="nav-measure" aria-hidden="true">
                    Contact
                  </span>
                  <span className="nav-slice slice-a" aria-hidden="true">
                    Contact
                  </span>
                  <span className="nav-slice slice-b" aria-hidden="true">
                    Contact
                  </span>
                </span>
              </a>
            </li>
          </ul>
        </nav>
        <div className="header-actions">
          <a href="mailto:ziomran@gmail.com" className="nav-contact">
            Say hello{" "}
            <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 18 18 6M6 6h12v12" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
