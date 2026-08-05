// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import { getAutoScrollBehavior } from "@/lib/shared/scroll-behavior";

describe("getAutoScrollBehavior", () => {
  it("returns instant for high-frequency auto-scroll", () => {
    expect(getAutoScrollBehavior()).toBe("instant");
  });
});
