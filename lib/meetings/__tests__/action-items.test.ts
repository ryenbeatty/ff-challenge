import { describe, expect, it } from "vitest";

import {
  formatActionItemsForCopy,
  groupActionItemsByAssignee,
} from "@/lib/meetings/action-items";
import type { ActionItem } from "@/lib/meetings/types";

const sampleItems: ActionItem[] = [
  {
    id: "1",
    text: "Send recap",
    assigneeEmail: "alice@example.com",
    timestamp: "01:00",
  },
  {
    id: "2",
    text: "Book follow-up",
    assigneeEmail: "bob@example.com",
  },
];

describe("action-items", () => {
  it("groups action items by assignee email", () => {
    expect(groupActionItemsByAssignee(sampleItems)).toEqual([
      ["alice@example.com", [sampleItems[0]]],
      ["bob@example.com", [sampleItems[1]]],
    ]);
  });

  it("formats action items for clipboard copy", () => {
    expect(formatActionItemsForCopy(sampleItems)).toBe(
      "alice@example.com\n- Send recap (01:00)\n\nbob@example.com\n- Book follow-up",
    );
  });
});
