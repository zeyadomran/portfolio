import { useEffect, useRef, useState } from "react";
import { BrandMark } from "./brand-mark";
import { Icon } from "./icon";

const sections = [
  ["work", "Work"],
  ["projects", "Projects"],
  ["about", "About"],
  ["contact", "Contact"],
];
const stories = [
  ["assistant", "AI assistant"],
  ["systems", "Shared components"],
  ["optimization", "Performance"],
];

export function Navigation() {
  const [active, setActive] = useState("");
  const [clock, setClock] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            setActive(el.dataset.nav || el.id);
          }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    document
      .querySelectorAll("[data-section]")
      .forEach((el) => observer.observe(el));
    let frame = 0;
    const update = () => {
      frame = 0;
      const length = document.documentElement.scrollHeight - innerHeight;
      if (progress.current)
        progress.current.style.transform = `scaleX(${length > 0 ? scrollY / length : 0})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      observer.disconnect();
      resize.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const sheet = dialog.current;
    const trigger = opener.current;
    sheet?.showModal();
    const updateClock = () =>
      setClock(
        new Date().toLocaleTimeString("en-CA", {
          timeZone: "America/Toronto",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
    const timer = window.setInterval(updateClock, 15000);
    const query = matchMedia("(min-width: 760px)");
    const closeOnDesktop = () => {
      if (query.matches) setOpen(false);
    };
    query.addEventListener("change", closeOnDesktop);
    return () => {
      clearInterval(timer);
      query.removeEventListener("change", closeOnDesktop);
      document.body.style.overflow = previous;
      sheet?.close();
      trigger?.focus();
    };
  }, [open]);
  return (
    <>
      <header className="ed-header">
        <a className="ed-brand" href="#top" aria-label="Zeyad Omran, home">
          <BrandMark size={22} />
          <span>Zeyad Omran</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {sections.map(([id, label], i) => (
            <a
              href={`#${id}`}
              key={id}
              aria-current={active === id ? "location" : undefined}
            >
              <span>0{i + 1}</span>
              {label}
            </a>
          ))}
        </nav>
        <div className="header-end">
          <button
            className="control index-button"
            ref={opener}
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => {
              setClock(
                new Date().toLocaleTimeString("en-CA", {
                  timeZone: "America/Toronto",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }),
              );
              setOpen(true);
            }}
          >
            Index
          </button>
        </div>
        <span className="reading-progress" ref={progress} aria-hidden="true" />
      </header>
      <noscript>
        <nav className="fallback-nav" aria-label="Section navigation">
          {sections.map(([id, label]) => (
            <a href={`#${id}`} key={id}>
              {label}
            </a>
          ))}
        </nav>
        <style>
          {
            ".index-button,.lens-controls button,.copy-email{display:none!important}"
          }
        </style>
      </noscript>
      <dialog
        className="index-sheet"
        ref={dialog}
        aria-label="Page index"
        aria-modal="true"
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key !== "Tab") return;
          const controls =
            dialog.current?.querySelectorAll<HTMLElement>("a[href],button");
          if (!controls?.length) return;
          const first = controls[0],
            last = controls[controls.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }}
      >
        <div className="index-top">
          <span>Index · {clock}</span>
          <button className="control" onClick={() => setOpen(false)}>
            Close <Icon name="close" />
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {sections.map(([id, label], i) => (
            <div key={id}>
              <a
                className="index-row"
                href={`#${id}`}
                aria-current={active === id ? "location" : undefined}
                onClick={() => setOpen(false)}
              >
                <span>0{i + 1}</span>
                <span>{label}</span>
                <small>{i === 0 ? "3 stories" : i === 1 ? "2" : ""}</small>
              </a>
              {i === 0 &&
                stories.map(([story, name], j) => (
                  <a
                    className="index-row index-sub"
                    key={story}
                    href={`#${story}`}
                    onClick={() => setOpen(false)}
                  >
                    <span>1.{j + 1}</span>
                    <span>{name}</span>
                  </a>
                ))}
            </div>
          ))}
        </nav>
        <div className="index-bottom">
          <a href="mailto:ziomran@gmail.com">ziomran@gmail.com</a>
          <div>
            <a
              href="https://linkedin.com/in/zeyadomran"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <Icon name="external" />
            </a>
            <a
              href="https://github.com/zeyadomran"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <Icon name="external" />
            </a>
            <a href="/Zeyad_Omran_Resume.pdf" download>
              Resume <Icon name="down" />
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
