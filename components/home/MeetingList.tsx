"use client";

import AskFirefliesSidebar from "@/components/meeting/AskFirefliesSidebar";
import { DEMO_MEETINGS_PAGE_ASSISTANT } from "@/demo/assistant";
import MeetingListRow from "@/components/meeting/MeetingListRow";
import EmptyMeetingsState from "@/components/states/EmptyMeetingsState";
import LoadingText from "@/components/states/LoadingText";
import ListSection from "@/components/ui/list-section";
import { selectCompletedMeetings } from "@/lib/meetings/selectors";
import { useMeetingsQuery } from "@/lib/meetings/query";

export default function MeetingList() {
  const { data: meetings, isLoading } = useMeetingsQuery();

  const recentMeetings = selectCompletedMeetings(meetings ?? []);

  if (isLoading) {
    return <LoadingText>Loading meetings...</LoadingText>;
  }

  if (!meetings?.length) {
    return <EmptyMeetingsState />;
  }

  if (!recentMeetings.length) {
    return <EmptyMeetingsState variant="no-completed" />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <main className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-6">
        <div className="mx-auto w-full max-w-3xl">
          <ListSection title="Recent meetings">
            {recentMeetings.map((meeting) => (
              <MeetingListRow key={meeting.id} meeting={meeting} />
            ))}
          </ListSection>
        </div>
      </main>

      <AskFirefliesSidebar
        meetingId=""
        content={DEMO_MEETINGS_PAGE_ASSISTANT}
        className="hidden lg:flex"
      />
    </div>
  );
}
