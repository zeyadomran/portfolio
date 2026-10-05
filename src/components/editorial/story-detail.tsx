import { useState, type ReactNode } from "react";
import { Icon } from "./icon";

export function StoryDetail({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<boolean | undefined>(undefined);
  return (
    <details
      className="story-detail"
      onToggle={(e) => setOpen(e.currentTarget.open)}
    >
      <summary aria-expanded={open}>
        <Icon name="plus" className="detail-plus" />
        <Icon name="minus" className="detail-minus" />
        Read the story
      </summary>
      <div className="story-detail-body">{children}</div>
    </details>
  );
}
