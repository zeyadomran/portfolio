import { useEffect, useRef, useState } from "react";
import { Icon } from "./icon";

export function CopyEmail() {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timeout.current), []);
  async function copy() {
    clearTimeout(timeout.current);
    try {
      await navigator.clipboard.writeText("ziomran@gmail.com");
      setStatus("copied");
      timeout.current = setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("failed");
    }
  }
  return (
    <div className="copy-email">
      <button
        className={`control ${status === "copied" ? "is-copied" : ""}`}
        onClick={() => void copy()}
      >
        {status === "copied" ? (
          <>
            Copied <Icon name="check" />
          </>
        ) : (
          "Copy"
        )}
        <span className="sr-only"> email address</span>
      </button>
      <span className="copy-status" role="status">
        {status === "failed"
          ? "Couldn’t copy. Select the email address to copy it."
          : status === "copied"
            ? "Email copied."
            : ""}
      </span>
    </div>
  );
}
