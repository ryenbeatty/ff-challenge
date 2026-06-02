import { ParticipantActionItems, TranscriptSegment } from "./meetings-types";

export const DASHBOARD_SUMMARY =
  "Alex and Jordan aligned on building a new product dashboard that prioritizes activation, retention, and revenue metrics. They agreed to ship an MVP with executive summaries, team-level filters, and a weekly snapshot workflow before expanding into deeper custom analytics.";

export const DASHBOARD_ACTION_ITEMS: ParticipantActionItems[] = [
  {
    participant: "Alex",
    items: [
      "Draft the executive summary module wireframe by Friday.",
      "Define weekly snapshot KPIs for activation, retention, and expansion.",
      "Review MVP scope with leadership and confirm launch criteria.",
    ],
  },
  {
    participant: "Jordan",
    items: [
      "Implement segment filters for enterprise, mid-market, and self-serve.",
      "Prepare read-only widget API contracts for the dashboard MVP.",
      "Create the phase-two proposal for annotations and alerting.",
    ],
  },
];

export function createDummyTranscript(meetingId: string): TranscriptSegment[] {
  return [
    {
      id: `${meetingId}-1`,
      speaker: "Alex",
      timestamp: "00:00",
      text: "I want this new dashboard to help leadership understand product health in under a minute.",
    },
    {
      id: `${meetingId}-2`,
      speaker: "Jordan",
      timestamp: "00:42",
      text: "Then we should anchor the top row on activation, retention, and expansion revenue so the signal is immediate.",
    },
    {
      id: `${meetingId}-3`,
      speaker: "Alex",
      timestamp: "01:18",
      text: "Agreed. I also want a section that compares this week to last week with clear deltas and color coding.",
    },
    {
      id: `${meetingId}-4`,
      speaker: "Jordan",
      timestamp: "02:05",
      text: "Let's include drill-downs by segment: enterprise, mid-market, and self-serve. Filters need to be saved per user.",
    },
    {
      id: `${meetingId}-5`,
      speaker: "Alex",
      timestamp: "03:10",
      text: "For MVP, we can skip heavy customization and focus on a reliable default view plus exportable weekly snapshot.",
    },
    {
      id: `${meetingId}-6`,
      speaker: "Jordan",
      timestamp: "04:02",
      text: "Perfect. We'll start with read-only widgets now and add annotation and alerting in the next phase.",
    },
  ];
}
