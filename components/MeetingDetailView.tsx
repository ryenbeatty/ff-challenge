"use client";

import { useMemo, useState } from "react";
import { useMeetingQuery } from "@/lib/meetings-query";
import { CalendarDays, ChevronDown, Copy, Globe, UserCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type MeetingDetailViewProps = {
  meetingId: string;
};

export default function MeetingDetailView({ meetingId }: MeetingDetailViewProps) {
  const { data: meeting, isLoading } = useMeetingQuery(meetingId);
  const [copyMenuOpen, setCopyMenuOpen] = useState(false);
  const actionItemsContent = useMemo(() => {
    if (!meeting) {
      return "";
    }

    return meeting.actionItemsByParticipant
      .map((group) => {
        const lines = group.items.map((item) => `- ${item}`).join("\n");
        return `${group.participant}\n${lines}`;
      })
      .join("\n\n");
  }, [meeting]);

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading meeting...</p>;
  }

  if (!meeting) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-normal leading-7 tracking-[-0.2px] text-slate-900">
          Meeting not found
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          This meeting does not exist in local storage.
        </p>
      </section>
    );
  }

  async function copyActionItemsOnly() {
    try {
      await navigator.clipboard.writeText(actionItemsContent);
    } catch {
      console.warn("Unable to copy action items.");
    } finally {
      setCopyMenuOpen(false);
    }
  }

  async function copyEntireSummary() {
    if (!meeting) {
      return;
    }

    const payload = `Summary\n${meeting.summary}\n\nAction items\n${actionItemsContent}`;
    try {
      await navigator.clipboard.writeText(payload);
    } catch {
      console.warn("Unable to copy full summary.");
    } finally {
      setCopyMenuOpen(false);
    }
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
      <article className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-normal leading-8 tracking-[-0.2px] text-slate-900">
          {meeting.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <UserCircle2 className="h-4 w-4 text-slate-500" />
            <span className="font-medium text-slate-700">{meeting.ownerName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-slate-500" />
            <span>{new Date(meeting.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-slate-500" />
            <span>{meeting.meetingLanguage}</span>
          </div>
        </div>

        <ul className="mt-6 list-disc space-y-2 pl-5 text-base leading-7 text-slate-700">
          {meeting.executiveSummary.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

        <section className="mt-6">
          <h2 className="text-sm font-semibold text-slate-900">Notes</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-7 text-slate-700">
            {meeting.notes.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-900">Action items</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="h-8 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700"
              >
                Edit
              </button>

              <DropdownMenu open={copyMenuOpen} onOpenChange={setCopyMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Copy options"
                    className="flex h-8 items-center rounded-md border border-slate-200 bg-white px-2 text-slate-700 hover:bg-slate-50"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={copyActionItemsOnly}>
                    copy action items
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={copyEntireSummary}>
                    copy entire summary
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {meeting.actionItemsByParticipant.map((group) => (
              <div key={group.participant}>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {group.participant}
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-base leading-7 text-slate-700">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </article>

      <aside className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900">Full transcript</h2>
        <ul className="mt-4 space-y-2.5">
          {meeting.transcript.map((segment) => (
            <li key={segment.id} className="rounded-md border border-slate-200 bg-slate-50/70 px-3 py-2.5">
              <p className="text-xs text-slate-500">
                <span className="font-medium text-slate-700">{segment.speaker}</span> ·{" "}
                {segment.timestamp}
              </p>
              <p className="mt-1 text-base leading-7 text-slate-800">{segment.text}</p>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
