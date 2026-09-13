export function Skills() {
  return (
    <div
      className="skills-explorer od-stack flex flex-col gap-[var(--od-gap,8px)]"
      aria-labelledby="skills-title"
    >
      <h3 id="skills-title">Skills &amp; tools</h3>
      <div
        className="skill-filters"
        role="group"
        aria-label="Explore toolkit categories"
        hidden
      >
        <button
          className="skill-filter"
          type="button"
          data-skill-filter="frontend"
          aria-controls="skills-frontend"
          aria-pressed="false"
        >
          Front-End
        </button>
        <button
          className="skill-filter"
          type="button"
          data-skill-filter="languages"
          aria-controls="skills-languages"
          aria-pressed="false"
        >
          Languages
        </button>
        <button
          className="skill-filter"
          type="button"
          data-skill-filter="backend"
          aria-controls="skills-backend"
          aria-pressed="false"
        >
          Back-End
        </button>
        <button
          className="skill-filter"
          type="button"
          data-skill-filter="quality"
          aria-controls="skills-quality"
          aria-pressed="false"
        >
          CI/CD &amp; Quality
        </button>
        <button
          className="skill-filter"
          type="button"
          data-skill-filter="ai"
          aria-controls="skills-ai"
          aria-pressed="false"
        >
          AI Tools
        </button>
      </div>
      <p
        className="skill-status sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        hidden
      ></p>
      <div className="skills-results">
        <section
          className="skill-group"
          id="skills-frontend"
          data-skill-group="frontend"
          aria-labelledby="skills-frontend-title"
        >
          <h4 id="skills-frontend-title">Front-End</h4>
          <ul
            className="skill-tiles od-rail"
            tabIndex={0}
            aria-labelledby="skills-frontend-title"
          >
            <li className="skill-tile">
              <span>React</span>
            </li>
            <li className="skill-tile">
              <span>Angular</span>
            </li>
            <li className="skill-tile">
              <span>Next.js</span>
            </li>
            <li className="skill-tile">
              <span>TypeScript</span>
            </li>
            <li className="skill-tile">
              <span>Tailwind CSS</span>
            </li>
            <li className="skill-tile">
              <span>TanStack Table</span>
            </li>
            <li className="skill-tile">
              <span>Redux</span>
            </li>
            <li className="skill-tile">
              <span>NgRx</span>
            </li>
            <li className="skill-tile">
              <span>Apollo Client</span>
            </li>
            <li className="skill-tile">
              <span>Storybook</span>
            </li>
          </ul>
        </section>
        <section
          className="skill-group"
          id="skills-languages"
          data-skill-group="languages"
          aria-labelledby="skills-languages-title"
        >
          <h4 id="skills-languages-title">Languages</h4>
          <ul
            className="skill-tiles od-rail"
            tabIndex={0}
            aria-labelledby="skills-languages-title"
          >
            <li className="skill-tile">
              <span>TypeScript</span>
            </li>
            <li className="skill-tile">
              <span>JavaScript</span>
            </li>
            <li className="skill-tile">
              <span>Python</span>
            </li>
            <li className="skill-tile">
              <span>Java</span>
            </li>
            <li className="skill-tile">
              <span>SQL</span>
            </li>
            <li className="skill-tile">
              <span>HTML</span>
            </li>
            <li className="skill-tile">
              <span>CSS</span>
            </li>
          </ul>
        </section>
        <section
          className="skill-group"
          id="skills-backend"
          data-skill-group="backend"
          aria-labelledby="skills-backend-title"
        >
          <h4 id="skills-backend-title">Back-End</h4>
          <ul
            className="skill-tiles od-rail"
            tabIndex={0}
            aria-labelledby="skills-backend-title"
          >
            <li className="skill-tile">
              <span>Node.js</span>
            </li>
            <li className="skill-tile">
              <span>GraphQL</span>
            </li>
            <li className="skill-tile">
              <span>REST APIs</span>
            </li>
            <li className="skill-tile">
              <span>Spring Boot</span>
            </li>
            <li className="skill-tile">
              <span>Gradle</span>
            </li>
            <li className="skill-tile">
              <span>PostgreSQL</span>
            </li>
            <li className="skill-tile">
              <span>Redis</span>
            </li>
          </ul>
        </section>
        <section
          className="skill-group"
          id="skills-quality"
          data-skill-group="quality"
          aria-labelledby="skills-quality-title"
        >
          <h4 id="skills-quality-title">CI/CD &amp; Quality</h4>
          <ul
            className="skill-tiles od-rail"
            tabIndex={0}
            aria-labelledby="skills-quality-title"
          >
            <li className="skill-tile">
              <span>Cypress</span>
            </li>
            <li className="skill-tile">
              <span>Playwright</span>
            </li>
            <li className="skill-tile">
              <span>Jest</span>
            </li>
            <li className="skill-tile">
              <span>Jenkins</span>
            </li>
            <li className="skill-tile">
              <span>SonarQube</span>
            </li>
            <li className="skill-tile">
              <span>Git</span>
            </li>
            <li className="skill-tile">
              <span>Docker</span>
            </li>
            <li className="skill-tile">
              <span>Kubernetes</span>
            </li>
            <li className="skill-tile">
              <span>OpenShift</span>
            </li>
          </ul>
        </section>
        <section
          className="skill-group"
          id="skills-ai"
          data-skill-group="ai"
          aria-labelledby="skills-ai-title"
        >
          <h4 id="skills-ai-title">AI Tools</h4>
          <ul
            className="skill-tiles od-rail"
            tabIndex={0}
            aria-labelledby="skills-ai-title"
          >
            <li className="skill-tile">
              <span>Bob</span>
            </li>
            <li className="skill-tile">
              <span>Codex</span>
            </li>
            <li className="skill-tile">
              <span>Claude Code</span>
            </li>
            <li className="skill-tile">
              <span>MCP</span>
            </li>
            <li className="skill-tile">
              <span>RAG</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
