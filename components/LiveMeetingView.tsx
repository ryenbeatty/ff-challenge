"use client";

import { Suspense } from "react";

import LiveMeetingSummarisingState from "@/components/LiveMeetingSummarisingState";
import TranscriptList from "@/components/transcript/TranscriptList";
import TranscriptListSlot from "@/components/transcript/TranscriptListSlot";
import { useLiveMeetingStop } from "@/lib/live-meeting-stop-context";
import { useMeetingQuery } from "@/lib/meetings-query";
import { TRANSCRIPT_PANEL_HEIGHT_CLASS } from "@/lib/transcript-layout";
import { useSimulatedTranscript } from "@/lib/use-simulated-transcript";

type LiveMeetingViewProps = {
  meetingId: string;
};

function TranscriptListFallback() {
  return <p className="text-sm text-slate-500">Loading transcript...</p>;
}

export default function LiveMeetingView({ meetingId }: LiveMeetingViewProps) {
  const { isStoppingMeeting } = useLiveMeetingStop();
  const { data: meeting, isLoading } = useMeetingQuery(meetingId);
  const isLive = meeting?.status === "live";
  const { streamedTranscript, activeSentenceId } = useSimulatedTranscript({
    transcript: meeting?.transcript ?? [],
    anchorTime: meeting?.createdAt ?? new Date().toISOString(),
    enabled: isLive,
  });

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading meeting...</p>;
  }

  if (!meeting) {
    return (
      <section className="bg-white p-6">
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
      className={`flex ${TRANSCRIPT_PANEL_HEIGHT_CLASS} min-h-0 flex-col overflow-hidden bg-white p-6`}
    >
      <TranscriptListSlot className="min-h-0 flex-1">
        {isStoppingMeeting ? (
          <LiveMeetingSummarisingState meeting={meeting} />
        ) : (
          <Suspense fallback={<TranscriptListFallback />}>
            <TranscriptList
              transcript={isLive ? streamedTranscript : meeting.transcript}
              speakers={meeting.speakers}
              className="h-full min-h-0"
              variant={isLive ? ("live" as const) : ("default" as const)}
              activeSentenceId={activeSentenceId}
              showSearchBar={false}
            />
          </Suspense>
        )}
      </TranscriptListSlot>
    </section>
  );
}
