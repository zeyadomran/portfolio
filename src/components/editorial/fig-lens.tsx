import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useFigureEnvironment } from "./use-figure-environment";

const codes = [
  "ORD-10421",
  "SKU-88A",
  "3PL-04",
  "ETA 10/07",
  "EXC-17",
  "P2",
  "ORD-10422",
  "SKU-12C",
  "3PL-11",
  "ETA 10/09",
  "—",
  "P4",
  "ORD-10423",
  "SKU-88A",
  "3PL-04",
  "ETA 10/06",
  "EXC-03",
  "P1",
  "ORD-10424",
  "SKU-40F",
  "DC-02",
  "ETA 10/12",
  "—",
  "P3",
  "ORD-10425",
  "SKU-07B",
  "3PL-09",
  "ETA 10/08",
  "HOLD",
  "P2",
  "ORD-10426",
  "SKU-88A",
  "DC-01",
  "ETA 10/10",
  "—",
  "P4",
  "ORD-10427",
  "SKU-31D",
  "3PL-04",
  "ETA 10/07",
  "EXC-17",
  "P1",
  "ORD-10428",
  "SKU-12C",
  "DC-02",
  "ETA 10/11",
  "—",
  "P3",
  "ORD-10429",
  "SKU-55E",
  "3PL-11",
  "ETA 10/09",
  "—",
  "P4",
  "ORD-10430",
  "SKU-07B",
  "DC-01",
  "ETA 10/13",
  "HOLD",
  "P2",
  "ORD-10431",
  "SKU-88A",
  "3PL-09",
  "ETA 10/08",
  "—",
  "P3",
  "ORD-10432",
  "SKU-40F",
  "3PL-04",
  "ETA 10/10",
  "—",
  "P4",
];
const rows = [
  ["#1042", "Late from Toronto, customer waiting", "Late", "Reschedule"],
  ["#1047", "On hold until payment clears", "Hold", "Review"],
  ["#1051", "Carrier delayed in Calgary", "Risk", "Notify"],
];

export function FigLens() {
  const { ref, nearby, reduced } = useFigureEnvironment();
  const stage = useRef<HTMLDivElement>(null);
  const target = useRef<{ x: number; y: number; until: number } | null>(null);
  const [full, setFull] = useState(false);
  useEffect(() => {
    const el = stage.current;
    if (!el || !nearby || reduced) return;
    let frame = 0;
    let x = el.clientWidth / 2,
      y = el.clientHeight / 2;
    let radius = matchMedia("(max-width: 759px)").matches ? 68 : 96;
    const start = performance.now();
    const tick = (now: number) => {
      const w = el.clientWidth,
        h = el.clientHeight;
      const pointer =
        target.current && target.current.until > now ? target.current : null;
      const t = now - start;
      const tx = pointer?.x ?? w * (0.5 + 0.33 * Math.sin(t * 0.00055));
      const ty = pointer?.y ?? h * (0.52 + 0.26 * Math.sin(t * 0.0009 + 1.2));
      x += (tx - x) * (pointer ? 0.22 : 0.06);
      y += (ty - y) * (pointer ? 0.22 : 0.06);
      radius +=
        ((full
          ? Math.hypot(w, h) + 20
          : matchMedia("(max-width: 759px)").matches
            ? 68
            : 96) -
          radius) *
        0.12;
      el.style.setProperty("--lens-x", `${x}px`);
      el.style.setProperty("--lens-y", `${y}px`);
      el.style.setProperty("--lens-r", `${radius}px`);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [full, nearby, reduced]);
  function point(e: PointerEvent<HTMLDivElement>) {
    if (full) return;
    const box = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - box.left,
      y = e.clientY - box.top;
    target.current = {
      x,
      y,
      until: e.pointerType === "mouse" ? Infinity : performance.now() + 3500,
    };
    if (reduced) {
      e.currentTarget.style.setProperty("--lens-x", `${x}px`);
      e.currentTarget.style.setProperty("--lens-y", `${y}px`);
    }
  }
  return (
    <figure className="lens-figure" ref={ref} aria-describedby="lens-note">
      <div className="figure-label">
        <span>Fig. 01 · Same data, less noise</span>
        <span className="desktop-only">Move to look closer</span>
        <span className="mobile-only">Tap to look</span>
      </div>
      <div
        className={`lens-stage ${full ? "is-full" : ""}`}
        ref={stage}
        onPointerMove={(e) => {
          if (e.pointerType === "mouse") point(e);
        }}
        onPointerDown={point}
        onPointerLeave={() => {
          target.current = null;
        }}
      >
        <div className="lens-mess" aria-hidden="true">
          <div className="mess-toolbar">
            {[
              "Filter",
              "Group",
              "Pivot",
              "Export",
              "Sort",
              "Bulk edit",
              "Views",
              "Columns",
              "Refresh",
              "Reset",
              "More",
            ].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <div className="mess-alerts">
            <span>EXC-17 unresolved</span>
            <span>SKU mapping (6)</span>
            <span>14 filters active</span>
            <span>3PL latency</span>
          </div>
          <div className="mess-grid">
            {codes.map((code, i) => (
              <span
                key={i}
                className={`${/EXC|HOLD|P1/.test(code) ? "hot" : ""} ${i % 6 > 3 ? "mess-extra" : ""}`}
              >
                {code}
              </span>
            ))}
          </div>
          <div className="mess-footer">
            <span>Rows 1–48 of 1,206 · 14 filters · 3 views unsaved</span>
            <span>Last sync 04:12:09</span>
          </div>
        </div>
        <div className="lens-clear">
          <p className="mono muted">Orders · Today</p>
          <p className="tidy-title">
            3 orders need you.
            <br />
            <span>Everything else is on track.</span>
          </p>
          <div className="tidy-rows">
            {rows.map(([id, what, status, action], i) => (
              <div key={id} className="tidy-row">
                <span>{id}</span>
                <span title={what}>{what}</span>
                <span className="tidy-tag">{status}</span>
                <span className={`tidy-action ${i === 0 ? "accent-fill" : ""}`}>
                  {action}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="lens-ring" aria-hidden="true">
          <span>Simplified</span>
        </div>
      </div>
      <figcaption className="lens-controls">
        <p className="lens-status" id="lens-note">
          {full
            ? "Same data. One decision at a time."
            : "Everything is technically here. The lens shows what someone actually needs."}
        </p>
        <button
          className={`control ${full ? "" : "accent-fill"}`}
          aria-pressed={full}
          onClick={() => setFull(!full)}
        >
          {full ? "Show the mess" : "Simplify all"}
        </button>
      </figcaption>
    </figure>
  );
}
