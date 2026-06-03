"use client";

import type { CSSProperties, ReactNode } from "react";

import AskFirefliesHeader from "@/components/assistant/AskFirefliesHeader";
import AskFirefliesIcon from "@/components/assistant/AskFirefliesIcon";
import AskFirefliesPanel from "@/components/assistant/AskFirefliesPanel";
import { MEETING_VIEW_PANEL_WIDTH } from "@/components/shell/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/shared/utils";

export type MeetingPanelTab = "transcript" | "ask-fireflies";

export type AskFirefliesChrome = "tab-icon" | "header";

type MeetingPanelSidebarProps = {
  meetingId: string;
  transcript: ReactNode;
  activeTab?: MeetingPanelTab;
  onTabChange?: (tab: MeetingPanelTab) => void;
  defaultTab?: MeetingPanelTab;
  placeholder?: ReactNode;
  askFirefliesChrome?: AskFirefliesChrome;
  className?: string;
};

export default function MeetingPanelSidebar({
  meetingId,
  transcript,
  activeTab,
  onTabChange,
  defaultTab = "transcript",
  placeholder,
  askFirefliesChrome = "tab-icon",
  className,
}: MeetingPanelSidebarProps) {
  const isControlled = activeTab !== undefined && onTabChange !== undefined;

  return (
    <aside
      aria-label="Meeting panel"
      className={cn(
        "flex min-h-[min(50dvh,480px)] w-full shrink-0 flex-col overflow-hidden border-slate-200/90 bg-white lg:min-h-0 lg:w-[var(--meeting-view-panel-width)] lg:border-l",
        className,
      )}
      style={
        { "--meeting-view-panel-width": MEETING_VIEW_PANEL_WIDTH } as CSSProperties
      }
    >
      <Tabs
        {...(isControlled
          ? { value: activeTab, onValueChange: (value) => onTabChange(value as MeetingPanelTab) }
          : { defaultValue: defaultTab })}
        className="flex h-full min-h-0 w-full flex-1 flex-col gap-0"
      >
        <TabsList className="w-full shrink-0 justify-start bg-white">
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="ask-fireflies">
            {askFirefliesChrome === "tab-icon" ? (
              <span className="inline-flex items-center gap-2">
                <AskFirefliesIcon size="sm" />
                Ask Fireflies
              </span>
            ) : (
              "Ask Fireflies"
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="transcript"
          className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-2 data-[state=inactive]:hidden"
        >
          {placeholder ?? transcript}
        </TabsContent>

        <TabsContent
          value="ask-fireflies"
          className="flex min-h-0 flex-1 flex-col data-[state=inactive]:hidden"
        >
          {placeholder ?? (
            <>
              {askFirefliesChrome === "header" ? <AskFirefliesHeader /> : null}
              <AskFirefliesPanel meetingId={meetingId} className="min-h-0 flex-1" />
            </>
          )}
        </TabsContent>
      </Tabs>
    </aside>
  );
}

function MeetingPanelPlaceholder() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-8 text-center">
      <p className="text-sm text-slate-500">
        Select a meeting to ask Fireflies about it.
      </p>
    </div>
  );
}

export { MeetingPanelPlaceholder };
