"use client";

import { FolderInput, PartyPopper, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

import AskScribeSidebar from "@/components/meeting/AskScribeSidebar";
import { DEMO_MEETINGS_PAGE_ASSISTANT } from "@/demo/assistant";
import MeetingListRow from "@/components/meeting/MeetingListRow";
import EmptyMeetingsState from "@/components/states/EmptyMeetingsState";
import LoadingText from "@/components/states/LoadingText";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAddStressTestMeetingsMutation,
  useDeleteMeetingsMutation,
  useMeetingsQuery,
  useRenameMeetingMutation,
} from "@/lib/meetings/query";
import { selectCompletedMeetings } from "@/lib/meetings/selectors";
import type { Meeting } from "@/lib/meetings/types";
import { getCurrentUser } from "@/lib/shared/user-avatars";
import { cn } from "@/lib/shared/utils";

const DATE_GROUP_LOCALE = "en-US";

type MeetingsFilter = "hosted" | "shared";

function filterMeetingsByTab(meetings: Meeting[], filter: MeetingsFilter): Meeting[] {
  const currentUserName = getCurrentUser().name;

  if (filter === "hosted") {
    return meetings.filter((meeting) => meeting.ownerName === currentUserName);
  }

  return meetings.filter((meeting) => meeting.ownerName !== currentUserName);
}

function getMeetingsFilterForAvailability(
  currentFilter: MeetingsFilter,
  hostedCount: number,
  sharedCount: number,
): MeetingsFilter | null {
  if (currentFilter === "hosted" && hostedCount === 0 && sharedCount > 0) {
    return "shared";
  }

  if (currentFilter === "shared" && sharedCount === 0 && hostedCount > 0) {
    return "hosted";
  }

  return null;
}

type DateGroup = {
  dateKey: string;
  label: string;
  meetingIds: string[];
  meetings: Meeting[];
};

function getDateKey(iso: string): string {
  const date = new Date(iso);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDateGroupLabel(iso: string): string {
  return new Date(iso).toLocaleDateString(DATE_GROUP_LOCALE, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function groupMeetingsByDate(meetings: Meeting[]): DateGroup[] {
  const groups: DateGroup[] = [];

  for (const meeting of meetings) {
    const dateKey = getDateKey(meeting.createdAt);
    const existing = groups.find((group) => group.dateKey === dateKey);

    if (existing) {
      existing.meetings.push(meeting);
      existing.meetingIds.push(meeting.id);
      continue;
    }

    groups.push({
      dateKey,
      label: getDateGroupLabel(meeting.createdAt),
      meetingIds: [meeting.id],
      meetings: [meeting],
    });
  }

  return groups;
}

function toggleSetMember(set: Set<string>, id: string): Set<string> {
  const next = new Set(set);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  return next;
}

function MeetingListShell({
  children,
  overlay,
}: {
  children: ReactNode;
  overlay?: ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <section className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {overlay}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-6 sm:px-6">
          <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col">
            {children}
          </div>
        </div>
      </section>

      <AskScribeSidebar
        meetingId=""
        content={DEMO_MEETINGS_PAGE_ASSISTANT}
        className="hidden shrink-0 lg:flex lg:min-h-0"
      />
    </div>
  );
}

export default function MeetingList() {
  const { data: meetings, isLoading } = useMeetingsQuery();
  const deleteMeetingsMutation = useDeleteMeetingsMutation();
  const renameMeetingMutation = useRenameMeetingMutation();
  const addStressTestMeetingsMutation = useAddStressTestMeetingsMutation();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [meetingsFilter, setMeetingsFilter] = useState<MeetingsFilter>("hosted");
  const [renamingMeeting, setRenamingMeeting] = useState<Meeting | null>(null);
  const [renameTitle, setRenameTitle] = useState("");

  const recentMeetings = selectCompletedMeetings(meetings ?? []);
  const hostedMeetings = useMemo(
    () => filterMeetingsByTab(recentMeetings, "hosted"),
    [recentMeetings],
  );
  const sharedMeetings = useMemo(
    () => filterMeetingsByTab(recentMeetings, "shared"),
    [recentMeetings],
  );
  const visibleMeetings =
    meetingsFilter === "hosted" ? hostedMeetings : sharedMeetings;
  const visibleMeetingIds = useMemo(
    () => visibleMeetings.map((meeting) => meeting.id),
    [visibleMeetings],
  );
  const dateGroups = useMemo(() => groupMeetingsByDate(visibleMeetings), [visibleMeetings]);
  const selectedCount = selectedIds.size;
  const hasSelection = selectedCount > 0;
  const allVisibleSelected =
    visibleMeetingIds.length > 0 &&
    visibleMeetingIds.every((id) => selectedIds.has(id));
  const isSelectionIndeterminate = hasSelection && !allVisibleSelected;

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const preferredFilter = getMeetingsFilterForAvailability(
      meetingsFilter,
      hostedMeetings.length,
      sharedMeetings.length,
    );

    if (!preferredFilter) {
      return;
    }

    setMeetingsFilter(preferredFilter);
    setSelectedIds(new Set());
  }, [isLoading, meetingsFilter, hostedMeetings.length, sharedMeetings.length]);

  function toggleMeetingSelection(meetingId: string) {
    setSelectedIds((current) => toggleSetMember(current, meetingId));
  }

  function toggleGroupSelection(meetingIds: string[]) {
    setSelectedIds((current) => {
      const allSelected = meetingIds.every((id) => current.has(id));
      const next = new Set(current);

      if (allSelected) {
        for (const id of meetingIds) {
          next.delete(id);
        }
      } else {
        for (const id of meetingIds) {
          next.add(id);
        }
      }

      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function toggleSelectAllVisible() {
    if (allVisibleSelected) {
      clearSelection();
      return;
    }

    setSelectedIds(new Set(visibleMeetingIds));
  }

  function handleMeetingsFilterChange(value: string) {
    if (value !== "hosted" && value !== "shared") {
      return;
    }

    setMeetingsFilter(value);
    clearSelection();
  }

  function openRenameDialog(meeting: Meeting) {
    setRenamingMeeting(meeting);
    setRenameTitle(meeting.title);
  }

  function closeRenameDialog() {
    setRenamingMeeting(null);
    setRenameTitle("");
  }

  async function handleRenameSubmit() {
    if (!renamingMeeting) {
      return;
    }

    await renameMeetingMutation.mutateAsync({
      meetingId: renamingMeeting.id,
      title: renameTitle,
    });
    closeRenameDialog();
  }

  function handleDeleteMeeting(meetingId: string) {
    deleteMeetingsMutation.mutate([meetingId], {
      onSuccess: () => {
        setSelectedIds((current) => {
          const next = new Set(current);
          next.delete(meetingId);
          return next;
        });
      },
    });
  }

  function handleBulkDelete() {
    const ids = [...selectedIds];
    deleteMeetingsMutation.mutate(ids, {
      onSuccess: () => clearSelection(),
    });
  }

  const bulkActionOverlay = hasSelection ? (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-5 pb-6 sm:px-6">
      <div className="pointer-events-auto mx-auto flex w-full max-w-3xl justify-center gap-3">
        <Button type="button" variant="dark" onClick={() => toast("Coming soon")}>
          <FolderInput aria-hidden="true" />
          Move
        </Button>
        <Button
          type="button"
          variant="dark"
          disabled={deleteMeetingsMutation.isPending}
          onClick={handleBulkDelete}
        >
          <Trash2 aria-hidden="true" />
          Delete
        </Button>
      </div>
    </div>
  ) : null;

  if (isLoading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <MeetingListShell>
          <div className="flex flex-1 items-center">
            <LoadingText>Loading meetings...</LoadingText>
          </div>
        </MeetingListShell>
      </div>
    );
  }

  if (!meetings?.length) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <MeetingListShell>
          <div className="flex flex-1 items-center">
            <EmptyMeetingsState />
          </div>
        </MeetingListShell>
      </div>
    );
  }

  if (!recentMeetings.length) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <MeetingListShell>
          <div className="flex flex-1 items-center">
            <EmptyMeetingsState variant="no-completed" />
          </div>
        </MeetingListShell>
      </div>
    );
  }

  const listToolbar = hasSelection ? (
    <div className="flex h-9 items-center gap-2.5">
      <Checkbox
        checked={allVisibleSelected}
        indeterminate={isSelectionIndeterminate}
        onChange={toggleSelectAllVisible}
        aria-label={
          allVisibleSelected
            ? "Deselect all meetings"
            : isSelectionIndeterminate
              ? "Select all meetings"
              : "Select all meetings"
        }
      />
      <span className="text-sm font-medium text-slate-700">
        {selectedCount} meeting{selectedCount === 1 ? "" : "s"} selected
      </span>
      <button
        type="button"
        onClick={clearSelection}
        className="cursor-pointer text-sm font-medium text-violet-700 transition hover:text-violet-800"
      >
        Clear
      </button>
    </div>
  ) : (
    <div className="flex w-full min-w-0 items-center justify-between gap-3">
      <ToggleGroup
        type="single"
        value={meetingsFilter}
        onValueChange={handleMeetingsFilterChange}
        aria-label="Meeting filter"
      >
        <ToggleGroupItem value="hosted">Hosted by me</ToggleGroupItem>
        <ToggleGroupItem value="shared">Shared with me</ToggleGroupItem>
      </ToggleGroup>

      <Button
        type="button"
        variant="stress"
        size="sm"
        className="shrink-0"
        disabled={addStressTestMeetingsMutation.isPending}
        onClick={() => {
          addStressTestMeetingsMutation.mutate(
            { count: 10 },
            {
              onSuccess: () => toast.success("Added 10 dummy meetings"),
              onError: () => toast.error("Could not add dummy meetings"),
            },
          );
        }}
      >
        <PartyPopper aria-hidden="true" />
        Stress test! +10 dummy meetings
      </Button>
    </div>
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MeetingListShell overlay={bulkActionOverlay}>
        <div className={cn("space-y-6", hasSelection && "pb-20")}>
          <div className="flex h-9 items-center px-1">{listToolbar}</div>

          {visibleMeetings.length === 0 ? (
            <p className="px-1 text-sm text-slate-600">
              {meetingsFilter === "hosted"
                ? "No meetings hosted by you yet."
                : "No meetings shared with you yet."}
            </p>
          ) : null}

          {dateGroups.map((group) => {
            const groupAllSelected =
              group.meetingIds.length > 0 &&
              group.meetingIds.every((id) => selectedIds.has(id));
            const groupSomeSelected = group.meetingIds.some((id) => selectedIds.has(id));
            const groupIndeterminate = groupSomeSelected && !groupAllSelected;

            return (
              <section key={group.dateKey} className="space-y-2.5">
                <div className="flex items-center gap-2.5 px-1">
                  <Checkbox
                    checked={groupAllSelected}
                    indeterminate={groupIndeterminate}
                    onChange={() => toggleGroupSelection(group.meetingIds)}
                    aria-label={`Select all meetings on ${group.label}`}
                  />
                  <h2 className="text-sm font-medium text-slate-700">{group.label}</h2>
                </div>

                <ul className="space-y-2.5">
                  {group.meetings.map((meeting) => (
                    <MeetingListRow
                      key={meeting.id}
                      meeting={meeting}
                      selected={selectedIds.has(meeting.id)}
                      groupAllSelected={groupAllSelected}
                      onToggleSelect={() => toggleMeetingSelection(meeting.id)}
                      onRename={() => openRenameDialog(meeting)}
                      onDelete={() => handleDeleteMeeting(meeting.id)}
                    />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </MeetingListShell>

      <Dialog
        open={renamingMeeting !== null}
        onOpenChange={(open) => {
          if (!open) {
            closeRenameDialog();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename meeting</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="meeting-rename-title">Title</Label>
            <Input
              id="meeting-rename-title"
              value={renameTitle}
              onChange={(event) => setRenameTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void handleRenameSubmit();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeRenameDialog}>
              Cancel
            </Button>
            <Button
              type="button"
              disabled={renameMeetingMutation.isPending}
              onClick={() => void handleRenameSubmit()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
