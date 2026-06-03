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
} from "@/demo/meetings";
import { getCurrentUser } from "@/lib/shared/user-avatars";

import { applyCanonicalMeetingContent } from "./apply-canonical-content";
import { buildMeetingTitle } from "./build-title";
import { CreateMeetingInput, Meeting } from "./types";

const STORAGE_KEY = "fireflies-meetings-v2";
const LEGACY_STORAGE_KEY = "offline-meetings";

const COMPLETED_DURATION_LABEL = "5 min";

function hasWindow() {
  return typeof window !== "undefined";
}

function readRawMeetings(): string | null {
  if (!hasWindow()) {
    return null;
  }

  const current = window.localStorage.getItem(STORAGE_KEY);
  if (current) {
    return current;
  }

  return window.localStorage.getItem(LEGACY_STORAGE_KEY);
}

function normalizeStoredMeeting(raw: Partial<Meeting> & Record<string, unknown>): Meeting {
  const id = String(raw.id ?? `meeting-${Date.now()}`);
  const status = raw.status === "live" ? "live" : "completed";
  const durationLabel =
    status === "live"
      ? "Live"
      : raw.durationLabel && raw.durationLabel !== "Live"
        ? String(raw.durationLabel)
        : COMPLETED_DURATION_LABEL;

  const shell: Meeting = {
    id,
    title: String(raw.title ?? "Untitled meeting"),
    ownerName: String(raw.ownerName ?? CANONICAL_OWNER_NAME),
    meetingLanguage: String(raw.meetingLanguage ?? "English (Global)"),
    status,
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
    stoppedAt: raw.stoppedAt ? String(raw.stoppedAt) : null,
    durationLabel,
    speakers: Array.isArray(raw.speakers) ? (raw.speakers as Meeting["speakers"]) : [],
    summary:
      raw.summary && typeof raw.summary === "object"
        ? (raw.summary as Meeting["summary"])
        : buildCanonicalMeetingContent(id).summary,
    transcript: Array.isArray(raw.transcript)
      ? (raw.transcript as Meeting["transcript"])
      : [],
  };

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

function parseMeetings(raw: string | null): Meeting[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Meeting[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((raw) => normalizeStoredMeeting(raw));
  } catch {
    return [];
  }
}

function writeMeetings(meetings: Meeting[]) {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
  window.localStorage.removeItem(LEGACY_STORAGE_KEY);
}

function ensureDefaultMeetings(meetings: Meeting[]): Meeting[] {
  if (meetings.length > 0) {
    return meetings;
  }

  const seeded = buildDefaultMeetings();
  writeMeetings(seeded);
  return seeded;
}

export function getAllMeetings(): Meeting[] {
  if (!hasWindow()) {
    return [];
  }

  const meetings = ensureDefaultMeetings(parseMeetings(readRawMeetings()));
  return meetings.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function getMeetingById(meetingId: string): Meeting | undefined {
  return getAllMeetings().find((meeting) => meeting.id === meetingId);
}

export function createMeeting(input: CreateMeetingInput = {}): Meeting {
  const id = `meeting-${Date.now()}`;
  const createdAt = new Date().toISOString();
  const createdDate = new Date(createdAt);
  const canonical = buildCanonicalMeetingContent(id);

  const meeting: Meeting = applyCanonicalMeetingContent({
    id,
    title: buildMeetingTitle({
      userEmail: input.userEmail,
      createdAt: createdDate,
      customTitle: input.customTitle,
    }),
    ownerName: getCurrentUser().name,
    meetingLanguage: input.meetingLanguage ?? "English (Global)",
    status: "live",
    createdAt,
    stoppedAt: null,
    durationLabel: "Live",
    speakers: canonical.speakers,
    summary: canonical.summary,
    transcript: canonical.transcript,
  });

  const meetings = getAllMeetings();
  meetings.unshift(meeting);
  writeMeetings(meetings);
  return meeting;
}

export function stopMeeting(meetingId: string): Meeting | undefined {
  const meetings = getAllMeetings();
  const target = meetings.find((meeting) => meeting.id === meetingId);

  if (!target || target.status === "completed") {
    return target;
  }

  target.status = "completed";
  target.stoppedAt = new Date().toISOString();
  target.durationLabel = COMPLETED_DURATION_LABEL;

  const updated = applyCanonicalMeetingContent(target);
  const index = meetings.findIndex((meeting) => meeting.id === meetingId);
  if (index !== -1) {
    meetings[index] = updated;
  }

  writeMeetings(meetings);
  return updated;
}

export function deleteMeetings(meetingIds: string[]): void {
  if (!meetingIds.length) {
    return;
  }

  const ids = new Set(meetingIds);
  const meetings = getAllMeetings().filter((meeting) => !ids.has(meeting.id));
  writeMeetings(meetings);
}

export function addStressTestMeetings(count = 10): Meeting[] {
  const newMeetings = buildStressTestMeetings(count);
  const meetings = getAllMeetings();
  writeMeetings([...newMeetings, ...meetings]);
  return newMeetings;
}

export function renameMeeting(meetingId: string, title: string): Meeting | undefined {
  const meetings = getAllMeetings();
  const target = meetings.find((meeting) => meeting.id === meetingId);

  if (!target) {
    return undefined;
  }

  const trimmed = title.trim();
  target.title = trimmed || "Untitled";

  const index = meetings.findIndex((meeting) => meeting.id === meetingId);
  if (index !== -1) {
    meetings[index] = target;
  }

  writeMeetings(meetings);
  return target;
}
