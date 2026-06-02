"use client";

import Link from "next/link";
import { useMemo } from "react";

import RecordingBadge from "@/components/RecordingBadge";
import StopMeetingButton from "@/components/StopMeetingButton";
import { Button } from "@/components/ui/button";
import { getMeetingHref } from "@/lib/get-meeting-href";
import { useMeetingsQuery } from "@/lib/meetings-query";
import { sortMeetingsByNewest } from "@/lib/sort-meetings";
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

function RecentMeetingRow({ meeting }: { meeting: Meeting }) {
  return (
    <li>
      <Link
        href={getMeetingHref(meeting)}
        className="block rounded-xl border border-slate-200/90 bg-white px-4 py-3.5 transition hover:border-violet-200 hover:bg-violet-50/30"
      >
        <h2 className="text-base font-medium text-slate-900">{meeting.title}</h2>
        <p className="mt-1.5 text-sm text-slate-500">
          {new Date(meeting.createdAt).toLocaleString()} · {meeting.durationLabel}
        </p>
      </Link>
    </li>
  );
}

export default function MeetingList() {
  const { data: meetings, isLoading } = useMeetingsQuery();

  const liveMeetings = useMemo(
    () => sortMeetingsByNewest((meetings ?? []).filter((meeting) => meeting.status === "live")),
    [meetings],
  );

  const recentMeetings = useMemo(
    () =>
      sortMeetingsByNewest((meetings ?? []).filter((meeting) => meeting.status !== "live")),
    [meetings],
  );

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading meetings...</p>;
  }

  if (!meetings?.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="text-base text-slate-800">No meetings yet.</p>
        <p className="mt-2 text-sm text-slate-600">
          Click <span className="font-medium text-violet-700">Capture</span> in the header to
          create your first meeting.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {liveMeetings.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-900">Live meetings</h2>
          <ul className="space-y-2.5">
            {liveMeetings.map((meeting) => (
              <LiveMeetingRow key={meeting.id} meeting={meeting} />
            ))}
          </ul>
        </section>
      ) : null}

      {recentMeetings.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-900">Recent meetings</h2>
          <ul className="space-y-2.5">
            {recentMeetings.map((meeting) => (
              <RecentMeetingRow key={meeting.id} meeting={meeting} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
