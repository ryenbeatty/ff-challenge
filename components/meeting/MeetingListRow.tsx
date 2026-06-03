"use client";

import Link from "next/link";
import { Bot } from "lucide-react";

import HeaderTooltip from "@/components/shell/HeaderTooltip";
import { Button } from "@/components/ui/button";
import { formatMeetingListSecondaryLine } from "@/lib/formatting/date-formatters";
import { getMeetingHref } from "@/lib/meetings/get-href";
import type { Meeting } from "@/lib/meetings/types";
import { cn } from "@/lib/shared/utils";

type MeetingListRowProps = {
  meeting: Meeting;
  isSelected?: boolean;
  onAskFireflies?: () => void;
};

export default function MeetingListRow({
  meeting,
  isSelected = false,
  onAskFireflies,
}: MeetingListRowProps) {
  return (
    <li
      className={cn(
        "group flex items-center rounded-xl transition-colors",
        isSelected && "bg-violet-50/40",
      )}
    >
      <Link
        href={getMeetingHref(meeting)}
        className="block min-w-0 flex-1 rounded-xl border border-slate-200/90 bg-white px-4 py-3.5 transition hover:border-violet-200 hover:bg-violet-50/30"
      >
        <h2 className="text-base font-medium text-slate-900">{meeting.title}</h2>
        <p className="mt-1.5 text-sm text-slate-500">
          {formatMeetingListSecondaryLine(meeting)}
        </p>
      </Link>

      {onAskFireflies ? (
        <div
          className={cn(
            "mr-2 flex shrink-0 items-center",
            "opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100",
            isSelected && "opacity-100",
          )}
        >
          <HeaderTooltip label="Ask Fireflies">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Ask Fireflies"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onAskFireflies();
              }}
            >
              <Bot strokeWidth={1.75} aria-hidden="true" />
            </Button>
          </HeaderTooltip>
        </div>
      ) : null}
    </li>
  );
}
