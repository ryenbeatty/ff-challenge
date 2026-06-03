import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createMeeting } from "@/lib/meetings/__tests__/meeting-fixtures";
import {
  addStressTestMeetings,
  deleteMeetings,
  getAllMeetings,
  renameMeeting,
} from "@/lib/meetings/storage";

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

describe("deleteMeetings", () => {
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    localStorageMock = createLocalStorageMock();
    vi.stubGlobal("window", { localStorage: localStorageMock });
    localStorageMock.setItem(
      STORAGE_KEY,
      JSON.stringify([
        createMeeting({ id: "a", title: "A" }),
        createMeeting({ id: "b", title: "B" }),
        createMeeting({ id: "c", title: "C" }),
      ]),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("removes the given meeting ids", () => {
    deleteMeetings(["a", "c"]);

    const meetings = getAllMeetings();
    expect(meetings).toHaveLength(1);
    expect(meetings[0]?.id).toBe("b");
  });
});

describe("renameMeeting", () => {
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    localStorageMock = createLocalStorageMock();
    vi.stubGlobal("window", { localStorage: localStorageMock });
    localStorageMock.setItem(
      STORAGE_KEY,
      JSON.stringify([createMeeting({ id: "a", title: "Old title" })]),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("updates the meeting title", () => {
    const updated = renameMeeting("a", "New title");

    expect(updated?.title).toBe("New title");
    expect(getAllMeetings()[0]?.title).toBe("New title");
  });

  it("falls back to Untitled when title is blank", () => {
    const updated = renameMeeting("a", "   ");

    expect(updated?.title).toBe("Untitled");
  });
});

describe("addStressTestMeetings", () => {
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    localStorageMock = createLocalStorageMock();
    vi.stubGlobal("window", { localStorage: localStorageMock });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("prepends stress meetings built from seed templates", () => {
    const added = addStressTestMeetings(10);

    expect(added).toHaveLength(10);
    expect(added.every((meeting) => meeting.id.startsWith("stress-"))).toBe(true);
    expect(added.every((meeting) => meeting.status === "completed")).toBe(true);

    const meetings = getAllMeetings();
    const meetingIds = new Set(meetings.map((meeting) => meeting.id));

    expect(meetings.length).toBeGreaterThanOrEqual(10);
    expect(added.every((meeting) => meetingIds.has(meeting.id))).toBe(true);
    expect(added.every((meeting) => meeting.ownerName === "Max")).toBe(true);
    expect(added.every((meeting) => !meeting.title.includes("stress"))).toBe(true);

    const monthAgo = Date.now() - 31 * 24 * 60 * 60 * 1000;
    expect(
      added.every((meeting) => new Date(meeting.createdAt).getTime() >= monthAgo),
    ).toBe(true);
  });
});
