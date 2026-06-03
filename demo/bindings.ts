import type { Meeting } from "@/lib/meetings/types";

export type AppUser = {
  email: string;
  name: string;
  /** Filename under `public/avatars/` (e.g. `max.jpg`) */
  avatarFile: string;
};

type MeetingContent = Pick<Meeting, "speakers" | "summary" | "transcript">;

export type DemoBindings = {
  users: AppUser[];
  currentUserEmail: string;
  defaultStoredOwnerName: string;
  seedMeetings: () => Meeting[];
  normalizeStoredMeeting: (shell: Meeting) => Meeting;
  buildCanonicalContent: (meetingId: string) => MeetingContent;
  applyCanonicalMeetingContent: (meeting: Meeting) => Meeting;
  addStressTestMeetings: (count: number) => Meeting[];
};

let bindings: DemoBindings | null = null;

function requireBindings(): DemoBindings {
  if (!bindings) {
    throw new Error("Demo bindings are not registered. Call registerDemoBindings() from app/providers.");
  }

  return bindings;
}

export function registerDemo(next: DemoBindings) {
  bindings = next;
}

export function getDemoUsers(): AppUser[] {
  return requireBindings().users;
}

export function getCurrentUserEmail(): string {
  return requireBindings().currentUserEmail;
}

export function getDefaultStoredOwnerName(): string {
  return requireBindings().defaultStoredOwnerName;
}

export function seedMeetings(): Meeting[] {
  return requireBindings().seedMeetings();
}

export function normalizeStoredMeeting(shell: Meeting): Meeting {
  return requireBindings().normalizeStoredMeeting(shell);
}

export function buildCanonicalContent(meetingId: string): MeetingContent {
  return requireBindings().buildCanonicalContent(meetingId);
}

export function applyCanonicalMeetingContent(meeting: Meeting): Meeting {
  return requireBindings().applyCanonicalMeetingContent(meeting);
}

export function buildStressTestMeetings(count: number): Meeting[] {
  return requireBindings().addStressTestMeetings(count);
}
