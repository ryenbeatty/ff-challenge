"use client";

import { Suspense } from "react";

import TranscriptList from "@/components/transcript/TranscriptList";
import TranscriptListSlot from "@/components/transcript/TranscriptListSlot";
import { useMeetingQuery } from "@/lib/meetings-query";
import { TRANSCRIPT_PANEL_HEIGHT_CLASS } from "@/lib/transcript-layout";

type LiveMeetingViewProps = {
  meetingId: string;
};

function TranscriptListFallback() {
  return <p className="text-sm text-slate-500">Loading transcript...</p>;
}

export default function LiveMeetingView({ meetingId }: LiveMeetingViewProps) {
  const { data: meeting, isLoading } = useMeetingQuery(meetingId);

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading meeting...</p>;
  }

  if (!meeting) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-normal leading-7 tracking-[-0.2px] text-slate-900">
          Meeting not found
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          This meeting does not exist in local storage.
        </p>
      </section>
    );
  }

  return (
    <section
      className={`flex ${TRANSCRIPT_PANEL_HEIGHT_CLASS} min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-6`}
    >
      <h2 className="shrink-0 text-base font-semibold text-slate-900">Live transcript feed</h2>
      <TranscriptListSlot className="mt-4">
        <Suspense fallback={<TranscriptListFallback />}>
          <TranscriptList
            transcript={meeting.transcript}
            speakers={meeting.speakers}
            className="h-full min-h-0"
          />
        </Suspense>
      </TranscriptListSlot>
    </section>
  );
}
