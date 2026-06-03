"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Link2, MoreHorizontal } from "lucide-react";

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
import { formatMeetingCardDate } from "@/lib/formatting/date-formatters";
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
    <li
      className={cn(
        "group flex items-center rounded-xl transition-colors hover:bg-slate-100",
        isActive && "bg-slate-100",
      )}
    >
      <Link
        href={meetingHref}
        className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3"
      >
        <UserAvatar name={meeting.ownerName} ownerName={meeting.ownerName} size="md" />
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-slate-900">
            {meeting.ownerName}
          </span>
          <span className="mt-0.5 block text-sm text-slate-500">
            {formatMeetingCardDate(meeting.createdAt)}
          </span>
        </span>
      </Link>

      <div
        className={cn(
          "mr-2 flex shrink-0 items-center gap-0.5",
          "opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100",
          isActive && "opacity-100",
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
      </div>
    </li>
  );
}
