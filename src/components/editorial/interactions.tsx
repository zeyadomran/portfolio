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

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h16m-7-7 7 7-7 7"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function Navigation() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting)
            setActive(
              (entry.target as HTMLElement).dataset.nav || entry.target.id,
            );
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
      <a href="#home" className="ed-brand" aria-label="Zeyad Omran, home">
        <BrandMark />
      </a>
      <nav aria-label="Main navigation">
        {[
          ["work", "Work"],
          ["about", "About"],
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
              <span>↗</span>
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
              <span>●</span>
            </div>
            <p>
              A clear
              <br />
              next step.
            </p>
            <span className="plane-arrow">↗</span>
          </div>
        </div>
        <span className="stage-coordinate bottom">COMPLEXITY → CLARITY</span>
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

export function AssistantFigure() {
  const [workspace, setWorkspace] = useState(false);
  const launcher = useRef<HTMLButtonElement>(null);
  const workspaceRef = useRef<HTMLElement>(null);
  const workspaceOpener = useRef<HTMLButtonElement>(null);
  const [overviewName, setOverviewName] = useState("Monthly overview");
  const [period, setPeriod] = useState("This month");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (workspace) workspaceRef.current?.focus({ preventScroll: true });
  }, [workspace]);

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
        <span>01</span>
      </div>
      <div className={`assistant-shell ${workspace ? "workspace-open" : ""}`}>
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
                  ×
                </button>
              </div>
              <div className="workspace-content">
                <span className="workspace-label">ILLUSTRATIVE FORM</span>
                <h4>
                  Create an
                  <br />
                  overview
                </h4>
                <label>
                  Overview name
                  <input
                    value={overviewName}
                    aria-label="Illustrative overview name"
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
                    value={period}
                    onChange={(e) => {
                      setPeriod(e.target.value);
                      setSaved(false);
                    }}
                  >
                    <option>This month</option>
                    <option>Last month</option>
                  </select>
                </label>
                <button className="demo-save" onClick={() => setSaved(true)}>
                  {saved ? "Draft ready ✓" : "Prepare draft"}
                </button>
                <p role="status">
                  {saved
                    ? "Your draft is ready. Your conversation stays in view."
                    : "Work here. Keep the conversation beside you."}
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
            <span>−</span>
          </div>
          <div className="panel-conversation">
            <p className="panel-user-message">Can I create an overview here?</p>
            <span className="assistant-symbol" aria-hidden="true">
              ✳
            </span>
            <h4>Stay in context.</h4>
            <p>Open the task beside this conversation.</p>
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
            <span>↑</span>
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

export function BuilderFigure() {
  const [view, setView] = useState("Overview");
  const [widgets, setWidgets] = useState({
    chart: true,
    progress: true,
    table: true,
  });
  const chooseView = (next: string) => {
    setView(next);
    setWidgets({
      chart: next !== "Detail",
      progress: next === "Overview",
      table: true,
    });
  };
  return (
    <figure className="case-figure builder-figure">
      <div className="figure-topline">
        <span>SHARED FOUNDATION → MANY VIEWS</span>
        <span>02</span>
      </div>
      <div className="builder-window">
        <div className="builder-menu">
          <span className="builder-mark">◧</span>
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="builder-page" id="builder-demo">
          <div className="builder-heading">
            <h4>{view}</h4>
            <span>↗</span>
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
              <div className="widget table-widget">
                <span>Details</span>
                {["Explore", "Compare", "Understand"].map((label, i) => (
                  <div key={label}>
                    <span>0{i + 1}</span>
                    <span>{label}</span>
                    <i />
                    <span>↗</span>
                  </div>
                ))}
              </div>
            )}
            {!Object.values(widgets).some(Boolean) && (
              <p className="empty-builder">
                Choose a component to build this view.
              </p>
            )}
          </div>
        </div>
      </div>
      <figcaption>
        <fieldset className="builder-options">
          <legend>Choose components</legend>
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
                }}
              />
              {label}
            </label>
          ))}
        </fieldset>
        <div
          className="figure-step-controls"
          role="group"
          aria-label="Explore reusable interface layouts"
        >
          {["Overview", "Analysis", "Detail"].map((v) => (
            <button
              key={v}
              aria-controls="builder-demo"
              aria-pressed={view === v}
              onClick={() => chooseView(v)}
            >
              {v}
            </button>
          ))}
        </div>
        <details className="configuration">
          <summary>
            See the configuration<span aria-hidden="true">+</span>
          </summary>
          <pre>
            {JSON.stringify(
              {
                components: Object.entries(widgets)
                  .filter(([, enabled]) => enabled)
                  .map(([key]) => key),
              },
              null,
              2,
            )}
          </pre>
        </details>
        <p>Illustrative component system · not a product screenshot</p>
      </figcaption>
    </figure>
  );
}

export function PerformanceFigure() {
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => setPlaying(false), 8100);
    return () => clearTimeout(id);
  }, [playing, run]);
  return (
    <figure className="case-figure performance-figure">
      <div className="figure-topline">
        <span>RENDERING TIME</span>
        <span>03</span>
      </div>
      <div className="time-comparison">
        <div>
          <span className="time-label">BEFORE</span>
          <p>
            8<span>s</span>
          </p>
        </div>
        <span className="time-arrow">→</span>
        <div>
          <span className="time-label">AFTER</span>
          <p>
            3<span>s</span>
          </p>
        </div>
      </div>
      <p className="timing-caption">Elapsed time · shared scale of 8 seconds</p>
      <div
        key={run}
        className={`timing-tracks ${playing ? "is-playing" : ""}`}
        aria-hidden="true"
      >
        <div>
          <span>Before</span>
          <div>
            <i style={{ "--duration": "8s" } as CSSProperties} />
          </div>
          <span>8s</span>
        </div>
        <div>
          <span>After</span>
          <div>
            <i style={{ "--duration": "3s" } as CSSProperties} />
          </div>
          <span>3s</span>
        </div>
      </div>
      <figcaption>
        <button
          className="replay-button"
          onClick={() => {
            setRun((r) => r + 1);
            setPlaying(
              !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
            );
          }}
        >
          <span aria-hidden="true">↻</span>
          {playing ? "Replay from start" : "Replay comparison"}
          <Arrow />
        </button>
        <p>Reported rendering time · illustrative replay</p>
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
        <span aria-hidden="true">{copied ? "✓" : "+"}</span>
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
