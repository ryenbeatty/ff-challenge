import { DEFAULT_USER_EMAIL } from "@/lib/meetings/build-title";
import { JORDAN_EMAIL, MAYA_EMAIL } from "@/lib/meetings/canonical-content";

export type AppUser = {
  email: string;
  name: string;
  /** Filename under `public/avatars/` (e.g. `max.jpg`) */
  avatarFile: string;
};

/** Demo accounts for this challenge — avatar images live in `public/avatars/`. */
export const APP_USERS: AppUser[] = [
  {
    email: DEFAULT_USER_EMAIL,
    name: "Max",
    avatarFile: "max.jpg",
  },
  {
    email: MAYA_EMAIL,
    name: "Maya Chen",
    avatarFile: "maya.jpg",
  },
  {
    email: JORDAN_EMAIL,
    name: "Jordan Park",
    avatarFile: "jordan.jpg",
  },
];

/** Logged-in user for shell chrome (capture titles, header menu). */
export const CURRENT_USER_EMAIL = DEFAULT_USER_EMAIL;

const USERS_BY_EMAIL = new Map(APP_USERS.map((user) => [user.email.toLowerCase(), user]));
const USERS_BY_NAME = new Map(APP_USERS.map((user) => [user.name.toLowerCase(), user]));

export function getCurrentUser(): AppUser {
  return getUserByEmail(CURRENT_USER_EMAIL) ?? APP_USERS[0];
}

export function getFirstName(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return "there";
  }

  return trimmed.split(/\s+/)[0] ?? trimmed;
}

export function getUserByEmail(email: string): AppUser | undefined {
  return USERS_BY_EMAIL.get(email.trim().toLowerCase());
}

export function getUserByName(name: string): AppUser | undefined {
  return USERS_BY_NAME.get(name.trim().toLowerCase());
}

/** Public URL for a user's avatar image, or null if the email is unknown. */
export function getUserAvatarSrc(email: string): string | null {
  const user = getUserByEmail(email);
  if (!user) {
    return null;
  }

  return `/avatars/${user.avatarFile}`;
}

export function getUserAvatarSrcByName(name: string): string | null {
  const user = getUserByName(name);
  if (!user) {
    return null;
  }

  return `/avatars/${user.avatarFile}`;
}

export function getUserAvatarSrcForSpeaker(
  speakers: { id: string; email: string }[],
  speakerId: string,
): string | null {
  const speaker = speakers.find((entry) => entry.id === speakerId);
  if (!speaker) {
    return null;
  }

  return getUserAvatarSrc(speaker.email);
}
