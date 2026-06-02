"use client";

import LiveMeetingRow from "@/components/meeting/LiveMeetingRow";
import ListSection from "@/components/ui/list-section";
import type { Meeting } from "@/lib/meetings/types";

type LiveMeetingsSectionProps = {
  meetings: Meeting[];
};

export default function LiveMeetingsSection({ meetings }: LiveMeetingsSectionProps) {
  if (!meetings.length) {
    return null;
  }

  return (
    <ListSection title="Live meetings">
      {meetings.map((meeting) => (
        <LiveMeetingRow key={meeting.id} meeting={meeting} />
      ))}
    </ListSection>
  );
}
