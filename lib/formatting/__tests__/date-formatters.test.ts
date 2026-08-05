import { describe, expect, it } from "vitest";

import {
  formatMeetingCardDate,
  formatMeetingListSecondaryLine,
  formatMeetingMetadataDate,
  formatMeetingRecentSecondaryLine,
} from "@/lib/formatting/date-formatters";
import { createMeeting } from "@/lib/meetings/__tests__/meeting-fixtures";

describe("date-formatters", () => {
  const iso = "2026-06-02T14:30:00.000Z";

  it("formatMeetingMetadataDate uses en-US locale string", () => {
    const expected = new Date(iso).toLocaleString("en-US");
    expect(formatMeetingMetadataDate(iso)).toBe(expected);
  });

  it("formatMeetingCardDate matches legacy card format", () => {
    expect(formatMeetingCardDate(iso)).toMatch(/June 02 , \d{1,2}:\d{2}(AM|PM)/);
  });

  it("formatMeetingRecentSecondaryLine joins owner and card date", () => {
    const meeting = createMeeting({ createdAt: iso, ownerName: "Alex Chen" });
    expect(formatMeetingRecentSecondaryLine(meeting)).toBe(
      `Alex Chen · ${formatMeetingCardDate(iso)}`,
    );
  });

  it("formatMeetingListSecondaryLine joins date and duration", () => {
    const meeting = createMeeting({ createdAt: iso, durationLabel: "Live" });
    expect(formatMeetingListSecondaryLine(meeting)).toBe(
      `${formatMeetingMetadataDate(iso)} · Live`,
    );
  });
});
