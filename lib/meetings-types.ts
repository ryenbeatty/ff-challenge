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
  status: MeetingStatus;
  createdAt: string;
  stoppedAt: string | null;
  durationLabel: string;
  summary: string;
  transcript: TranscriptSegment[];
  actionItemsByParticipant: ParticipantActionItems[];
};
