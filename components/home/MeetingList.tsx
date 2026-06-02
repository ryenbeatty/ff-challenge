"use client";

import EmptyMeetingsState from "@/components/states/EmptyMeetingsState";
import LoadingText from "@/components/states/LoadingText";
import MeetingListRow from "@/components/meeting/MeetingListRow";
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
    <ListSection title="Recent meetings">
      {recentMeetings.map((meeting) => (
        <MeetingListRow key={meeting.id} meeting={meeting} />
      ))}
    </ListSection>
  );
}
