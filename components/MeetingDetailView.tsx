"use client";

import { useMemo, useState } from "react";
import MeetingViewSidebar from "@/components/MeetingViewSidebar";
import { Button } from "@/components/ui/button";
import { useMeetingQuery } from "@/lib/meetings-query";
import type { ActionItem } from "@/lib/meetings-types";
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

function formatActionItemsForCopy(actionItems: ActionItem[]): string {
  const groups = new Map<string, ActionItem[]>();

  for (const item of actionItems) {
    const existing = groups.get(item.assigneeName) ?? [];
    existing.push(item);
    groups.set(item.assigneeName, existing);
  }

  return Array.from(groups.entries())
    .map(([assignee, items]) => {
      const lines = items.map((item) => {
        const suffix = item.timestamp ? ` (${item.timestamp})` : "";
        return `- ${item.text}${suffix}`;
      });
      return `${assignee}\n${lines.join("\n")}`;
    })
    .join("\n\n");
}

export default function MeetingDetailView({ meetingId }: MeetingDetailViewProps) {
  const { data: meeting, isLoading } = useMeetingQuery(meetingId);
  const [copyMenuOpen, setCopyMenuOpen] = useState(false);

  const actionItemsContent = useMemo(() => {
    if (!meeting) {
      return "";
    }
    return formatActionItemsForCopy(meeting.summary.actionItems);
  }, [meeting]);

  const actionItemsByAssignee = useMemo(() => {
    if (!meeting) {
      return [];
    }

    const groups = new Map<string, ActionItem[]>();
    for (const item of meeting.summary.actionItems) {
      const existing = groups.get(item.assigneeName) ?? [];
      existing.push(item);
      groups.set(item.assigneeName, existing);
    }

    return Array.from(groups.entries());
  }, [meeting]);

  if (isLoading) {
    return <p className="px-5 py-6 text-sm text-slate-500 sm:px-6">Loading meeting...</p>;
  }

  if (!meeting) {
    return (
      <div className="px-5 py-6 sm:px-6">
        <h1 className="text-xl font-normal leading-7 tracking-[-0.2px] text-slate-900">
          Meeting not found
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          This meeting does not exist in local storage.
        </p>
      </div>
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

    const bulletSection = meeting.summary.bulletGist.map((point) => `- ${point}`).join("\n");
    const payload = [
      "Overview",
      meeting.summary.overview,
      "",
      "Key takeaways",
      bulletSection,
      "",
      "Action items",
      actionItemsContent,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(payload);
    } catch {
      console.warn("Unable to copy full summary.");
    } finally {
      setCopyMenuOpen(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <article className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl space-y-8 px-5 py-8 sm:px-8 lg:px-12">
          <header>
            <h1 className="text-3xl font-normal leading-9 tracking-[-0.2px] text-slate-900">
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

            <div className="mt-5 flex flex-wrap gap-2">
              {meeting.summary.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </header>

          <div className="space-y-4">
            <p className="text-base leading-7 text-slate-700">{meeting.summary.overview}</p>
            <ul className="list-disc space-y-2 pl-5 text-base leading-7 text-slate-700">
              {meeting.summary.bulletGist.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <section>
            <h2 className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Outline
            </h2>
            <div className="mt-3 space-y-4">
              {meeting.summary.outline.map((section) => (
                <div key={`${section.timestamp}-${section.title}`}>
                  <p className="text-sm font-medium text-slate-900">
                    <span className="text-slate-500">{section.timestamp}</span> · {section.title}
                  </p>
                  {section.bullets?.length ? (
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-base leading-7 text-slate-700">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-medium uppercase tracking-wide text-slate-500">Notes</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-7 text-slate-700">
              {meeting.summary.notes.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>

          <section>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Action items
              </h2>
              <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" size="sm" className="h-8 px-3 text-xs">
                  Edit
                </Button>

                <DropdownMenu open={copyMenuOpen} onOpenChange={setCopyMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label="Copy options"
                      className="h-8 px-2"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <ChevronDown className="h-3 w-3" />
                    </Button>
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
              {actionItemsByAssignee.map(([assignee, items]) => (
                <div key={assignee}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {assignee}
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-base leading-7 text-slate-700">
                    {items.map((item) => (
                      <li key={item.id}>
                        {item.text}
                        {item.timestamp ? (
                          <span className="text-slate-500"> ({item.timestamp})</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </article>

      <MeetingViewSidebar transcript={meeting.transcript} speakers={meeting.speakers} />
    </div>
  );
}
