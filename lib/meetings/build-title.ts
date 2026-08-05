export const DEFAULT_USER_EMAIL = "max@scribe.app";

export function buildMeetingTitle({
  customTitle,
}: {
  userEmail?: string;
  createdAt?: Date;
  customTitle?: string;
} = {}): string {
  const trimmed = customTitle?.trim();
  return trimmed || "Untitled";
}
