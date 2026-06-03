import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createMeeting } from "@/lib/meetings/__tests__/meeting-fixtures";
import { getAllMeetings } from "@/lib/meetings/storage";

const STORAGE_KEY = "fireflies-meetings-v2";

function createLocalStorageMock() {
  const store = new Map<string, string>();

  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
}

describe("meeting storage seeding", () => {
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    localStorageMock = createLocalStorageMock();
    vi.stubGlobal("window", { localStorage: localStorageMock });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("seeds three completed demo meetings when localStorage is empty", () => {
    const meetings = getAllMeetings();

    expect(meetings).toHaveLength(3);
    expect(meetings.map((meeting) => meeting.id)).toEqual([
      "demo-meeting-3",
      "demo-meeting-2",
      "demo-meeting-1",
    ]);
    expect(meetings.every((meeting) => meeting.status === "completed")).toBe(true);
    expect(meetings.every((meeting) => meeting.ownerName === "Max")).toBe(true);
    expect(meetings[0]?.speakers.map((speaker) => speaker.name)).toEqual(["Max", "Maya Chen"]);
    expect(meetings[1]?.speakers.map((speaker) => speaker.name)).toEqual(["Max", "Jordan Park"]);
    expect(meetings[0]?.title).toBe("Customer discovery call");
    expect(meetings[1]?.title).toBe("Weekly product sync");
    expect(meetings[2]?.title).toBe("Analytics dashboard review");
    expect(localStorageMock.getItem(STORAGE_KEY)).toBeTruthy();
  });

  it("does not seed when localStorage already has meetings", () => {
    const existing = createMeeting({ id: "user-meeting-1", title: "User capture" });
    localStorageMock.setItem(STORAGE_KEY, JSON.stringify([existing]));

    const meetings = getAllMeetings();

    expect(meetings).toHaveLength(1);
    expect(meetings[0]?.id).toBe("user-meeting-1");
    expect(meetings.some((meeting) => meeting.id.startsWith("demo-meeting-"))).toBe(false);
  });
});
