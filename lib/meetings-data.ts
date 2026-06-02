import { ParticipantActionItems, TranscriptSegment } from "./meetings-types";

export const DASHBOARD_SUMMARY =
  "Alex and Jordan aligned on building a new product dashboard that prioritizes activation, retention, and revenue metrics. They agreed to ship an MVP with executive summaries, team-level filters, and a weekly snapshot workflow before expanding into deeper custom analytics.";

export const EXECUTIVE_SUMMARY_POINTS: string[] = [
  "Fireflies Desktop App Launch: Automatic meeting detection and recording via device audio or bot participant improves productivity and integration.",
  "User Controls and Notifications: Briefing notifications 15 minutes before meetings enhance readiness; privacy settings allow managing language preferences.",
  "Live Assist Panel: Provides real-time support, including AI notes and transcript access, minimizing distractions during meetings.",
  "AI-Driven Meeting Assistance: Automatically captures key points with timestamps and offers Sales Assist features when a bot is present.",
  "Privacy and Permissions Management: Users control recording options and must approve microphone access, ensuring transparency and data protection.",
  "Simple Setup and Integration: Quick downloads sync with calendars, while company knowledge uploads activate Sales Assist for enhanced insights.",
];

export const MEETING_NOTES_POINTS: string[] = [
  "Product Launch and User Experience: The Fireflies desktop app now offers seamless meeting capture with real-time notes and smart assistance to improve productivity.",
  "Meeting Detection and Recording Modes: Users can capture meetings through device audio or by inviting the note-taker bot, with bot mode enabling speaker labels, transcripts, and Sales Assist.",
  "Live Assist and Ask Fred: The live panel supports transcript, prep context, AI notes, slash commands, and Q&A during calls while remaining unobtrusive during screen sharing.",
  "Privacy and Permissions: Users manage auto-recording, language, recap recipients, and must explicitly approve microphone and system audio access.",
  "Sales Enablement: Uploading company knowledge in Settings activates Sales Assist for richer in-meeting guidance when the bot is present.",
  "Setup and Integration: Download is quick, calendar syncing is automatic, and recording controls are easy to access before and during meetings.",
];

export const DASHBOARD_ACTION_ITEMS: ParticipantActionItems[] = [
  {
    participant: "Max Musterman",
    items: [
      "Download and install the Fireflies desktop app from the profile menu on fireflies.ai to enable automatic meeting detection and live note-taking (00:00).",
      "Configure meeting preferences in Settings, including language, auto-record toggle, email recap recipients, and privacy defaults (00:00).",
      "Grant microphone and system audio permissions to enable accurate capture and transcription (00:00).",
      "Choose per meeting whether to invite the note-taker bot or use device audio recording mode, and toggle capture accordingly (00:02).",
      "Upload the company knowledge base in Settings to activate Sales Assist when the note-taker bot is present (00:02).",
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
