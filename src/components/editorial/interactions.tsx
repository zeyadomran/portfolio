import { BrandMark } from "./brand-mark";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";

export function StoryMotion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const length = document.documentElement.scrollHeight - innerHeight;
      document.documentElement.style.setProperty(
        "--read-progress",
        `${length > 0 ? scrollY / length : 0}`,
      );
      document.querySelectorAll<HTMLElement>(".case-figure").forEach((el) => {
        el.dataset.tall = `${el.getBoundingClientRect().height > innerHeight - 140}`;
      });
      document
        .querySelectorAll<HTMLElement>(
          ".layer-object,.assistant-shell,.builder-window",
        )
        .forEach((el) => {
          const section = el.closest("section,article");
          const box = section?.getBoundingClientRect();
          const amount =
            box && innerWidth > 767 && !reduced.matches
              ? Math.max(
                  -32,
                  Math.min(
                    32,
                    (innerHeight / 2 - box.top - box.height / 2) * 0.07,
                  ),
                )
              : 0;
          el.style.setProperty("--parallax-y", `${amount}px`);
        });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    document
      .querySelectorAll(".case-figure")
      .forEach((el) => observer.observe(el));
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
      document.documentElement.style.removeProperty("--read-progress");
    };
  }, []);
  return <div className="reading-progress" aria-hidden="true" />;
}

export function Arrow({
  diagonal = false,
  down = false,
  up = false,
}: {
  diagonal?: boolean;
  down?: boolean;
  up?: boolean;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={
          diagonal
            ? "M5 19 19 5M5 5h14v14"
            : down
              ? "M12 4v16m-7-7 7 7 7-7"
              : up
                ? "M12 20V4m-7 7 7-7 7 7"
                : "M4 12h16m-7-7 7 7-7 7"
        }
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// Symbols the typefaces lack are drawn as SVG so every platform shows the same shape.
function Check() {
  return (
    <svg
      className="icon-check"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="m4.5 12.5 5 5 10-11" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function Replay() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 12a8 8 0 1 1-8-8c2.2 0 4.3.9 5.9 2.4L20 8.5M20 3.5v5h-5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

const chapterLabels: Record<string, string> = {
  work: "01 Selected work",
  assistant: "1.1 AI assistant",
  systems: "1.2 Modularity",
  optimization: "1.3 Optimization",
  about: "02 About",
  writing: "03 Writing",
  links: "04 Contact",
};

export function Navigation() {
  const [active, setActive] = useState("");
  const [chapter, setChapter] = useState("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            setActive(target.dataset.nav || target.id);
            setChapter(target.id);
          }
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    document
      .querySelectorAll("[data-chapter]")
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return (
    <header className="ed-header">
      <div className="header-start">
        <a href="#home" className="ed-brand" aria-label="Zeyad Omran, home">
          <BrandMark />
        </a>
        {/* Wayfinding for sighted readers; the headings already announce each chapter. */}
        <span className="header-context" aria-hidden="true" key={chapter}>
          {chapterLabels[chapter] ?? ""}
        </span>
      </div>
      <nav aria-label="Main navigation">
        {[
          ["work", "Work"],
          ["about", "About"],
          ["writing", "Writing"],
          ["links", "Contact"],
        ].map(([id, name]) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={active === id ? "location" : undefined}
          >
            <span>{name}</span>
            <span className="nav-dot" />
          </a>
        ))}
      </nav>
    </header>
  );
}

const layerCopy = [
  ["People", "Start with what someone is trying to do."],
  ["Interface", "Make the next step easier to understand."],
  ["System", "Build a foundation that can keep growing."],
];

export function HeroFigure() {
  const [layer, setLayer] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  function move(e: PointerEvent<HTMLDivElement>) {
    if (
      e.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const bounds = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty(
      "--tilt-x",
      `${((e.clientY - bounds.top) / bounds.height - 0.5) * -7}deg`,
    );
    e.currentTarget.style.setProperty(
      "--tilt-y",
      `${((e.clientX - bounds.left) / bounds.width - 0.5) * 9}deg`,
    );
  }
  return (
    <figure className="hero-figure">
      <div
        className="layer-stage"
        data-layer={layer}
        ref={ref}
        onPointerMove={move}
        onPointerLeave={() => {
          ref.current?.style.setProperty("--tilt-x", "0deg");
          ref.current?.style.setProperty("--tilt-y", "0deg");
        }}
        aria-hidden="true"
      >
        <div className="stage-coordinate top">FIG. 01 · INTERFACE LAYERS</div>
        <div className="layer-object">
          <div className="system-plane">
            <div className="plane-label">
              <span>03 / SYSTEM</span>
              <span>+</span>
            </div>
            <div className="wire-grid">
              {Array.from({ length: 12 }, (_, i) => (
                <i key={i} />
              ))}
            </div>
          </div>
          <div className="interface-plane">
            <div className="plane-label">
              <span>02 / INTERFACE</span>
              <Arrow diagonal />
            </div>
            <div className="plane-layout">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="people-plane">
            <div className="plane-label">
              <span>01 / PEOPLE</span>
              <span className="plane-dot" />
            </div>
            <p>
              A clear
              <br />
              next step.
            </p>
            <span className="plane-arrow">
              <Arrow diagonal />
            </span>
          </div>
        </div>
        <span className="stage-cross">+</span>
      </div>
      <figcaption>
        <div
          className="layer-controls"
          role="group"
          aria-label="Explore my approach"
        >
          {layerCopy.map(([name], i) => (
            <button
              key={name}
              aria-pressed={layer === i}
              onMouseEnter={() => setLayer(i)}
              onFocus={() => setLayer(i)}
              onClick={() => setLayer(i)}
            >
              <span>0{i + 1}</span>
              {name}
            </button>
          ))}
        </div>
        <p className="layer-caption" aria-live="polite">
          {layerCopy[layer][1]}
        </p>
      </figcaption>
    </figure>
  );
}

const assistantSteps = [
  "Name the overview",
  "Choose a period",
  "Prepare the draft",
];

export function AssistantFigure() {
  const [workspace, setWorkspace] = useState(false);
  const shell = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const workspaceRef = useRef<HTMLElement>(null);
  const workspaceOpener = useRef<HTMLButtonElement>(null);
  const [overviewName, setOverviewName] = useState("");
  const [period, setPeriod] = useState("");
  const [saved, setSaved] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const done = [overviewName.trim() !== "", period !== "", saved];
  const ready = done[0] && done[1];

  useEffect(() => {
    if (workspace) workspaceRef.current?.focus({ preventScroll: true });
  }, [workspace]);

  // The reply arrives in sequence the first time the figure scrolls into view.
  useEffect(() => {
    const el = shell.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = el.getBoundingClientRect();
    if (box.top < innerHeight && box.bottom > 0) return;
    el.dataset.reveal = "waiting";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.reveal = "play";
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      delete el.dataset.reveal;
    };
  }, []);

  function openWorkspace(opener: HTMLButtonElement) {
    workspaceOpener.current = opener;
    setWorkspace(true);
    if (workspace) workspaceRef.current?.focus({ preventScroll: true });
  }

  function closeWorkspace(restoreFocus = true) {
    setWorkspace(false);
    if (restoreFocus)
      (workspaceOpener.current ?? launcher.current)?.focus({
        preventScroll: true,
      });
  }

  return (
    <figure className="case-figure assistant-figure">
      <div className="figure-topline">
        <span>CONVERSATION + WORKSPACE</span>
        <span>FIG. 02</span>
      </div>
      <div
        ref={shell}
        className={`assistant-shell ${workspace ? "workspace-open" : ""}`}
      >
        <div className="product-context">
          <div className="underlying-view" aria-hidden="true">
            <span>YOUR CURRENT SCREEN</span>
            <div className="context-heading">Overview</div>
            <div className="context-blocks">
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="context-lines">
              <i />
              <i />
              <i />
            </div>
            <span className="context-hint">
              The task opens here
              <br />
              when you need it.
            </span>
          </div>
          {workspace && (
            // This inline region handles Escape bubbling from its form controls.
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <section
              ref={workspaceRef}
              className="side-workspace"
              tabIndex={-1}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  event.stopPropagation();
                  closeWorkspace();
                }
              }}
              id="assistant-workspace"
              aria-label="Illustrative workspace"
            >
              <div className="workspace-heading">
                <span>Overview workspace</span>
                <button
                  aria-label="Close workspace"
                  onClick={() => closeWorkspace()}
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="m6 6 12 12M18 6 6 18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
              </div>
              <div className="workspace-content">
                <span className="workspace-label">ILLUSTRATIVE FORM</span>
                <p className="workspace-title">
                  Create an
                  <br />
                  overview
                </p>
                <label>
                  Overview name
                  <input
                    value={overviewName}
                    placeholder="Monthly overview"
                    aria-label="Illustrative overview name"
                    aria-invalid={attempted && !done[0]}
                    onChange={(e) => {
                      setOverviewName(e.target.value);
                      setSaved(false);
                    }}
                  />
                </label>
                <label>
                  Reporting period
                  <select
                    aria-label="Illustrative reporting period"
                    aria-invalid={attempted && !done[1]}
                    value={period}
                    onChange={(e) => {
                      setPeriod(e.target.value);
                      setSaved(false);
                    }}
                  >
                    <option value="" disabled>
                      Choose a period
                    </option>
                    <option>This month</option>
                    <option>Last month</option>
                  </select>
                </label>
                <button
                  className="demo-save"
                  onClick={() => {
                    setAttempted(true);
                    if (ready) setSaved(true);
                  }}
                >
                  {saved ? (
                    <>
                      Draft ready
                      <Check />
                    </>
                  ) : (
                    "Prepare draft"
                  )}
                </button>
                <p role="status">
                  {saved
                    ? "Your draft is ready. Your conversation stays in view."
                    : attempted && !ready
                      ? "Add a name and a period to prepare the draft."
                      : "The steps stay beside you as you work."}
                </p>
              </div>
            </section>
          )}
        </div>
        <aside className="right-assistant" aria-label="Assistant panel">
          <div className="window-bar">
            <span>
              <i />
              Assistant
            </span>
            <span className="window-minimize" aria-hidden="true" />
          </div>
          <div className="panel-conversation">
            <p className="panel-user-message">Can I create an overview here?</p>
            <span className="assistant-symbol" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <p className="panel-title">Yes. Open it beside this chat.</p>
            <ol className="panel-steps" aria-label="Steps">
              {assistantSteps.map((step, i) => (
                <li key={step} data-done={done[i]}>
                  <span className="step-mark" aria-hidden="true">
                    {done[i] ? <Check /> : i + 1}
                  </span>
                  <span>
                    {step}
                    {done[i] && <span className="sr-only"> (done)</span>}
                  </span>
                </li>
              ))}
            </ol>
            <button
              ref={launcher}
              className="launch-workspace"
              aria-expanded={workspace}
              aria-controls="assistant-workspace"
              onClick={(event) => {
                if (workspace) closeWorkspace();
                else openWorkspace(event.currentTarget);
              }}
            >
              {workspace ? "Close workspace" : "Open workspace"}
            </button>
          </div>
          <div className="panel-input" aria-hidden="true">
            <span>Ask a question</span>
            <Arrow up />
          </div>
        </aside>
      </div>
      <figcaption>
        <div
          className="figure-step-controls"
          role="group"
          aria-label="Explore the workspace layout"
        >
          <button
            aria-pressed={!workspace}
            onClick={() => closeWorkspace(false)}
          >
            <span>01</span>Conversation
          </button>
          <button
            aria-pressed={workspace}
            onClick={(event) => openWorkspace(event.currentTarget)}
          >
            <span>02</span>Workspace
          </button>
        </div>
        <p>Layout study · illustrative content, not a product screenshot</p>
      </figcaption>
    </figure>
  );
}

type WidgetKey = "chart" | "progress" | "table";

const builderPresets: Record<string, Record<WidgetKey, boolean>> = {
  Overview: { chart: true, progress: true, table: true },
  Analysis: { chart: true, progress: false, table: true },
  Detail: { chart: false, progress: false, table: true },
};

const widgetIcons: Record<WidgetKey, string> = {
  chart: "M4 20V10m6 10V4m6 16v-7m4 7H3",
  progress: "M12 3a9 9 0 1 1-9 9m9-9v9h9",
  table: "M3 5h18v14H3zM3 10h18M3 15h18M9 5v14",
};

export function BuilderFigure() {
  const [view, setView] = useState("Overview");
  const [widgets, setWidgets] = useState(builderPresets.Overview);
  const [sharedTable, setSharedTable] = useState(false);
  // The most recent change is highlighted in the configuration.
  const [change, setChange] = useState({ line: "", count: 0 });
  const mark = (line: string) =>
    setChange((current) => ({ line, count: current.count + 1 }));

  const chooseView = (next: string) => {
    setView(next);
    setWidgets(builderPresets[next]);
    mark("page");
  };
  const enabled = (Object.keys(widgets) as WidgetKey[]).filter(
    (key) => widgets[key],
  );
  const configuration = [
    { key: "open", text: "{" },
    { key: "page", text: `  "page": "${view.toLowerCase()}",` },
    { key: "widgets", text: `  "widgets": [${enabled.length ? "" : "]"}` },
    ...enabled.map((key, i) => ({
      key,
      text: `    { "type": "${key === "table" && sharedTable ? "shared-table" : key}" }${i < enabled.length - 1 ? "," : ""}`,
    })),
    ...(enabled.length ? [{ key: "end", text: "  ]" }] : []),
    { key: "close", text: "}" },
  ];

  return (
    <figure className="case-figure builder-figure">
      <div className="figure-topline">
        <span>SHARED FOUNDATION → MANY VIEWS</span>
        <span>FIG. 03</span>
      </div>
      <div className="builder-window">
        <div
          className="builder-tabs"
          role="group"
          aria-label="Explore reusable interface layouts"
        >
          {Object.keys(builderPresets).map((preset) => (
            <button
              key={preset}
              aria-controls="builder-demo"
              aria-pressed={view === preset}
              onClick={() => chooseView(preset)}
            >
              {preset}
            </button>
          ))}
          {view === "Custom" && (
            <span className="builder-custom" aria-hidden="true">
              Custom
            </span>
          )}
        </div>
        <div className="builder-page" id="builder-demo">
          <div className="builder-heading">
            <p>{view}</p>
            <Arrow diagonal />
          </div>
          <div
            className={`builder-widgets view-${view.toLowerCase()}`}
            aria-label={`Illustrative ${view.toLowerCase()} layout`}
          >
            {widgets.chart && (
              <div className="widget chart-widget">
                <span>Patterns</span>
                <div className="chart-bars">
                  {[35, 60, 45, 82, 64, 94, 75].map((h, i) => (
                    <i key={i} style={{ "--bar": `${h}%` } as CSSProperties} />
                  ))}
                </div>
              </div>
            )}
            {widgets.progress && (
              <div className="widget ring-widget">
                <span>Progress</span>
                <div className="ring-chart">
                  <i />
                </div>
              </div>
            )}
            {widgets.table && (
              <div
                className={`widget table-widget ${sharedTable ? "is-shared" : ""}`}
              >
                <div className="table-head">
                  <span>Details</span>
                  {sharedTable && (
                    <span className="table-tools" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M4 5h16v14H4zM9.5 5v14M14.5 5v14"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                      Columns
                    </span>
                  )}
                </div>
                {["Explore", "Compare", "Understand"].map((label, i) => (
                  <div className="table-row" key={label}>
                    {sharedTable && (
                      <span
                        className="row-select"
                        data-selected={i === 1}
                        aria-hidden="true"
                      />
                    )}
                    <span>0{i + 1}</span>
                    <span>{label}</span>
                    <i />
                    <Arrow diagonal />
                  </div>
                ))}
              </div>
            )}
            {!enabled.length && (
              <p className="empty-builder">
                Choose a component to build this view.
              </p>
            )}
          </div>
        </div>
      </div>
      <figcaption>
        <div className="builder-controls">
          <fieldset className="builder-options">
            <legend>Components</legend>
            {(
              [
                ["chart", "Chart"],
                ["progress", "Progress"],
                ["table", "Table"],
              ] as const
            ).map(([key, label]) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={widgets[key]}
                  onChange={(e) => {
                    setView("Custom");
                    setWidgets({ ...widgets, [key]: e.target.checked });
                    mark(e.target.checked ? key : "widgets");
                  }}
                />
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d={widgetIcons[key]}
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                {label}
              </label>
            ))}
          </fieldset>
          <fieldset className="table-version" disabled={!widgets.table}>
            <legend>Table widget</legend>
            {(
              [
                [false, "Existing"],
                [true, "Shared"],
              ] as const
            ).map(([shared, label]) => (
              <label key={label}>
                <input
                  type="radio"
                  name="builder-table-version"
                  checked={sharedTable === shared}
                  onChange={() => {
                    setSharedTable(shared);
                    mark("table");
                  }}
                />
                {label}
              </label>
            ))}
          </fieldset>
        </div>
        <div className="configuration">
          <p className="configuration-label">
            <span>Configuration</span>
            <span>Updates as you build</span>
          </p>
          <pre aria-label="Configuration for this view">
            <code>
              {configuration.map((line) => (
                <span
                  key={
                    line.key === change.line
                      ? `${line.key}-${change.count}`
                      : line.key
                  }
                  className={
                    line.key === change.line ? "is-changed" : undefined
                  }
                >
                  {line.text}
                  {"\n"}
                </span>
              ))}
            </code>
          </pre>
        </div>
        <p>Illustrative component system · not a product screenshot</p>
      </figcaption>
    </figure>
  );
}

const timingScale = 8;
const reportedAfter = 3;
// Schematic only: the block sizes are illustrative, the totals are the reported result.
const sequentialSteps: [number, number][] = [
  [0, 1.6],
  [1.6, 3.1],
  [3.1, 4.5],
  [4.5, 6.3],
  [6.3, 8],
];
const parallelSteps: [number, number, boolean][] = [
  [0, 2.4, false],
  [0, 3, false],
  [0, 0.6, true],
  [0, 2.7, false],
  [0, 0.4, true],
];

function StepBar({
  from,
  to,
  time,
  early = false,
}: {
  from: number;
  to: number;
  time: number;
  early?: boolean;
}) {
  const fill = Math.max(0, Math.min(1, (time - from) / (to - from)));
  return (
    <span
      className={early ? "step-bar is-early" : "step-bar"}
      style={
        {
          "--from": from / timingScale,
          "--to": to / timingScale,
          "--fill": fill,
        } as CSSProperties
      }
    />
  );
}

export function PerformanceFigure() {
  const [time, setTime] = useState(timingScale);
  const [playing, setPlaying] = useState(false);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const next = Math.min(timingScale, (now - start) / 1000);
      setTime(next);
      if (next < timingScale) frame = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, run]);

  const progress = (total: number) =>
    time >= total
      ? `finished at ${total} seconds`
      : `${Math.round((time / total) * 100)}% done`;
  const status = `${time.toFixed(1)} seconds. After: ${progress(reportedAfter)}. Before: ${progress(timingScale)}.`;

  return (
    <figure className="case-figure performance-figure">
      <div className="figure-topline">
        <span>RENDERING TIME</span>
        <span>FIG. 04</span>
      </div>
      <div className="time-comparison">
        <div>
          <span className="time-label">BEFORE</span>
          <p>
            8<span>s</span>
          </p>
        </div>
        <span className="time-arrow">
          <Arrow />
        </span>
        <div>
          <span className="time-label">AFTER</span>
          <p>
            3<span>s</span>
          </p>
        </div>
      </div>
      <div
        className={playing ? "timing-tracks is-playing" : "timing-tracks"}
        role="img"
        aria-label="Schematic. Before, five steps run one after another and finish at 8 seconds. After, the same steps run together, two exit early, and all finish at 3 seconds."
        style={{ "--time": time / timingScale } as CSSProperties}
      >
        <div className="timing-axis" aria-hidden="true">
          {[0, 2, 4, 6, 8].map((tick) => (
            <span
              key={tick}
              style={{ "--at": tick / timingScale } as CSSProperties}
            >
              {tick}
              {tick === 8 && " s"}
            </span>
          ))}
        </div>
        <div className="timing-lane" data-done={time >= timingScale}>
          <p>
            <b>Before</b>
            <span>One after another</span>
          </p>
          <div className="lane-steps">
            {sequentialSteps.map(([from, to]) => (
              <StepBar key={from} from={from} to={to} time={time} />
            ))}
            <span className="lane-end" style={{ "--at": 1 } as CSSProperties} />
          </div>
        </div>
        <div className="timing-lane" data-done={time >= reportedAfter}>
          <p>
            <b>After</b>
            <span>In parallel, with early exits</span>
          </p>
          <div className="lane-steps">
            {parallelSteps.map(([from, to, early], i) => (
              <StepBar key={i} from={from} to={to} time={time} early={early} />
            ))}
            <span
              className="lane-end"
              style={{ "--at": reportedAfter / timingScale } as CSSProperties}
            />
          </div>
        </div>
        <span className="playhead" aria-hidden="true" />
      </div>
      <figcaption>
        <div className="timing-controls">
          <button
            className="replay-button"
            onClick={() => {
              if (
                window.matchMedia("(prefers-reduced-motion: reduce)").matches
              ) {
                setPlaying(false);
                setTime(timingScale);
                return;
              }
              setTime(0);
              setRun((r) => r + 1);
              setPlaying(true);
            }}
          >
            <span className="replay-icon" aria-hidden="true">
              <Replay />
            </span>
            Replay comparison
          </button>
          <label className="timing-scrub">
            <span>Elapsed</span>
            <input
              type="range"
              min={0}
              max={timingScale}
              step={0.1}
              value={time}
              aria-valuetext={status}
              onChange={(event) => {
                setPlaying(false);
                setTime(Number(event.target.value));
              }}
            />
            <output aria-hidden="true">{time.toFixed(1)} s</output>
          </label>
        </div>
        <p className="timing-legend" aria-hidden="true">
          <span className="legend-step" />
          Step
          <span className="legend-early" />
          Early exit
        </p>
        <p>
          Schematic · plays in real time. Block sizes are illustrative; the 8
          and 3 second totals are the reported 50 row result.
        </p>
      </figcaption>
    </figure>
  );
}

export function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(id);
  }, [copied]);
  return (
    <div className="copy-email">
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText("ziomran@gmail.com");
            setCopied(true);
            setError(false);
          } catch {
            setError(true);
          }
        }}
      >
        {copied ? "Copied" : "Copy email"}
        <span className="copy-mark" aria-hidden="true">
          {copied ? (
            <Check />
          ) : (
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M8 8V4h12v12h-4M4 8h12v12H4z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          )}
        </span>
      </button>
      <span className="sr-only" role="status">
        {copied
          ? "Email address copied."
          : error
            ? "Could not copy. The email address is ziomran@gmail.com."
            : ""}
      </span>
    </div>
  );
}
