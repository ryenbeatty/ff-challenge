import Link from "next/link";
import { UserCircle2 } from "lucide-react";

import { formatMeetingCardDate } from "@/lib/formatting/date-formatters";
import { getMeetingHref } from "@/lib/meetings/get-href";
import type { Meeting } from "@/lib/meetings/types";

type RecentMeetingRowProps = {
  meeting: Meeting;
};

export default function RecentMeetingRow({ meeting }: RecentMeetingRowProps) {
  return (
    <li>
      <Link
        href={getMeetingHref(meeting)}
        className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-violet-50/30"
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
  );
}
