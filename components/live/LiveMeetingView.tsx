"use client";

import { Suspense } from "react";

import LiveMeetingSummarisingState from "@/components/live/LiveMeetingSummarisingState";
import { DEMO_LIVE_MEETING_ASSISTANT } from "@/demo/assistant";
import AskScribeSidebar from "@/components/meeting/AskScribeSidebar";
import LoadingText from "@/components/states/LoadingText";
import MeetingNotFoundState from "@/components/states/MeetingNotFoundState";
import TranscriptList from "@/components/transcript/TranscriptList";
import TranscriptListSlot from "@/components/transcript/TranscriptListSlot";
import TranscriptLoadingState from "@/components/transcript/TranscriptLoadingState";
import { useLiveMeetingStop } from "@/components/live/LiveMeetingStopProvider";
import { useMeetingQuery } from "@/lib/meetings/query";
import { useSimulatedTranscript } from "@/lib/transcript/use-simulated-transcript";

type LiveMeetingViewProps = {
  meetingId: string;
};

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
    return <LoadingText>Loading meeting...</LoadingText>;
  }

  if (!meeting) {
    return (
      <section className="bg-white p-6">
        <MeetingNotFoundState />
      </section>
    );
  }

  const transcriptContent = (
    <TranscriptListSlot className="min-h-0 flex-1">
      {isStoppingMeeting ? (
        <LiveMeetingSummarisingState meeting={meeting} />
      ) : (
        <Suspense fallback={<TranscriptLoadingState />}>
          <TranscriptList
            transcript={isLive ? streamedTranscript : meeting.transcript}
            speakers={meeting.speakers}
            className="h-full min-h-0"
            variant={isLive ? ("live" as const) : ("default" as const)}
            activeSentenceId={activeSentenceId}
            showSearchBar={false}
            scrollContainerClassName="pb-[140px]"
          />
        </Suspense>
      )}
    </TranscriptListSlot>
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white p-6">
        {transcriptContent}
      </section>

      <AskScribeSidebar
        meetingId={meeting.id}
        content={DEMO_LIVE_MEETING_ASSISTANT}
      />
    </div>
  );
}
