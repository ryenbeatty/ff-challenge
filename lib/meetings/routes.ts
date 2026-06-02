import type { MeetingStatus } from "@/lib/meetings/types";

export function isLiveMeetingPath(pathname: string): boolean {
  return pathname.startsWith("/live/");
}

export function isViewMeetingPath(pathname: string): boolean {
  return pathname.startsWith("/view/");
}

export function isMeetingDetailPath(pathname: string): boolean {
  return isLiveMeetingPath(pathname) || isViewMeetingPath(pathname);
}

export function getLiveMeetingHref(meetingId: string): string {
  return `/live/${meetingId}`;
}

export function getViewMeetingHref(meetingId: string): string {
  return `/view/${meetingId}`;
}

export function getMeetingHrefForStatus(
  meetingId: string,
  status: MeetingStatus,
): string {
  return status === "live" ? getLiveMeetingHref(meetingId) : getViewMeetingHref(meetingId);
}
