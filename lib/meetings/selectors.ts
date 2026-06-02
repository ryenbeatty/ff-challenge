import { sortMeetingsByNewest } from "@/lib/meetings/sort";
import type { Meeting } from "@/lib/meetings/types";

export function selectLiveMeetings(meetings: Meeting[]): Meeting[] {
  return sortMeetingsByNewest(meetings.filter((meeting) => meeting.status === "live"));
}

export function selectCompletedMeetings(meetings: Meeting[]): Meeting[] {
  return sortMeetingsByNewest(meetings.filter((meeting) => meeting.status !== "live"));
}

export function selectRecentCompleted(meetings: Meeting[], limit?: number): Meeting[] {
  const completed = selectCompletedMeetings(meetings);

  if (limit === undefined) {
    return completed;
  }

  return completed.slice(0, limit);
}
