import { describe, expect, it } from "vitest";

import { createMeeting } from "@/lib/meetings/__tests__/meeting-fixtures";
import { sortMeetingsByNewest } from "@/lib/meetings/sort";

describe("sortMeetingsByNewest", () => {
  it("sorts meetings by createdAt descending", () => {
    const older = createMeeting({
      id: "older",
      createdAt: "2026-06-01T10:00:00.000Z",
    });
    const newer = createMeeting({
      id: "newer",
      createdAt: "2026-06-02T10:00:00.000Z",
    });

    expect(sortMeetingsByNewest([older, newer])).toEqual([newer, older]);
  });

  it("does not mutate the input array", () => {
    const meetings = [createMeeting({ id: "a" }), createMeeting({ id: "b" })];

    sortMeetingsByNewest(meetings);

    expect(meetings[0]?.id).toBe("a");
  });
});
