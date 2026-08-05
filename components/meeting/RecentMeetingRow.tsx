"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Link2, MoreHorizontal } from "lucide-react";
import { useState } from "react";

import AskScribeIconButton from "@/components/assistant/AskScribeIconButton";
import AskScribePopover from "@/components/assistant/AskScribePopover";
import HeaderTooltip from "@/components/shell/HeaderTooltip";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatMeetingRecentSecondaryLine } from "@/lib/formatting/date-formatters";
import { buildMeetingUrl, getMeetingHref } from "@/lib/meetings/get-href";
import { copyText } from "@/lib/shared/clipboard";
import type { Meeting } from "@/lib/meetings/types";
import { cn } from "@/lib/shared/utils";

type RecentMeetingRowProps = {
  meeting: Meeting;
  isActive?: boolean;
};

export default function RecentMeetingRow({ meeting, isActive = false }: RecentMeetingRowProps) {
  const router = useRouter();
  const [askOpen, setAskOpen] = useState(false);
  const meetingHref = getMeetingHref(meeting);

  async function copyMeetingLink() {
    if (typeof window === "undefined") {
      return;
    }

    await copyText(buildMeetingUrl(window.location.origin, meeting), {
      successMessage: "Meeting link copied",
    });
  }

  function handleOpen() {
    router.push(meetingHref);
  }

  return (
    <li className="group">
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-slate-200/90 bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[border-color,background-color] hover:border-slate-300",
          isActive && "border-slate-300 bg-slate-50",
        )}
      >
        <Link href={meetingHref} className="flex min-w-0 flex-1 items-center gap-3">
          <UserAvatar name={meeting.ownerName} ownerName={meeting.ownerName} size="md" />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-medium text-slate-900">{meeting.title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {formatMeetingRecentSecondaryLine(meeting)}
            </p>
          </div>
        </Link>

        <div
          className={cn(
            "row-actions-reveal flex shrink-0 items-center gap-0.5",
            isActive && "row-actions-reveal--visible",
          )}
        >
          <HeaderTooltip label="Copy meeting link">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Copy meeting link"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void copyMeetingLink();
              }}
            >
              <Link2 strokeWidth={1.75} aria-hidden="true" />
            </Button>
          </HeaderTooltip>

          <DropdownMenu>
            <HeaderTooltip label="More">
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="More"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                >
                  <MoreHorizontal strokeWidth={1.75} aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
            </HeaderTooltip>
            <DropdownMenuContent align="end" className="min-w-44">
              <DropdownMenuItem onSelect={handleOpen}>Open</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => undefined}>Share</DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  void copyMeetingLink();
                }}
              >
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => undefined}>Move to channel</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => undefined}>Rename</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => undefined}>Download</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => undefined}>Info</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:bg-red-50 focus:text-red-700"
                onSelect={() => undefined}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <HeaderTooltip label="Ask Scribe">
            <AskScribeIconButton
              aria-label="Ask Scribe"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setAskOpen(true);
              }}
            />
          </HeaderTooltip>
        </div>
      </div>

      <AskScribePopover
        open={askOpen}
        onOpenChange={setAskOpen}
        meetingId={meeting.id}
      />
    </li>
  );
}
