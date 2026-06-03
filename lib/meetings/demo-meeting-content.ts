import {
  buildCanonicalMeetingContent,
  JORDAN_EMAIL,
  MAYA_EMAIL,
} from "./canonical-content";
import { DEFAULT_USER_EMAIL } from "./build-title";
import { normalizeActionItems } from "./resolve-action-item-assignee";
import type { Meeting, MeetingSummary, Speaker, TranscriptSentence } from "./types";

export const DEMO_OWNER_NAME = "Max";

const CANONICAL_MAYA_SPEAKER_ID = "speaker-1";
const CANONICAL_JORDAN_SPEAKER_ID = "speaker-2";

export type DemoMeetingPartner = "maya" | "jordan";

const DEMO_PARTNER_BY_ID: Record<string, DemoMeetingPartner> = {
  "demo-meeting-1": "maya",
  "demo-meeting-2": "jordan",
  "demo-meeting-3": "maya",
};

export function isDemoMeetingId(meetingId: string): boolean {
  return meetingId in DEMO_PARTNER_BY_ID;
}

export function getDemoMeetingPartner(meetingId: string): DemoMeetingPartner | undefined {
  return DEMO_PARTNER_BY_ID[meetingId];
}

function buildDemoSpeakers(meetingId: string, partner: DemoMeetingPartner): Speaker[] {
  const maxSpeaker: Speaker = {
    id: `${meetingId}-speaker-max`,
    name: DEMO_OWNER_NAME,
    email: DEFAULT_USER_EMAIL,
  };

  const partnerSpeaker: Speaker =
    partner === "maya"
      ? { id: `${meetingId}-speaker-maya`, name: "Maya Chen", email: MAYA_EMAIL }
      : { id: `${meetingId}-speaker-jordan`, name: "Jordan Park", email: JORDAN_EMAIL };

  return [maxSpeaker, partnerSpeaker];
}

function remapDemoTranscript(
  meetingId: string,
  partner: DemoMeetingPartner,
  speakers: Speaker[],
): TranscriptSentence[] {
  const [maxSpeaker, partnerSpeaker] = speakers;
  const canonical = buildCanonicalMeetingContent(meetingId);

  const speakerIdByCanonical: Record<string, string> = {
    [CANONICAL_MAYA_SPEAKER_ID]: maxSpeaker.id,
    [CANONICAL_JORDAN_SPEAKER_ID]: partnerSpeaker.id,
  };

  const speakerNameByCanonical: Record<string, string> = {
    [CANONICAL_MAYA_SPEAKER_ID]: maxSpeaker.name,
    [CANONICAL_JORDAN_SPEAKER_ID]: partnerSpeaker.name,
  };

  return canonical.transcript.map((line) => ({
    ...line,
    speakerId: speakerIdByCanonical[line.speakerId] ?? line.speakerId,
    speakerName: speakerNameByCanonical[line.speakerId] ?? line.speakerName,
  }));
}

function remapDemoSummary(
  meetingId: string,
  partner: DemoMeetingPartner,
  speakers: Speaker[],
): MeetingSummary {
  const [, partnerSpeaker] = speakers;
  const canonical = buildCanonicalMeetingContent(meetingId);

  const assigneeEmailByCanonical: Record<string, string> = {
    [MAYA_EMAIL]: DEFAULT_USER_EMAIL,
    [JORDAN_EMAIL]: partnerSpeaker.email,
  };

  return {
    ...canonical.summary,
    actionItems: canonical.summary.actionItems.map((item) => ({
      ...item,
      assigneeEmail: assigneeEmailByCanonical[item.assigneeEmail] ?? item.assigneeEmail,
    })),
  };
}

export function applyDemoMeetingContent(meeting: Meeting, partner: DemoMeetingPartner): Meeting {
  const speakers = buildDemoSpeakers(meeting.id, partner);
  const summary = remapDemoSummary(meeting.id, partner, speakers);

  return {
    ...meeting,
    ownerName: DEMO_OWNER_NAME,
    speakers,
    summary: {
      ...summary,
      actionItems: normalizeActionItems(summary.actionItems),
    },
    transcript: remapDemoTranscript(meeting.id, partner, speakers),
  };
}
