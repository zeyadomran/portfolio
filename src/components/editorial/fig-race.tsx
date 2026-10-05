import { useEffect, useState, type CSSProperties } from "react";
import { Icon } from "./icon";
import { useReducedMotion } from "./use-figure-environment";

const runs = [
  {
    id: "before",
    label: "Before",
    total: 8,
    description: "Five steps, one after another",
    steps: [
      [0, 1.6],
      [1.6, 3.1],
      [3.1, 4.5],
      [4.5, 6.3],
      [6.3, 8],
    ],
  },
  {
    id: "after",
    label: "After",
    total: 3,
    description: "Same steps, together, two exit early",
    steps: [
      [0, 2.4],
      [0, 3],
      [0, 0.6],
      [0, 2.7],
      [0, 0.4],
    ],
  },
];

export function FigRace() {
  const reduced = useReducedMotion();
  const [elapsed, setElapsed] = useState(8);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const value = reduced ? 8 : Math.min(8, (now - start) / 1000);
      setElapsed(value);
      if (value >= 8) setPlaying(false);
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, reduced]);
  return (
    <figure className="race-figure" aria-describedby="race-note">
      <figcaption className="figure-label">
        <span>Fig. 04 · Same table, two runs</span>
        <span>Real time</span>
      </figcaption>
      <div className="race-panels">
        {runs.map((run) => {
          const done = elapsed >= run.total;
          return (
            <div
              key={run.id}
              className={`race-panel race-${run.id} ${done ? "is-done" : "is-waiting"}`}
            >
              <div className="race-heading">
                <span>{run.label}</span>
                <span className="race-state">
                  {done ? (
                    <>
                      <Icon name="check" />
                      Rendered
                    </>
                  ) : elapsed === 0 ? (
                    "Ready"
                  ) : (
                    "Waiting…"
                  )}
                </span>
              </div>
              <p className="race-timer">
                {Math.min(run.total, elapsed).toFixed(1)}
                <span>s</span>
              </p>
              <p className="race-description">{run.description}</p>
              <div
                className="race-timeline"
                aria-label={`${run.label}: ${run.description}. ${run.total} seconds total.`}
              >
                {run.steps.map(([start, end], i) => {
                  const early = run.id === "after" && (i === 2 || i === 4);
                  const progress = Math.max(
                    0,
                    Math.min(1, (elapsed - start) / (end - start)),
                  );
                  return (
                    <div
                      className="race-step"
                      key={i}
                      style={
                        {
                          "--start": `${(start / 8) * 100}%`,
                          "--duration": `${((end - start) / 8) * 100}%`,
                          "--step-progress": progress,
                        } as CSSProperties
                      }
                    >
                      <span
                        className={`step-track ${early ? "early-exit" : ""}`}
                      >
                        <i />
                      </span>
                      {early && <span className="early-label">Early</span>}
                    </div>
                  );
                })}
                <div className="race-axis">
                  <span>0</span>
                  <span>4</span>
                  <span>8 s</span>
                </div>
              </div>
              <div className="race-table" aria-hidden="true">
                <div>
                  <span>Table · 50 rows</span>
                  <span>Status</span>
                </div>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="race-table-row">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <i style={{ width: `${[82, 65, 91, 70, 52][i]}%` }} />
                    <i />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="race-controls">
        <button
          className="control accent-fill"
          onClick={() => {
            setElapsed(reduced ? 8 : 0);
            setPlaying(!reduced);
          }}
          disabled={playing}
        >
          <Icon name="right" />
          Run both
        </button>
        <label className="sr-only" htmlFor="race-elapsed">
          Elapsed
        </label>
        <input
          id="race-elapsed"
          type="range"
          min="0"
          max="8"
          step="0.1"
          value={elapsed}
          aria-valuetext={`${elapsed.toFixed(1)} seconds. After: ${elapsed >= 3 ? "finished at 3 seconds" : `${Math.round((elapsed / 3) * 100)}% done`}. Before: ${elapsed >= 8 ? "finished at 8 seconds" : `${Math.round((elapsed / 8) * 100)}% done`}.`}
          onChange={(e) => {
            setPlaying(false);
            setElapsed(Number(e.target.value));
          }}
        />
        <output htmlFor="race-elapsed">{elapsed.toFixed(1)} s</output>
      </div>
      <p className="figure-footnote" id="race-note">
        Schematic. Block sizes are illustrative; the 8 and 3 second totals are
        the reported 50-row result.
      </p>
    </figure>
  );
}
