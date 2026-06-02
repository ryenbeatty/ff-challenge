import { describe, expect, it } from "vitest";

import { createMeeting } from "@/lib/meetings/__tests__/meeting-fixtures";
import {
  selectCompletedMeetings,
  selectLiveMeetings,
  selectRecentCompleted,
} from "@/lib/meetings/selectors";

describe("meeting-selectors", () => {
  const live = createMeeting({
    id: "live",
    status: "live",
    createdAt: "2026-06-02T12:00:00.000Z",
  });
  const completedOld = createMeeting({
    id: "completed-old",
    status: "completed",
    createdAt: "2026-06-01T12:00:00.000Z",
  });
  const completedNew = createMeeting({
    id: "completed-new",
    status: "completed",
    createdAt: "2026-06-03T12:00:00.000Z",
  });

  it("selectLiveMeetings returns only live meetings sorted newest first", () => {
    expect(selectLiveMeetings([completedNew, live, completedOld])).toEqual([live]);
  });

  it("selectCompletedMeetings returns only completed meetings sorted newest first", () => {
    expect(selectCompletedMeetings([completedOld, live, completedNew])).toEqual([
      completedNew,
      completedOld,
    ]);
  });

  it("selectRecentCompleted limits completed meetings", () => {
    expect(selectRecentCompleted([completedOld, live, completedNew], 1)).toEqual([
      completedNew,
    ]);
  });
});
