"use client";

import Link from "next/link";

import RecordingBadge from "@/components/RecordingBadge";
import StopMeetingButton from "@/components/StopMeetingButton";
import { Button } from "@/components/ui/button";
import { getMeetingHref } from "@/lib/get-meeting-href";
import type { Meeting } from "@/lib/meetings-types";

function LiveMeetingRow({ meeting }: { meeting: Meeting }) {
  return (
    <li>
      <div className="flex items-center gap-3 rounded-xl border border-red-200/90 bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(239,68,68,0.06)]">
        <RecordingBadge />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-medium text-slate-900">{meeting.title}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {new Date(meeting.createdAt).toLocaleString()} · {meeting.durationLabel}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={getMeetingHref(meeting)}>Live notes</Link>
          </Button>
          <StopMeetingButton meetingId={meeting.id} redirectToViewOnStop />
        </div>
      </div>
    </li>
  );
}

type LiveMeetingsSectionProps = {
  meetings: Meeting[];
};

export default function LiveMeetingsSection({ meetings }: LiveMeetingsSectionProps) {
  if (!meetings.length) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-sm text-slate-900">Live meetings</h2>
      <ul className="space-y-2.5">
        {meetings.map((meeting) => (
          <LiveMeetingRow key={meeting.id} meeting={meeting} />
        ))}
      </ul>
    </section>
  );
}
