export type MeetingStatus = "live" | "completed";

export type TranscriptSegment = {
  id: string;
  speaker: "Alex" | "Jordan";
  timestamp: string;
  text: string;
};

export type ParticipantActionItems = {
  participant: string;
  items: string[];
};

export type Meeting = {
  id: string;
  title: string;
  ownerName: string;
  meetingLanguage: string;
  status: MeetingStatus;
  createdAt: string;
  stoppedAt: string | null;
  durationLabel: string;
  summary: string;
  executiveSummary: string[];
  notes: string[];
  transcript: TranscriptSegment[];
  actionItemsByParticipant: ParticipantActionItems[];
};
