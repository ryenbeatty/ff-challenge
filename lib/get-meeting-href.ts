import type { MeetingStatus } from "@/lib/meetings-types";

type MeetingLinkTarget = {
  id: string;
  status: MeetingStatus;
};

export function getMeetingHref(meeting: MeetingLinkTarget): string {
  return meeting.status === "live" ? `/live/${meeting.id}` : `/view/${meeting.id}`;
}
