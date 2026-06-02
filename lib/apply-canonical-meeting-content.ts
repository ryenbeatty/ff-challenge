import { buildCanonicalMeetingContent, CANONICAL_OWNER_NAME } from "./canonical-meeting-content";
import { normalizeActionItems } from "./resolve-action-item-assignee";
import type { Meeting } from "./meetings-types";

export function applyCanonicalMeetingContent(meeting: Meeting): Meeting {
  const canonical = buildCanonicalMeetingContent(meeting.id);

  return {
    ...meeting,
    ownerName: CANONICAL_OWNER_NAME,
    speakers: canonical.speakers,
    summary: {
      ...canonical.summary,
      actionItems: normalizeActionItems(canonical.summary.actionItems),
    },
    transcript: canonical.transcript,
  };
}
