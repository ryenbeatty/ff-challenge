"use client";

import type { CSSProperties } from "react";

import AskScribeHeader from "@/components/assistant/AskScribeHeader";
import AskScribePanel from "@/components/assistant/AskScribePanel";
import type { AssistantContentConfig } from "@/components/assistant/types";
import { MEETING_VIEW_PANEL_WIDTH } from "@/components/shell/constants";
import { cn } from "@/lib/shared/utils";

type AskScribeSidebarProps = {
  meetingId: string;
  className?: string;
  content?: AssistantContentConfig;
};

export default function AskScribeSidebar({
  meetingId,
  className,
  content,
}: AskScribeSidebarProps) {
  return (
    <aside
      aria-label="Ask Scribe"
      className={cn(
        "flex min-h-[min(50dvh,480px)] w-full shrink-0 flex-col overflow-hidden border-slate-200/90 bg-white lg:min-h-0 lg:w-[var(--meeting-view-panel-width)] lg:border-l",
        className,
      )}
      style={
        { "--meeting-view-panel-width": MEETING_VIEW_PANEL_WIDTH } as CSSProperties
      }
    >
      <AskScribeHeader />
      <AskScribePanel
        meetingId={meetingId}
        content={content}
        className="min-h-0 flex-1"
      />
    </aside>
  );
}
