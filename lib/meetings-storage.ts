import {
  DASHBOARD_ACTION_ITEMS,
  DASHBOARD_SUMMARY,
  createDummyTranscript,
} from "./meetings-data";
import { Meeting } from "./meetings-types";

const STORAGE_KEY = "offline-meetings";

function hasWindow() {
  return typeof window !== "undefined";
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

    return parsed.map((meeting) => {
      if (
        !Array.isArray(meeting.actionItemsByParticipant) ||
        !meeting.actionItemsByParticipant.length
      ) {
        return {
          ...meeting,
          actionItemsByParticipant: DASHBOARD_ACTION_ITEMS,
        };
      }

      return meeting;
    });
  } catch {
    return [];
  }
}

function writeMeetings(meetings: Meeting[]) {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
}

export function getAllMeetings(): Meeting[] {
  if (!hasWindow()) {
    return [];
  }

  const meetings = parseMeetings(window.localStorage.getItem(STORAGE_KEY));
  return meetings.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function getMeetingById(meetingId: string): Meeting | undefined {
  return getAllMeetings().find((meeting) => meeting.id === meetingId);
}

function createMeetingTitle(createdAtIso: string): string {
  const date = new Date(createdAtIso);
  return `Dashboard planning ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

export function createMeeting(): Meeting {
  const id = `meeting-${Date.now()}`;
  const createdAt = new Date().toISOString();
  const meeting: Meeting = {
    id,
    title: createMeetingTitle(createdAt),
    status: "live",
    createdAt,
    stoppedAt: null,
    durationLabel: "Live",
    summary: DASHBOARD_SUMMARY,
    transcript: createDummyTranscript(id),
    actionItemsByParticipant: DASHBOARD_ACTION_ITEMS,
  };

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

  const stoppedAt = new Date().toISOString();
  const startedTime = new Date(target.createdAt).getTime();
  const stoppedTime = new Date(stoppedAt).getTime();
  const durationMinutes = Math.max(
    1,
    Math.round((stoppedTime - startedTime) / (1000 * 60)),
  );

  target.status = "completed";
  target.stoppedAt = stoppedAt;
  target.durationLabel = `${durationMinutes} min`;

  writeMeetings(meetings);
  return target;
}
