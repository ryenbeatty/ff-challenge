import RecordingBadge from "@/components/live/RecordingBadge";
import LiveNotesButton from "@/components/meeting/LiveNotesButton";
import StopMeetingButton from "@/components/live/StopMeetingButton";
import { formatMeetingListSecondaryLine } from "@/lib/formatting/date-formatters";
import { getMeetingHref } from "@/lib/meetings/get-href";
import type { Meeting } from "@/lib/meetings/types";

type LiveMeetingRowProps = {
  meeting: Meeting;
};

export default function LiveMeetingRow({ meeting }: LiveMeetingRowProps) {
  return (
    <li>
      <div className="flex items-center gap-3 rounded-xl border border-red-200/90 bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(239,68,68,0.06)]">
        <RecordingBadge />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-medium text-slate-900">{meeting.title}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {formatMeetingListSecondaryLine(meeting)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <LiveNotesButton href={getMeetingHref(meeting)} />
          <StopMeetingButton meetingId={meeting.id} redirectToViewOnStop />
        </div>
      </div>
    </li>
  );
}
