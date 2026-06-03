import {
  getCurrentUserEmail,
  getDemoUsers,
  type AppUser,
} from "@/lib/demo-bindings";

export type { AppUser };

function getUsersByEmail() {
  return new Map(getDemoUsers().map((user) => [user.email.toLowerCase(), user]));
}

function getUsersByName() {
  return new Map(getDemoUsers().map((user) => [user.name.toLowerCase(), user]));
}

export function getCurrentUser() {
  const users = getDemoUsers();
  return getUserByEmail(getCurrentUserEmail()) ?? users[0];
}

export function getFirstName(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return "there";
  }

  return trimmed.split(/\s+/)[0] ?? trimmed;
}

export function getUserByEmail(email: string) {
  return getUsersByEmail().get(email.trim().toLowerCase());
}

export function getUserByName(name: string) {
  return getUsersByName().get(name.trim().toLowerCase());
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
