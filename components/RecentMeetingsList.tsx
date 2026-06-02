"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDown, UserCircle2 } from "lucide-react";

import { formatMeetingCardDate } from "@/lib/format-meeting-date";
import { getMeetingHref } from "@/lib/get-meeting-href";
import { useMeetingsQuery } from "@/lib/meetings-query";
import { sortMeetingsByNewest } from "@/lib/sort-meetings";
import { cn } from "@/lib/utils";

const DEFAULT_VISIBLE_COUNT = 3;

export default function RecentMeetingsList() {
  const { data: meetings, isLoading } = useMeetingsQuery();
  const [isExpanded, setIsExpanded] = useState(false);

  const sortedMeetings = useMemo(
    () =>
      meetings
        ? sortMeetingsByNewest(meetings.filter((meeting) => meeting.status !== "live"))
        : [],
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

  if (!sortedMeetings.length) {
    return null;
  }

  const visibleMeetings = isExpanded
    ? sortedMeetings
    : sortedMeetings.slice(0, DEFAULT_VISIBLE_COUNT);
  const hasMore = sortedMeetings.length > DEFAULT_VISIBLE_COUNT;

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-slate-900">Recent meetings</h2>
      <ul className="space-y-2">
        {visibleMeetings.map((meeting) => (
          <li key={meeting.id}>
            <Link
              href={getMeetingHref(meeting)}
              className="flex items-center gap-3 rounded-xl border border-slate-200/90 bg-white px-4 py-3 transition hover:border-violet-200 hover:bg-violet-50/30"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
                <UserCircle2 className="h-5 w-5 text-slate-500" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-slate-900">
                  {meeting.ownerName}
                </span>
                <span className="mt-0.5 block text-sm text-slate-500">
                  {formatMeetingCardDate(meeting.createdAt)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {hasMore ? (
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((current) => !current)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-700 transition hover:text-violet-800"
        >
          View more
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")}
            aria-hidden="true"
          />
        </button>
      ) : null}
    </section>
  );
}
