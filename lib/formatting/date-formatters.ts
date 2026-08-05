import type { Meeting } from "@/lib/meetings/types";

const METADATA_LOCALE = "en-US";

export function formatMeetingMetadataDate(iso: string): string {
  return new Date(iso).toLocaleString(METADATA_LOCALE);
}

export function formatMeetingCardDate(iso: string): string {
  const date = new Date(iso);
  const month = date.toLocaleString(METADATA_LOCALE, { month: "long" });
  const day = String(date.getDate()).padStart(2, "0");
  const hours24 = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;

  return `${month} ${day} , ${hours12}:${minutes}${period}`;
}

export function formatMeetingRecentSecondaryLine(
  meeting: Pick<Meeting, "createdAt" | "ownerName">,
): string {
  return `${meeting.ownerName} · ${formatMeetingCardDate(meeting.createdAt)}`;
}

export function formatMeetingListSecondaryLine(meeting: Pick<Meeting, "createdAt" | "durationLabel">): string {
  return `${formatMeetingMetadataDate(meeting.createdAt)} · ${meeting.durationLabel}`;
}

export function formatMeetingListMetadata(
  meeting: Pick<Meeting, "createdAt" | "durationLabel" | "ownerName">,
): string {
  const date = new Date(meeting.createdAt);
  const datePart = date.toLocaleDateString(METADATA_LOCALE, {
    month: "short",
    day: "numeric",
  });
  const timePart = date.toLocaleTimeString(METADATA_LOCALE, {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${datePart} · ${timePart} · ${meeting.durationLabel} · ${meeting.ownerName}`;
}

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

export function formatMeetingTitleDateTimeLabel(createdAt: Date): string {
  return formatMeetingTitleDateTime(createdAt);
}

export { formatElapsedTime } from "@/lib/formatting/elapsed-time";
export { formatSecondsToTimestamp } from "@/lib/formatting/transcript-time";
