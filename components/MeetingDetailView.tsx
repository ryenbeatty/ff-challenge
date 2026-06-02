"use client";

import { useMemo, useState } from "react";
import { useMeetingQuery } from "@/lib/meetings-query";
import { ChevronDown, Copy } from "lucide-react";
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
        <h1 className="text-xl font-semibold text-slate-900">Meeting not found</h1>
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
        <p className="text-xs uppercase tracking-wide text-slate-500">Meeting summary</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{meeting.title}</h1>
        <p className="mt-2 text-sm text-slate-600">
          {new Date(meeting.createdAt).toLocaleString()} · {meeting.durationLabel}
        </p>
        <p className="mt-6 text-sm leading-7 text-slate-800">{meeting.summary}</p>

        <section className="mt-6 rounded-lg border border-slate-200 bg-slate-50/60 p-4">
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
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
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
              <p className="mt-1 text-sm leading-6 text-slate-800">{segment.text}</p>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
