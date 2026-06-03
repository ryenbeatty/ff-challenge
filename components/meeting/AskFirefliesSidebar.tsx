"use client";

import type { CSSProperties } from "react";

import AskFirefliesHeader from "@/components/assistant/AskFirefliesHeader";
import AskFirefliesPanel from "@/components/assistant/AskFirefliesPanel";
import type { AssistantContentConfig } from "@/components/assistant/types";
import { MEETING_VIEW_PANEL_WIDTH } from "@/components/shell/constants";
import { cn } from "@/lib/shared/utils";

type AskFirefliesSidebarProps = {
  meetingId: string;
  className?: string;
  content?: AssistantContentConfig;
};

export default function AskFirefliesSidebar({
  meetingId,
  className,
  content,
}: AskFirefliesSidebarProps) {
  return (
    <aside
      aria-label="Ask Fireflies"
      className={cn(
        "flex min-h-[min(50dvh,480px)] w-full shrink-0 flex-col overflow-hidden border-slate-200/90 bg-white lg:min-h-0 lg:w-[var(--meeting-view-panel-width)] lg:border-l",
        className,
      )}
      style={
        { "--meeting-view-panel-width": MEETING_VIEW_PANEL_WIDTH } as CSSProperties
      }
    >
      <AskFirefliesHeader />
      <AskFirefliesPanel
        meetingId={meetingId}
        content={content}
        className="min-h-0 flex-1"
      />
    </aside>
  );
}
