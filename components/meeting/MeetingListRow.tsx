import Link from "next/link";

import { formatMeetingListSecondaryLine } from "@/lib/formatting/date-formatters";
import { getMeetingHref } from "@/lib/meetings/get-href";
import type { Meeting } from "@/lib/meetings/types";

type MeetingListRowProps = {
  meeting: Meeting;
};

export default function MeetingListRow({ meeting }: MeetingListRowProps) {
  return (
    <li>
      <Link
        href={getMeetingHref(meeting)}
        className="block rounded-xl border border-slate-200/90 bg-white px-4 py-3.5 transition hover:border-violet-200 hover:bg-violet-50/30"
      >
        <h2 className="text-base font-medium text-slate-900">{meeting.title}</h2>
        <p className="mt-1.5 text-sm text-slate-500">
          {formatMeetingListSecondaryLine(meeting)}
        </p>
      </Link>
    </li>
  );
}
