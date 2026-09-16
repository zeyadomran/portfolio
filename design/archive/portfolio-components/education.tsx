export function Education() {
  return (
    <aside
      className="education-row od-grid grid gap-[var(--od-gap,12px)] grid-cols-[repeat(var(--od-cols,3),minmax(0,1fr))]"
      aria-labelledby="education-label education-title"
    >
      <div className="education-timeline od-stack flex flex-col gap-[var(--od-gap,8px)]">
        <p className="education-eyebrow" id="education-label">
          <span className="education-square" aria-hidden="true"></span>Education
        </p>
        <p className="education-range">
          <time
            className="education-date od-field grid gap-[var(--od-gap,2px)]"
            dateTime="2019-09"
          >
            <span className="education-month">September </span>
            <span className="education-year">2019</span>
          </time>
          <span className="education-connector" aria-hidden="true"></span>
          <span className="sr-only">to</span>
          <time
            className="education-date od-field grid gap-[var(--od-gap,2px)]"
            dateTime="2024-06"
          >
            <span className="education-month">June </span>
            <span className="education-year">2024</span>
          </time>
        </p>
      </div>
      <div className="education-content od-stack flex flex-col gap-[var(--od-gap,8px)]">
        <h3 className="education-title" id="education-title">
          University of Calgary
        </h3>
        <dl className="education-details od-grid grid gap-[var(--od-gap,12px)] grid-cols-[repeat(var(--od-cols,3),minmax(0,1fr))]">
          <div className="education-detail od-field grid gap-[var(--od-gap,2px)]">
            <dt>Degree</dt>
            <dd className="education-qualification od-stack flex flex-col gap-[var(--od-gap,8px)]">
              <span>BSc, Computer Science</span>
              <span className="education-program">Internship Program</span>
            </dd>
          </div>
          <div className="education-detail od-field grid gap-[var(--od-gap,2px)]">
            <dt>Concentration in</dt>
            <dd>Human-Computer Interaction</dd>
          </div>
        </dl>
      </div>
    </aside>
  );
}
