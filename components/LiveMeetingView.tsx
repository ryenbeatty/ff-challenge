"use client";

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
        <h1 className="text-xl font-normal leading-7 tracking-[-0.2px] text-slate-900">
          Meeting not found
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          This meeting does not exist in local storage.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-base font-semibold text-slate-900">Live transcript feed</h2>

      <ul className="mt-4 space-y-2.5">
        {meeting.transcript.map((segment) => (
          <li key={segment.id} className="rounded-md border border-slate-200 bg-slate-50/70 px-3.5 py-3">
            <p className="text-xs text-slate-500">
              <span className="font-medium text-slate-700">{segment.speaker}</span> ·{" "}
              {segment.timestamp}
            </p>
            <p className="mt-1.5 text-base leading-7 text-slate-800">{segment.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
