"use client";

import Link from "next/link";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/ui/user-avatar";
import { formatMeetingListMetadata } from "@/lib/formatting/date-formatters";
import { buildMeetingUrl, getMeetingHref } from "@/lib/meetings/get-href";
import { copyText } from "@/lib/shared/clipboard";
import type { Meeting } from "@/lib/meetings/types";
import { cn } from "@/lib/shared/utils";

type MeetingListRowProps = {
  meeting: Meeting;
  selected: boolean;
  groupAllSelected: boolean;
  onToggleSelect: () => void;
  onRename: () => void;
  onDelete: () => void;
};

function stubAction() {
  toast("Coming soon");
}

export default function MeetingListRow({
  meeting,
  selected,
  groupAllSelected,
  onToggleSelect,
  onRename,
  onDelete,
}: MeetingListRowProps) {
  const showCheckbox = selected || groupAllSelected;
  const meetingHref = getMeetingHref(meeting);

  async function copyMeetingLink() {
    if (typeof window === "undefined") {
      return;
    }

    await copyText(buildMeetingUrl(window.location.origin, meeting), {
      successMessage: "Meeting link copied",
    });
  }

  return (
    <li className="group flex items-stretch gap-3 rounded-xl border border-slate-200/90 bg-white px-3 py-3 transition hover:border-slate-300">
      <label
        className={cn(
          "relative block h-9 w-9 shrink-0 cursor-pointer self-center rounded-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-ring",
          selected && "ring-2 ring-violet-600 ring-offset-1",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <UserAvatar
          name={meeting.ownerName}
          ownerName={meeting.ownerName}
          size="md"
          className="pointer-events-none"
        />
        <span
          className={cn(
            "row-checkbox-reveal absolute inset-0 flex items-center justify-center",
            showCheckbox
              ? "pointer-events-auto opacity-100"
              : "row-checkbox-reveal--hidden pointer-events-auto opacity-100",
          )}
        >
          <Checkbox
            checked={selected}
            onChange={(event) => {
              event.stopPropagation();
              onToggleSelect();
            }}
            aria-label={selected ? "Deselect meeting" : "Select meeting"}
          />
        </span>
      </label>

      <div className="min-w-0 flex-1">
        <Link
          href={meetingHref}
          className="group/title inline-flex max-w-full min-w-0 items-center gap-1 text-base font-medium text-slate-900 transition hover:text-violet-700"
        >
          <span className="truncate">{meeting.title}</span>
          <ChevronRight
            className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover/title:text-violet-600"
            aria-hidden="true"
          />
        </Link>
        <p className="mt-1 text-sm text-slate-500">{formatMeetingListMetadata(meeting)}</p>
      </div>

      <div className="flex shrink-0 items-center gap-1 self-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon" aria-label="More actions">
              <MoreHorizontal strokeWidth={1.75} aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-44">
            <DropdownMenuItem onSelect={() => stubAction()}>Share</DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                void copyMeetingLink();
              }}
            >
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => stubAction()}>Download</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => stubAction()}>Move to channel</DropdownMenuItem>
            <DropdownMenuItem onSelect={onRename}>Rename</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:bg-red-50 focus:text-red-700"
              onSelect={onDelete}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="sm" className="text-slate-700" asChild>
          <Link href={meetingHref}>
            Details
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </li>
  );
}
