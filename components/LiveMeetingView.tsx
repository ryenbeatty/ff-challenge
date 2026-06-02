"use client";

import Link from "next/link";

import { useMeetingQuery } from "@/lib/meetings-query";

type LiveMeetingViewProps = {
  meetingId: string;
};

export default function LiveMeetingView({ meetingId }: LiveMeetingViewProps) {
  const { data: meeting, isLoading } = useMeetingQuery(meetingId);

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading meeting...</p>;
  }

  if (!meeting) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-slate-900">Meeting not found</h1>
        <p className="mt-2 text-sm text-slate-600">
          This meeting does not exist in local storage.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{meeting.title}</h1>
            <p className="mt-2 text-sm text-slate-600">
              Status:{" "}
              <span
                className={
                  meeting.status === "live" ? "font-medium text-emerald-700" : "font-medium text-violet-700"
                }
              >
                {meeting.status}
              </span>
            </p>
          </div>
          {meeting.status === "completed" ? (
            <Link
              href={`/view/${meeting.id}`}
              className="h-9 rounded-md border border-violet-200 bg-violet-600 px-3.5 text-sm font-medium text-white transition hover:bg-violet-700"
            >
              Show full meeting
            </Link>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900">Live transcript feed</h2>

        <ul className="mt-4 space-y-2.5">
          {meeting.transcript.map((segment) => (
            <li key={segment.id} className="rounded-md border border-slate-200 bg-slate-50/70 px-3.5 py-3">
              <p className="text-xs text-slate-500">
                <span className="font-medium text-slate-700">{segment.speaker}</span> ·{" "}
                {segment.timestamp}
              </p>
              <p className="mt-1.5 text-sm leading-6 text-slate-800">{segment.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
