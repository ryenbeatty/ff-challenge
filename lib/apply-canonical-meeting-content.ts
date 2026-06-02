import { buildCanonicalMeetingContent, CANONICAL_OWNER_NAME } from "./canonical-meeting-content";
import type { Meeting } from "./meetings-types";

export function applyCanonicalMeetingContent(meeting: Meeting): Meeting {
  const canonical = buildCanonicalMeetingContent(meeting.id);

  return {
    ...meeting,
    ownerName: CANONICAL_OWNER_NAME,
    speakers: canonical.speakers,
    summary: canonical.summary,
    transcript: canonical.transcript,
  };
}
