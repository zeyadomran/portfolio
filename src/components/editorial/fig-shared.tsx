import { useRef, useState } from "react";
import { Icon } from "./icon";

const pages = [
  {
    slug: "sites",
    title: "Sites",
    rows: [
      ["Toronto", "On track"],
      ["Calgary", "Review"],
      ["Markham", "On track"],
    ],
  },
  {
    slug: "suppliers",
    title: "Suppliers",
    rows: [
      ["Northwind", "Review"],
      ["Fabrikam", "On track"],
      ["Contoso", "Late"],
    ],
  },
  {
    slug: "orders",
    title: "Orders",
    rows: [
      ["#1042", "Late"],
      ["#1043", "On track"],
      ["#1044", "On track"],
    ],
  },
];
const options = [
  ["select", "Row selection", "Selection"],
  ["columns", "Column picker", "Columns"],
  ["compact", "Compact rows", "Compact"],
  ["status", "Status column", "Status"],
] as const;

export function FigShared() {
  const [shared, setShared] = useState(false);
  const [config, setConfig] = useState({
    select: false,
    columns: false,
    compact: false,
    status: true,
  });
  const [changes, setChanges] = useState(0);
  const [tab, setTab] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const type = shared ? "shared-table" : "data-grid";
  return (
    <figure aria-describedby="shared-note" className="shared-figure">
      <figcaption className="figure-label">
        <span>Fig. 03 · One table, many pages</span>
        <span>Illustrative</span>
      </figcaption>
      <div className={`shared-stage ${shared ? "is-shared" : ""}`}>
        <div className="shared-toolbar">
          <div className="mode-toggle" aria-label="Table implementation">
            {[false, true].map((value) => (
              <button
                key={String(value)}
                aria-label={value ? "After · 1 shared" : "Before · 3 copies"}
                aria-pressed={shared === value}
                onClick={() => setShared(value)}
              >
                {value ? "After" : "Before"}
                <span className="desktop-only">
                  {" "}
                  · {value ? "1 shared" : "3 copies"}
                </span>
              </button>
            ))}
          </div>
          <span className="shared-desktop-counter" aria-hidden="true">
            {shared
              ? `${changes} changes · 3 pages updated each time`
              : "3 tables · 3 ways of doing it"}
          </span>
        </div>
        <div className="shared-tabs" role="tablist" aria-label="Sample pages">
          {pages.map((page, i) => (
            <button
              key={page.slug}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`tab-${page.slug}`}
              role="tab"
              aria-selected={tab === i}
              aria-controls={`page-${page.slug}`}
              tabIndex={tab === i ? 0 : -1}
              onClick={() => setTab(i)}
              onKeyDown={(e) => {
                const next =
                  e.key === "ArrowRight"
                    ? (i + 1) % 3
                    : e.key === "ArrowLeft"
                      ? (i + 2) % 3
                      : e.key === "Home"
                        ? 0
                        : e.key === "End"
                          ? 2
                          : null;
                if (next !== null) {
                  e.preventDefault();
                  setTab(next);
                  tabs.current[next]?.focus();
                }
              }}
            >
              <span
                className={
                  shared && changes ? "page-marker flash" : "page-marker"
                }
                key={changes}
              />
              /{page.slug}
            </button>
          ))}
        </div>
        <div className="shared-pages">
          {pages.map((page, i) => (
            <div
              key={page.slug}
              id={`page-${page.slug}`}
              className={`sample-page page-${i} ${i === tab ? "is-active" : ""} ${shared && config.compact ? "compact-rows" : ""}`}
            >
              {shared && changes > 0 && (
                <span className="page-flash" key={changes} aria-hidden="true" />
              )}
              <div className="sample-route">/{page.slug}</div>
              <div className="sample-title">
                {page.title}
                {shared && config.columns && (
                  <span className="sample-column-picker">
                    Name · {config.status ? "Status" : "1 column"}
                  </span>
                )}
              </div>
              <div className="sample-table">
                <table aria-label={`${page.slug} sample table`}>
                  <thead>
                    <tr>
                      {shared && config.select && (
                        <th className="selection-cell">
                          <span className="sr-only">Selection</span>
                          <span
                            className="sample-checkbox"
                            aria-hidden="true"
                          />
                        </th>
                      )}
                      <th scope="col">Name</th>
                      {(!shared || config.status) && (
                        <th scope="col">Status</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {page.rows.map(([name, status], j) => (
                      <tr
                        key={name}
                        className={
                          shared && config.select && j === 1
                            ? "selected-row"
                            : ""
                        }
                      >
                        {shared && config.select && (
                          <td className="selection-cell">
                            <span
                              className={`sample-checkbox ${j === 1 ? "checked" : ""}`}
                              aria-hidden="true"
                            >
                              {j === 1 && <Icon name="check" />}
                            </span>
                            <span className="sr-only">
                              {j === 1 ? "Selected" : "Not selected"}
                            </span>
                          </td>
                        )}
                        <td>{name}</td>
                        {(!shared || config.status) && (
                          <td>
                            <span
                              className={`sample-status status-${status.replace(" ", "-").toLowerCase()}`}
                            >
                              <Icon name="dot" />
                              {status}
                            </span>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
        <p className="shared-counter" role="status">
          {shared
            ? `${changes} changes · all 3 pages updated`
            : "3 pages · 3 different tables"}
        </p>
        <div className="shared-options">
          {options.map(([key, label, short]) => (
            <button
              key={key}
              disabled={!shared}
              aria-label={label}
              aria-pressed={config[key]}
              onClick={() => {
                setConfig((current) => ({ ...current, [key]: !current[key] }));
                setChanges((current) => current + 1);
              }}
            >
              <span className="option-box" aria-hidden="true" />
              <span className="desktop-only">{label}</span>
              <span className="mobile-only">{short}</span>
            </button>
          ))}
        </div>
        <p className="shared-hint">
          <span className="desktop-only">
            {shared
              ? "One shared table. Every page gets the same change."
              : "Each page has its own table. Every change gets made three times. Switch to After."}
          </span>
          <span className="mobile-only">
            {shared
              ? "Flip an option, then check the other tabs. They all changed."
              : "Tap through the tabs: every page built its own table. Then switch to After."}
          </span>
        </p>
        <pre className="shared-config">
          <code>
            <span className="config-long">{'{\n  "widget": {\n'}</span>
            <span className="config-type">
              {`    "type": "${type}"`}
              <span className="config-long">,</span>
            </span>
            <span className="config-long">
              {'\n    "columns": ["name", "status"]'}
              {shared
                ? `,\n    "selection": ${config.select},\n    "columnPicker": ${config.columns},\n    "compact": ${config.compact},\n    "showStatus": ${config.status}`
                : ""}
              {"\n  }\n}"}
            </span>
          </code>
        </pre>
      </div>
      <p className="figure-footnote" id="shared-note">
        Sample pages. In production the shared table runs on 50+ pages.
      </p>
    </figure>
  );
}
