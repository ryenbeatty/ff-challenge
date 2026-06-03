import { formatMeetingCardDate } from "@/lib/formatting/date-formatters";
import { DEFAULT_USER_EMAIL } from "@/lib/meetings/build-title";

import { buildDefaultMeetings, JORDAN_EMAIL, MAYA_EMAIL } from "./meetings";

const SEED_MEETINGS = buildDefaultMeetings();

function meetingLabelFor(meetingId: string): string {
  const meeting = SEED_MEETINGS.find((entry) => entry.id === meetingId);
  if (!meeting) {
    throw new Error(`Unknown demo meeting id: ${meetingId}`);
  }

  return formatMeetingCardDate(meeting.createdAt);
}

function buildAlert({
  id,
  actorEmail,
  meetingId,
  timeLabel,
}: {
  id: string;
  actorEmail: string;
  meetingId: string;
  timeLabel: string;
}): DemoAlert {
  return {
    id,
    actorEmail,
    meetingId,
    meetingLabel: meetingLabelFor(meetingId),
    timeLabel,
  };
}

export type DemoAlert = {
  id: string;
  actorEmail: string;
  meetingId: string;
  /** Shown quoted in title, from the linked meeting's createdAt. */
  meetingLabel: string;
  /** Right-rail time, e.g. 5:05 PM */
  timeLabel: string;
};

export type DemoAlertSection = {
  label: string;
  alerts: DemoAlert[];
};

export const DEMO_NOTIFICATION_SECTIONS: DemoAlertSection[] = [
  {
    label: "Today",
    alerts: [
      buildAlert({
        id: "alert-today-1",
        actorEmail: MAYA_EMAIL,
        meetingId: "demo-meeting-3",
        timeLabel: "10:45 AM",
      }),
      buildAlert({
        id: "alert-today-2",
        actorEmail: JORDAN_EMAIL,
        meetingId: "demo-meeting-3",
        timeLabel: "2:28 PM",
      }),
    ],
  },
  {
    label: "Yesterday",
    alerts: [
      buildAlert({
        id: "alert-yesterday-1",
        actorEmail: DEFAULT_USER_EMAIL,
        meetingId: "demo-meeting-2",
        timeLabel: "9:20 AM",
      }),
      buildAlert({
        id: "alert-yesterday-2",
        actorEmail: MAYA_EMAIL,
        meetingId: "demo-meeting-3",
        timeLabel: "5:05 PM",
      }),
    ],
  },
  {
    label: "June 1",
    alerts: [
      buildAlert({
        id: "alert-june-1-1",
        actorEmail: JORDAN_EMAIL,
        meetingId: "demo-meeting-3",
        timeLabel: "11:18 AM",
      }),
      buildAlert({
        id: "alert-june-1-2",
        actorEmail: DEFAULT_USER_EMAIL,
        meetingId: "demo-meeting-2",
        timeLabel: "3:42 PM",
      }),
    ],
  },
  {
    label: "May 28",
    alerts: [
      buildAlert({
        id: "alert-may-28-1",
        actorEmail: MAYA_EMAIL,
        meetingId: "demo-meeting-1",
        timeLabel: "1:12 PM",
      }),
    ],
  },
];

export const DEMO_NOTIFICATION_COUNT = DEMO_NOTIFICATION_SECTIONS.reduce(
  (total, section) => total + section.alerts.length,
  0,
);
