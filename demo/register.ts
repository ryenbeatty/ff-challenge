import { registerDemo } from "@/lib/demo-bindings";
import { normalizeActionItems } from "@/lib/meetings/resolve-action-item-assignee";
import type { Meeting } from "@/lib/meetings/types";

import {
  applyDemoMeetingContent,
  buildCanonicalMeetingContent,
  buildDefaultMeetings,
  buildStressTestMeetings,
  CANONICAL_OWNER_NAME,
  getDemoMeetingPartner,
  getStressMeetingPartnerFromId,
  isDemoMeetingId,
  isStressMeetingId,
} from "./meetings";
import { APP_USERS, CURRENT_USER_EMAIL } from "./users";

function applyCanonicalMeetingContent(meeting: Meeting): Meeting {
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

function normalizeDemoStoredMeeting(shell: Meeting): Meeting {
  const { id } = shell;

  const demoPartner = isDemoMeetingId(id) ? getDemoMeetingPartner(id) : undefined;
  if (demoPartner) {
    return applyDemoMeetingContent(shell, demoPartner);
  }

  const stressPartner = getStressMeetingPartnerFromId(id);
  if (stressPartner) {
    return applyDemoMeetingContent(shell, stressPartner);
  }

  if (isStressMeetingId(id)) {
    return shell;
  }

  return applyCanonicalMeetingContent(shell);
}

export function registerDemoBindings() {
  registerDemo({
    users: APP_USERS,
    currentUserEmail: CURRENT_USER_EMAIL,
    defaultStoredOwnerName: CANONICAL_OWNER_NAME,
    seedMeetings: buildDefaultMeetings,
    normalizeStoredMeeting: normalizeDemoStoredMeeting,
    buildCanonicalContent: buildCanonicalMeetingContent,
    applyCanonicalMeetingContent,
    addStressTestMeetings: buildStressTestMeetings,
  });
}
