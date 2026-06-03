import { getMeetingHrefForStatus } from "@/lib/meetings/routes";
import type { MeetingStatus } from "@/lib/meetings/types";

type MeetingLinkTarget = {
  id: string;
  status: MeetingStatus;
};

export function getMeetingHref(meeting: MeetingLinkTarget): string {
  return getMeetingHrefForStatus(meeting.id, meeting.status);
}

export function buildMeetingUrl(origin: string, meeting: MeetingLinkTarget): string {
  return `${origin}${getMeetingHref(meeting)}`;
}
