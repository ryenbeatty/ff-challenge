import { formatMeetingTitleDateTimeLabel } from "@/lib/formatting/date-formatters";

export const DEFAULT_USER_EMAIL = "max@fireflies.fun";

export function buildMeetingTitle({
  userEmail = DEFAULT_USER_EMAIL,
  createdAt = new Date(),
  customTitle,
}: {
  userEmail?: string;
  createdAt?: Date;
  customTitle?: string;
}): string {
  const titleSuffix = customTitle?.trim() || "Untitled";
  const dateTimeLabel = formatMeetingTitleDateTimeLabel(createdAt);

  return `${userEmail} - ${dateTimeLabel} - ${titleSuffix}`;
}
