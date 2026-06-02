"use client";

import { Suspense, type CSSProperties } from "react";

import TranscriptList from "@/components/transcript/TranscriptList";
import TranscriptListSlot from "@/components/transcript/TranscriptListSlot";
import TranscriptLoadingState from "@/components/transcript/TranscriptLoadingState";
import { MEETING_VIEW_PANEL_WIDTH } from "@/components/shell/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Speaker, TranscriptSentence } from "@/lib/meetings/types";

type MeetingViewSidebarProps = {
  transcript: TranscriptSentence[];
  speakers: Speaker[];
};

export default function MeetingViewSidebar({
  transcript,
  speakers,
}: MeetingViewSidebarProps) {
  return (
    <aside
      aria-label="Meeting panel"
      className="flex min-h-[min(50dvh,480px)] w-full shrink-0 flex-col overflow-hidden border-slate-200/90 bg-white lg:min-h-0 lg:w-[var(--meeting-view-panel-width)] lg:border-l"
      style={
        { "--meeting-view-panel-width": MEETING_VIEW_PANEL_WIDTH } as CSSProperties
      }
    >
      <Tabs defaultValue="transcript" className="flex h-full min-h-0 w-full flex-1 flex-col gap-0">
        <TabsList className="w-full shrink-0 justify-start bg-white">
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
        </TabsList>
        <TabsContent
          value="transcript"
          className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-2 data-[state=inactive]:hidden"
        >
          <TranscriptListSlot>
            <Suspense fallback={<TranscriptLoadingState />}>
              <TranscriptList
                transcript={transcript}
                speakers={speakers}
                className="h-full min-h-0"
              />
            </Suspense>
          </TranscriptListSlot>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
