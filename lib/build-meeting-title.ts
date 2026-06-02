export const DEFAULT_USER_EMAIL = "frome@fastmail.jp";

function formatMeetingTitleDateTime(date: Date): string {
  const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(date);
  const day = String(date.getDate()).padStart(2, "0");
  const month = new Intl.DateTimeFormat("en-GB", { month: "short" }).format(date);
  const year = date.getFullYear();
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
  const timeZone =
    new Intl.DateTimeFormat("en-GB", { timeZoneName: "short" })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value ?? "UTC";

  return `${weekday}, ${day} ${month} ${year} ${time} ${timeZone}`;
}

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
  const dateTimeLabel = formatMeetingTitleDateTime(createdAt);

  return `${userEmail} - ${dateTimeLabel} - ${titleSuffix}`;
}
