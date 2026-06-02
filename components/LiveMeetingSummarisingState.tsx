import MeetingHeader from "@/components/meeting/MeetingHeader";
import { AnimatedEllipsis } from "@/components/ui/animated-ellipsis";
import { Skeleton } from "@/components/ui/skeleton";
import type { Meeting } from "@/lib/meetings-types";

type LiveMeetingSummarisingStateProps = {
  meeting: Pick<
    Meeting,
    "title" | "ownerName" | "createdAt" | "meetingLanguage"
  >;
};

export default function LiveMeetingSummarisingState({
  meeting,
}: LiveMeetingSummarisingStateProps) {
  return (
    <div
      className="flex min-h-0 flex-1 flex-col overflow-y-auto"
      aria-live="polite"
      aria-busy="true"
    >
      <MeetingHeader
        title={meeting.title}
        ownerName={meeting.ownerName}
        createdAt={meeting.createdAt}
        meetingLanguage={meeting.meetingLanguage}
      />

      <div className="mt-8 space-y-6">
        <div className="flex items-center gap-2 text-slate-700">
          <AnimatedEllipsis size="md" tone="brand" />
          <p className="text-sm font-medium">Summarising meeting...</p>
        </div>
        <div className="flex max-w-md flex-col gap-2">
          <Skeleton className="h-[15px] w-full" />
          <Skeleton className="h-[15px] w-4/5" />
          <Skeleton className="h-[15px] w-3/5" />
        </div>
      </div>
    </div>
  );
}
