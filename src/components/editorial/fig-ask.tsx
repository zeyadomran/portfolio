import { useEffect, useRef, useState } from "react";
import { Icon } from "./icon";
import { useReducedMotion } from "./use-figure-environment";

const prompts = ["What’s an overview?", "Help me make one"];
const answers = [
  "An overview is a summary of your data for a period, with anything unusual flagged at the top. You can share it or export it.",
  "Sure. I’ll open the form next to this chat and fill in what I can. Change anything you like before you save.",
];
type Message = { prompt: number; text: string; complete: boolean };

export function FigAsk() {
  const reduced = useReducedMotion();
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [period, setPeriod] = useState("");
  const [saved, setSaved] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const nameEdited = useRef(false);
  const periodEdited = useRef(false);
  const streamTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const fillTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const workspace = useRef<HTMLElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const log = useRef<HTMLDivElement>(null);
  useEffect(
    () => () => {
      clearTimeout(streamTimer.current);
      clearTimeout(fillTimer.current);
    },
    [],
  );
  useEffect(() => {
    if (!open) {
      if (hasOpened) launcher.current?.focus();
      return;
    }
    workspace.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (!workspace.current?.contains(document.activeElement)) return;
      if (e.key === "Escape") {
        e.preventDefault();
        clearTimeout(fillTimer.current);
        setOpen(false);
      }
      if (e.key !== "Tab" || !matchMedia("(max-width: 759px)").matches) return;
      const controls = workspace.current.querySelectorAll<HTMLElement>(
        "button,input,select",
      );
      const first = controls[0],
        last = controls[controls.length - 1];
      if (
        e.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === workspace.current)
      ) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, hasOpened]);
  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [messages, open]);
  function ask(prompt: number) {
    if (streaming || messages.some((m) => m.prompt === prompt)) return;
    setMessages((current) => [
      ...current,
      { prompt, text: reduced ? answers[prompt] : "", complete: reduced },
    ]);
    if (reduced) return;
    setStreaming(true);
    const words = answers[prompt].split(" ");
    let count = 0;
    const next = () => {
      count++;
      const complete = count >= words.length;
      setMessages((current) =>
        current.map((m) =>
          m.prompt === prompt
            ? { ...m, text: words.slice(0, count).join(" "), complete }
            : m,
        ),
      );
      if (complete) setStreaming(false);
      else streamTimer.current = setTimeout(next, 55);
    };
    streamTimer.current = setTimeout(next, 420);
  }
  function openWorkspace() {
    setOpen(true);
    if (hasOpened) return;
    setHasOpened(true);
    if (reduced) {
      setName("September overview");
      setPeriod("Last month");
      return;
    }
    let count = 0;
    const next = () => {
      count++;
      if (!nameEdited.current) setName("September overview".slice(0, count));
      if (count < "September overview".length)
        fillTimer.current = setTimeout(next, 45);
      else
        fillTimer.current = setTimeout(() => {
          if (!periodEdited.current) setPeriod("Last month");
        }, 350);
    };
    fillTimer.current = setTimeout(next, 45);
  }
  function closeWorkspace() {
    clearTimeout(fillTimer.current);
    setOpen(false);
  }
  function reset() {
    clearTimeout(streamTimer.current);
    clearTimeout(fillTimer.current);
    setMessages([]);
    setStreaming(false);
    setOpen(false);
    setName("");
    setPeriod("");
    setSaved(false);
    setAttempted(false);
    setHasOpened(false);
    nameEdited.current = false;
    periodEdited.current = false;
  }
  const done = [name.trim().length > 0, period !== "", saved];
  return (
    <figure className="ask-figure" aria-describedby="ask-note">
      <figcaption className="figure-label">
        <span>Fig. 02 · Answer, then action</span>
        <span>Illustrative</span>
      </figcaption>
      <div className={`ask-shell ${open ? "workspace-open" : ""}`}>
        <div className="ask-workspace-area">
          {!open && (
            <div className="ask-ghost" aria-hidden="true">
              <span>Your current screen</span>
              <p>Dashboard</p>
              <div>
                <i />
                <i />
                <i />
                <i />
              </div>
              <p>
                Ask the assistant something. If there’s work to do, it opens
                here, beside the chat.
              </p>
            </div>
          )}
          {open && (
            <section
              className="ask-workspace"
              aria-label="New overview"
              ref={workspace}
              tabIndex={-1}
            >
              <div className="sheet-handle" aria-hidden="true">
                <i />
              </div>
              <div className="workspace-heading">
                <span>New overview</span>
                <button aria-label="Close workspace" onClick={closeWorkspace}>
                  <span className="mobile-only">Back to chat</span>
                  <Icon name="close" />
                </button>
              </div>
              <form
                className="workspace-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  nameEdited.current = true;
                  periodEdited.current = true;
                  clearTimeout(fillTimer.current);
                  setAttempted(true);
                  setSaved(Boolean(name.trim() && period));
                }}
                noValidate
              >
                <label>
                  Name
                  <input
                    value={name}
                    placeholder="Monthly overview"
                    aria-invalid={attempted && !name.trim()}
                    aria-describedby={
                      attempted && !name.trim() ? "draft-status" : undefined
                    }
                    onChange={(e) => {
                      nameEdited.current = true;
                      setName(e.target.value);
                      setSaved(false);
                    }}
                  />
                </label>
                <label>
                  Period
                  <select
                    value={period}
                    aria-invalid={attempted && !period}
                    aria-describedby={
                      attempted && !period ? "draft-status" : undefined
                    }
                    onChange={(e) => {
                      periodEdited.current = true;
                      setPeriod(e.target.value);
                      setSaved(false);
                    }}
                  >
                    <option value="">Choose a period</option>
                    <option>This month</option>
                    <option>Last month</option>
                  </select>
                </label>
                <button className="control accent-fill" type="submit">
                  {saved ? (
                    <>
                      Draft saved <Icon name="check" />
                    </>
                  ) : (
                    "Save draft"
                  )}
                </button>
                <p className="draft-status" id="draft-status" role="status">
                  {saved
                    ? "Done, and the conversation never left the screen."
                    : attempted && (!name.trim() || !period)
                      ? "Add a name and a period to save the draft."
                      : ""}
                </p>
              </form>
            </section>
          )}
        </div>
        <div className="ask-chat">
          <div className="chat-heading">
            <Icon name="dot" />
            Assistant
          </div>
          <div
            className="chat-log"
            role="log"
            aria-label="Sample conversation"
            aria-busy={streaming}
            ref={log}
          >
            {messages.length === 0 && (
              <p className="chat-hint">
                Pick a question below. One gets an answer. The other gets you
                started.
              </p>
            )}
            {messages.map((m) => (
              <div className="chat-exchange" key={m.prompt}>
                <p className="user-bubble">{prompts[m.prompt]}</p>
                <p className="assistant-answer">
                  {m.text}
                  {!m.complete && (
                    <span className="stream-caret" aria-hidden="true" />
                  )}
                </p>
                {m.prompt === 1 && m.complete && (
                  <>
                    <button
                      className="launch-workspace"
                      ref={launcher}
                      onClick={openWorkspace}
                    >
                      Open the form{" "}
                      <span className="desktop-only">beside this chat</span>
                      <Icon name="right" />
                    </button>
                    {hasOpened && (
                      <ol className="ask-steps" aria-label="Steps">
                        {["Name it", "Pick a period", "Save the draft"].map(
                          (label, i) => (
                            <li key={label} className={done[i] ? "done" : ""}>
                              <span aria-hidden="true">
                                {done[i] ? <Icon name="check" /> : i + 1}
                              </span>
                              <span>{label}</span>
                              {done[i] && (
                                <span className="sr-only">(done)</span>
                              )}
                            </li>
                          ),
                        )}
                      </ol>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="prompt-chips">
            {prompts.map((prompt, i) => (
              <button
                key={prompt}
                disabled={streaming || messages.some((m) => m.prompt === i)}
                onClick={() => ask(i)}
              >
                {prompt}
              </button>
            ))}
            {messages.length === 2 && !streaming && (
              <button className="reset-chip" onClick={reset}>
                Start over
              </button>
            )}
          </div>
        </div>
      </div>
      <p className="figure-footnote" id="ask-note">
        Layout study with sample content. The side-by-side workspace exists in
        internal builds.
      </p>
    </figure>
  );
}
