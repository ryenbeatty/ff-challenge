import {
  applyDemoMeetingContent,
  DEMO_OWNER_NAME,
  getDemoMeetingPartner,
} from "./demo-meeting-content";
import { buildMeetingTitle } from "./build-title";
import type { Meeting } from "./types";

const COMPLETED_DURATION_LABEL = "5 min";

/** Fixed anchor for reproducible demo dates in tests and screenshots. */
const SEED_ANCHOR = new Date("2026-06-02T14:00:00.000Z");

const SEED_DEFINITIONS = [
  { id: "demo-meeting-1", customTitle: "Analytics dashboard review", daysBeforeAnchor: 3 },
  { id: "demo-meeting-2", customTitle: "Weekly product sync", daysBeforeAnchor: 2 },
  { id: "demo-meeting-3", customTitle: "Customer discovery call", daysBeforeAnchor: 1 },
] as const;

const EMPTY_SUMMARY: Meeting["summary"] = {
  keywords: [],
  overview: "",
  bulletGist: [],
  outline: [],
  notes: [],
  actionItems: [],
};

function createdAtForSeed(daysBeforeAnchor: number): Date {
  const date = new Date(SEED_ANCHOR);
  date.setUTCDate(date.getUTCDate() - daysBeforeAnchor);
  return date;
}

function buildSeedShell(def: (typeof SEED_DEFINITIONS)[number]): Meeting {
  const createdAt = createdAtForSeed(def.daysBeforeAnchor);
  const stoppedAt = new Date(createdAt.getTime() + 5 * 60 * 1000);

  return {
    id: def.id,
    title: buildMeetingTitle({ customTitle: def.customTitle }),
    ownerName: DEMO_OWNER_NAME,
    meetingLanguage: "English (Global)",
    status: "completed",
    createdAt: createdAt.toISOString(),
    stoppedAt: stoppedAt.toISOString(),
    durationLabel: COMPLETED_DURATION_LABEL,
    speakers: [],
    summary: EMPTY_SUMMARY,
    transcript: [],
  };
}

/** Demo meetings written when localStorage is empty (first visit). */
export function buildDefaultMeetings(): Meeting[] {
  return SEED_DEFINITIONS.map((def) => {
    const shell = buildSeedShell(def);
    const partner = getDemoMeetingPartner(def.id);

    if (!partner) {
      return shell;
    }

    return applyDemoMeetingContent(shell, partner);
  });
}
