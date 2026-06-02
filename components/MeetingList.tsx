"use client";

import Link from "next/link";

import { useMeetingsQuery } from "@/lib/meetings-query";

export default function MeetingList() {
  const { data: meetings, isLoading } = useMeetingsQuery();

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
    <ul className="space-y-2.5">
      {meetings.map((meeting) => {
        const href =
          meeting.status === "live" ? `/live/${meeting.id}` : `/view/${meeting.id}`;

        return (
          <li key={meeting.id}>
            <Link
              href={href}
              className="block rounded-xl border border-slate-200/90 bg-white px-4 py-3.5 transition hover:border-violet-200 hover:bg-violet-50/30"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[15px] font-medium text-slate-900">{meeting.title}</h2>
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                    meeting.status === "live"
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                      : "bg-violet-50 text-violet-700 ring-1 ring-violet-100"
                  }`}
                >
                  {meeting.status}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-slate-500">
                {new Date(meeting.createdAt).toLocaleString()} · {meeting.durationLabel}
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
