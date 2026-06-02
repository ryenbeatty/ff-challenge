import type {
  ActionItem,
  MeetingSummary,
  OutlineSection,
  Speaker,
  TranscriptSentence,
} from "./types";

export const CANONICAL_OWNER_NAME = "Maya Chen";

export const MAYA_EMAIL = "maya.chen@fireflies.fun";
export const JORDAN_EMAIL = "jordan.park@fireflies.fun";

export const CANONICAL_SPEAKERS: Speaker[] = [
  { id: "speaker-1", name: "Maya Chen", email: MAYA_EMAIL },
  { id: "speaker-2", name: "Jordan Park", email: JORDAN_EMAIL },
];

const MAYA_ID = "speaker-1";
const JORDAN_ID = "speaker-2";

type TranscriptLineInput = {
  speakerId: string;
  text: string;
  startTime: number;
  endTime: number;
};

const TRANSCRIPT_LINES: TranscriptLineInput[] = [
  {
    speakerId: MAYA_ID,
    text: "Thanks for joining. The goal today is to align on the first version of our analytics dashboard for Fireflies users.",
    startTime: 0,
    endTime: 8,
  },
  {
    speakerId: JORDAN_ID,
    text: "Sounds good. Are we optimizing for leadership review or day-to-day product team usage?",
    startTime: 9,
    endTime: 15,
  },
  {
    speakerId: MAYA_ID,
    text: "Both, but leadership needs a one-minute read. Product teams need drill-down without exporting to spreadsheets.",
    startTime: 16,
    endTime: 24,
  },
  {
    speakerId: JORDAN_ID,
    text: "Then the top row should be activation, retention, and expansion revenue. Those are the north-star signals.",
    startTime: 25,
    endTime: 32,
  },
  {
    speakerId: MAYA_ID,
    text: "Agreed. Activation is weekly active teams recording at least one meeting. Retention is cohort week-four return.",
    startTime: 33,
    endTime: 41,
  },
  {
    speakerId: JORDAN_ID,
    text: "For expansion, should we use seat growth or ARR from upsells tied to analytics usage?",
    startTime: 42,
    endTime: 48,
  },
  {
    speakerId: MAYA_ID,
    text: "Let's start with seat growth for MVP. ARR attribution can come once we instrument feature adoption.",
    startTime: 49,
    endTime: 56,
  },
  {
    speakerId: JORDAN_ID,
    text: "Makes sense. Do we show week-over-week deltas by default or hide them behind a toggle?",
    startTime: 57,
    endTime: 63,
  },
  {
    speakerId: MAYA_ID,
    text: "Default on. Green and red deltas with a neutral state for flat metrics. Users should spot regressions instantly.",
    startTime: 64,
    endTime: 72,
  },
  {
    speakerId: JORDAN_ID,
    text: "I'll mock a three-card hero row with sparklines. Below that, a trend chart for the selected metric.",
    startTime: 73,
    endTime: 80,
  },
  {
    speakerId: MAYA_ID,
    text: "Perfect. Second section: segment filters for enterprise, mid-market, and self-serve.",
    startTime: 81,
    endTime: 87,
  },
  {
    speakerId: JORDAN_ID,
    text: "Should filters persist per user or per workspace?",
    startTime: 88,
    endTime: 92,
  },
  {
    speakerId: MAYA_ID,
    text: "Per user for now. Workspace defaults are phase two once admins ask for shared views.",
    startTime: 93,
    endTime: 100,
  },
  {
    speakerId: JORDAN_ID,
    text: "Got it. I'll add a saved views dropdown so PMs can jump between segments quickly.",
    startTime: 101,
    endTime: 107,
  },
  {
    speakerId: MAYA_ID,
    text: "We also need a weekly snapshot workflow. Executives want a PDF or CSV they can forward without logging in.",
    startTime: 108,
    endTime: 116,
  },
  {
    speakerId: JORDAN_ID,
    text: "Export can ship as CSV in MVP. PDF styling adds design time we may not have this sprint.",
    startTime: 117,
    endTime: 124,
  },
  {
    speakerId: MAYA_ID,
    text: "CSV is fine if the email recap links back to the live dashboard for context.",
    startTime: 125,
    endTime: 131,
  },
  {
    speakerId: JORDAN_ID,
    text: "I'll wire the snapshot to Monday 8 a.m. in the user's timezone, same as meeting recaps.",
    startTime: 132,
    endTime: 139,
  },
  {
    speakerId: MAYA_ID,
    text: "On data freshness, what's realistic for warehouse latency?",
    startTime: 140,
    endTime: 145,
  },
  {
    speakerId: JORDAN_ID,
    text: "Most metrics can be T+1. Activation might lag six hours if we stream partial events.",
    startTime: 146,
    endTime: 153,
  },
  {
    speakerId: MAYA_ID,
    text: "Show a last-updated timestamp on every widget so users trust the numbers.",
    startTime: 154,
    endTime: 159,
  },
  {
    speakerId: JORDAN_ID,
    text: "Will do. Privacy-wise, do we hide individual user names in self-serve aggregates?",
    startTime: 160,
    endTime: 166,
  },
  {
    speakerId: MAYA_ID,
    text: "Yes. Only team-level rollups in MVP. No PII in exports unless the viewer is a workspace admin.",
    startTime: 167,
    endTime: 175,
  },
  {
    speakerId: JORDAN_ID,
    text: "That matches our existing recap permissions model. Less policy work for launch.",
    startTime: 176,
    endTime: 182,
  },
  {
    speakerId: MAYA_ID,
    text: "For layout, I'm picturing a left nav: Overview, Segments, Snapshots, and Settings.",
    startTime: 183,
    endTime: 190,
  },
  {
    speakerId: JORDAN_ID,
    text: "I'd keep Settings minimal—timezone, recipients, and default segment only.",
    startTime: 191,
    endTime: 197,
  },
  {
    speakerId: MAYA_ID,
    text: "Agreed. Empty states matter. New workspaces should see sample data with a clear demo banner.",
    startTime: 198,
    endTime: 205,
  },
  {
    speakerId: JORDAN_ID,
    text: "We can reuse the onboarding checklist pattern from the main app. One click to dismiss.",
    startTime: 206,
    endTime: 212,
  },
  {
    speakerId: MAYA_ID,
    text: "What about mobile? Leaders will open this on phones after meetings.",
    startTime: 213,
    endTime: 218,
  },
  {
    speakerId: JORDAN_ID,
    text: "Responsive stack for hero cards. Tables become scrollable lists. Snapshot export stays desktop-first.",
    startTime: 219,
    endTime: 227,
  },
  {
    speakerId: MAYA_ID,
    text: "Phase two ideas: annotations on charts, threshold alerts in Slack, and custom metric builders.",
    startTime: 228,
    endTime: 235,
  },
  {
    speakerId: JORDAN_ID,
    text: "I'll document those in the roadmap doc but keep the MVP scope tight.",
    startTime: 236,
    endTime: 242,
  },
  {
    speakerId: MAYA_ID,
    text: "Success metrics for the dashboard itself—adoption and time-to-insight?",
    startTime: 243,
    endTime: 248,
  },
  {
    speakerId: JORDAN_ID,
    text: "Track weekly active viewers per workspace and median seconds to first filter change.",
    startTime: 249,
    endTime: 256,
  },
  {
    speakerId: MAYA_ID,
    text: "If time-to-insight is under thirty seconds, we're winning.",
    startTime: 257,
    endTime: 261,
  },
  {
    speakerId: JORDAN_ID,
    text: "I'll add instrumentation hooks when we build the hero row.",
    startTime: 262,
    endTime: 266,
  },
  {
    speakerId: MAYA_ID,
    text: "Engineering estimate for MVP—two sprints or three?",
    startTime: 267,
    endTime: 271,
  },
  {
    speakerId: JORDAN_ID,
    text: "Two sprints for read-only widgets and exports. Third sprint if we add saved views sync across devices.",
    startTime: 272,
    endTime: 280,
  },
  {
    speakerId: MAYA_ID,
    text: "Let's commit to two sprints and descope cross-device sync.",
    startTime: 281,
    endTime: 286,
  },
  {
    speakerId: JORDAN_ID,
    text: "I'll share Figma flows by Thursday and a technical RFC on the metrics pipeline Friday.",
    startTime: 287,
    endTime: 294,
  },
  {
    speakerId: MAYA_ID,
    text: "Great. I'll schedule a review with leadership next Monday. Anything blocking you?",
    startTime: 287,
    endTime: 293,
  },
  {
    speakerId: JORDAN_ID,
    text: "Just need final sign-off on which warehouse tables are source of truth. I'll ping data eng today.",
    startTime: 294,
    endTime: 298,
  },
  {
    speakerId: MAYA_ID,
    text: "Perfect. Thanks Jordan—this gives us a clear MVP path for the Fireflies analytics dashboard.",
    startTime: 298,
    endTime: 300,
  },
];

const CANONICAL_SUMMARY: MeetingSummary = {
  keywords: [
    "analytics dashboard",
    "activation",
    "retention",
    "MVP",
    "segment filters",
    "weekly snapshot",
  ],
  // Intentionally blank: this dummy data should render the "general summary"
  // as ONLY bullet points (the `bulletGist` list).
  overview: "",
  gist: "The team scoped a leadership-friendly analytics dashboard MVP with core growth metrics, segment filters, and weekly exports.",
  bulletGist: [
    "North-star metrics: activation, retention, and seat growth displayed in a three-card hero row with default week-over-week deltas.",
    "Segment filters for enterprise, mid-market, and self-serve will persist per user with a saved-views dropdown in MVP.",
    "Weekly snapshot export ships as CSV with email recap links; PDF export deferred to a later phase.",
    "Data shown as T+1 for most metrics with visible last-updated timestamps; no PII in self-serve rollups.",
    "MVP delivery targeted in two sprints: read-only widgets, exports, and responsive mobile layout.",
    "Phase two: chart annotations, Slack threshold alerts, and custom metric builders.",
  ],
  outline: [
    {
      timestamp: "00:00",
      title: "Dashboard goals and audience",
      bullets: [
        "Leadership needs a one-minute overview; product teams need drill-down without spreadsheets.",
      ],
    },
    {
      timestamp: "00:25",
      title: "North-star metrics and deltas",
      bullets: [
        "Hero row: activation, retention, seat growth with green/red week-over-week deltas.",
      ],
    },
    {
      timestamp: "01:21",
      title: "Segmentation and saved views",
      bullets: [
        "Enterprise, mid-market, and self-serve filters; per-user persistence for MVP.",
      ],
    },
    {
      timestamp: "01:48",
      title: "Weekly snapshot and data freshness",
      bullets: [
        "CSV export on Monday mornings; T+1 warehouse latency with last-updated labels.",
      ],
    },
    {
      timestamp: "03:03",
      title: "Privacy, mobile, and phase two",
      bullets: [
        "Team-level rollups only; responsive hero cards; alerts and custom metrics later.",
      ],
    },
    {
      timestamp: "04:27",
      title: "Timeline and next steps",
      bullets: [
        "Two-sprint MVP; Figma flows Thursday, metrics RFC Friday, leadership review Monday.",
      ],
    },
  ] satisfies OutlineSection[],
  notes: [
    "MVP scope: Read-only analytics dashboard with activation, retention, and seat growth as the primary hero metrics.",
    "UX defaults: Week-over-week deltas always visible; color-coded positive, negative, and flat states.",
    "Segment filters: Enterprise, mid-market, and self-serve with per-user saved views; workspace defaults deferred.",
    "Weekly snapshot: CSV export scheduled Monday 8 a.m. user local time, linked from meeting-style email recaps.",
    "Data & privacy: T+1 freshness with last-updated timestamps; no individual PII in self-serve aggregates or exports.",
    "Navigation: Left nav with Overview, Segments, Snapshots, and minimal Settings (timezone, recipients, default segment).",
    "Onboarding: Sample data and dismissible demo banner for new workspaces using the existing checklist pattern.",
    "Phase two: Chart annotations, Slack alerts, custom metric builders, and cross-device saved-view sync.",
  ],
  actionItems: [
    {
      id: "action-1",
      text: "Share Figma flows for hero row, segment filters, and weekly snapshot export.",
      assigneeEmail: JORDAN_EMAIL,
      timestamp: "04:47",
    },
    {
      id: "action-2",
      text: "Publish technical RFC on metrics pipeline and warehouse source-of-truth tables.",
      assigneeEmail: JORDAN_EMAIL,
      timestamp: "04:55",
    },
    {
      id: "action-3",
      text: "Confirm with data engineering which warehouse tables back activation and retention.",
      assigneeEmail: JORDAN_EMAIL,
      timestamp: "05:01",
    },
    {
      id: "action-4",
      text: "Add instrumentation for weekly active dashboard viewers and time-to-first-filter.",
      assigneeEmail: JORDAN_EMAIL,
      timestamp: "04:22",
    },
    {
      id: "action-5",
      text: "Schedule leadership review for the analytics dashboard MVP on Monday.",
      assigneeEmail: MAYA_EMAIL,
      timestamp: "04:55",
    },
    {
      id: "action-6",
      text: "Document phase-two scope (annotations, Slack alerts, custom metrics) in the product roadmap.",
      assigneeEmail: MAYA_EMAIL,
      timestamp: "03:48",
    },
    {
      id: "action-7",
      text: "Finalize MVP success criteria: under thirty seconds to first actionable insight.",
      assigneeEmail: MAYA_EMAIL,
      timestamp: "04:17",
    },
  ] satisfies ActionItem[],
  topicsDiscussed: [
    "North-star metrics",
    "Segment filters",
    "Weekly exports",
    "Data privacy",
    "MVP timeline",
  ],
  meetingType: "Team Meeting",
};

function speakerNameForId(speakerId: string): string {
  return (
    CANONICAL_SPEAKERS.find((speaker) => speaker.id === speakerId)?.name ??
    "Unknown"
  );
}

export function buildCanonicalTranscript(meetingId: string): TranscriptSentence[] {
  return TRANSCRIPT_LINES.map((line, index) => ({
    id: `${meetingId}-s-${index}`,
    index,
    speakerId: line.speakerId,
    speakerName: speakerNameForId(line.speakerId),
    text: line.text,
    startTime: line.startTime,
    endTime: line.endTime,
  }));
}

export function buildCanonicalSummary(meetingId: string): MeetingSummary {
  return {
    ...CANONICAL_SUMMARY,
    actionItems: CANONICAL_SUMMARY.actionItems.map((item, index) => ({
      ...item,
      id: `${meetingId}-${item.id ?? `action-${index}`}`,
    })),
  };
}

export function buildCanonicalMeetingContent(meetingId: string) {
  return {
    speakers: CANONICAL_SPEAKERS,
    summary: buildCanonicalSummary(meetingId),
    transcript: buildCanonicalTranscript(meetingId),
  };
}
