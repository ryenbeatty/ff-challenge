import type { Meeting } from "@/lib/meetings-types";

export function sortMeetingsByNewest(meetings: Meeting[]): Meeting[] {
  return [...meetings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
