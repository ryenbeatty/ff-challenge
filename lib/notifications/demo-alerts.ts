import { DEFAULT_USER_EMAIL } from "@/lib/meetings/build-title";
import { JORDAN_EMAIL, MAYA_EMAIL } from "@/lib/meetings/canonical-content";

export type DemoAlert = {
  id: string;
  actorEmail: string;
  /** Shown quoted in title, e.g. June 02, 04:47PM */
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
      {
        id: "alert-today-1",
        actorEmail: MAYA_EMAIL,
        meetingLabel: "June 03, 10:30AM",
        timeLabel: "10:45 AM",
      },
      {
        id: "alert-today-2",
        actorEmail: JORDAN_EMAIL,
        meetingLabel: "June 03, 02:15PM",
        timeLabel: "2:28 PM",
      },
    ],
  },
  {
    label: "Yesterday",
    alerts: [
      {
        id: "alert-yesterday-1",
        actorEmail: DEFAULT_USER_EMAIL,
        meetingLabel: "June 02, 09:12AM",
        timeLabel: "9:20 AM",
      },
      {
        id: "alert-yesterday-2",
        actorEmail: MAYA_EMAIL,
        meetingLabel: "June 02, 04:47PM",
        timeLabel: "5:05 PM",
      },
    ],
  },
  {
    label: "June 1",
    alerts: [
      {
        id: "alert-june-1-1",
        actorEmail: JORDAN_EMAIL,
        meetingLabel: "June 01, 11:00AM",
        timeLabel: "11:18 AM",
      },
      {
        id: "alert-june-1-2",
        actorEmail: DEFAULT_USER_EMAIL,
        meetingLabel: "June 01, 03:30PM",
        timeLabel: "3:42 PM",
      },
    ],
  },
  {
    label: "May 28",
    alerts: [
      {
        id: "alert-may-28-1",
        actorEmail: MAYA_EMAIL,
        meetingLabel: "May 28, 01:05PM",
        timeLabel: "1:12 PM",
      },
    ],
  },
];

export const DEMO_NOTIFICATION_COUNT = DEMO_NOTIFICATION_SECTIONS.reduce(
  (total, section) => total + section.alerts.length,
  0,
);
