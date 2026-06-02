export type MeetingStatus = "live" | "completed";

export type Speaker = {
  id: string;
  name: string;
};

export type TranscriptSentence = {
  id: string;
  index: number;
  speakerId: string;
  speakerName: string;
  text: string;
  startTime: number;
  endTime: number;
};

export type OutlineSection = {
  timestamp: string;
  title: string;
  bullets?: string[];
};

export type ActionItem = {
  id: string;
  text: string;
  assigneeName: string;
  timestamp?: string;
};

export type MeetingSummary = {
  keywords: string[];
  overview: string;
  gist?: string;
  bulletGist: string[];
  outline: OutlineSection[];
  notes: string[];
  actionItems: ActionItem[];
  topicsDiscussed?: string[];
  meetingType?: string;
};

export type CreateMeetingInput = {
  customTitle?: string;
  meetingLanguage?: string;
  userEmail?: string;
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
  speakers: Speaker[];
  summary: MeetingSummary;
  transcript: TranscriptSentence[];
};
