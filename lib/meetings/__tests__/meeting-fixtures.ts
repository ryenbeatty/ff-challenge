import type { Meeting } from "@/lib/meetings/types";

export function createMeeting(overrides: Partial<Meeting> = {}): Meeting {
  return {
    id: "meeting-1",
    title: "Test meeting",
    ownerName: "Owner",
    meetingLanguage: "English (Global)",
    status: "completed",
    createdAt: "2026-06-02T14:00:00.000Z",
    stoppedAt: null,
    durationLabel: "45 min",
    speakers: [],
    summary: {
      keywords: [],
      overview: "",
      bulletGist: [],
      outline: [],
      notes: [],
      actionItems: [],
    },
    transcript: [],
    ...overrides,
  };
}
