"use client";

import MeetingHeader from "@/components/meeting/MeetingHeader";
import MeetingViewSidebar from "@/components/MeetingViewSidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMeetingQuery } from "@/lib/meetings-query";
import { resolveActionItemAssignee } from "@/lib/resolve-action-item-assignee";
import type { ActionItem } from "@/lib/meetings-types";
import { ChevronDown, Copy } from "lucide-react";
import { useMemo, useState } from "react";

type MeetingDetailViewProps = {
  meetingId: string;
};

function formatActionItemsForCopy(actionItems: ActionItem[]): string {
  const groups = new Map<string, ActionItem[]>();

  for (const item of actionItems) {
    const assignee = resolveActionItemAssignee(item);
    const existing = groups.get(assignee) ?? [];
    existing.push(item);
    groups.set(assignee, existing);
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

export default function MeetingDetailView({
  meetingId,
}: MeetingDetailViewProps) {
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
      const assignee = resolveActionItemAssignee(item);
      const existing = groups.get(assignee) ?? [];
      existing.push(item);
      groups.set(assignee, existing);
    }

    return Array.from(groups.entries());
  }, [meeting]);

  if (isLoading) {
    return (
      <p className="px-5 py-6 text-sm text-slate-500 sm:px-6">
        Loading meeting...
      </p>
    );
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

    const overviewText = meeting.summary.overview.trim();
    const bulletSection = meeting.summary.bulletGist
      .map((point) => `- ${point}`)
      .join("\n");
    const payload = [
      ...(overviewText ? ["Overview", overviewText, ""] : []),
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
        <div className="mx-auto w-full max-w-3xl space-y-8 px-5 py-8 pb-[120px] sm:px-8 lg:px-12">
          <MeetingHeader
            title={meeting.title}
            ownerName={meeting.ownerName}
            createdAt={meeting.createdAt}
            meetingLanguage={meeting.meetingLanguage}
          />

          <div className="space-y-4">
            {meeting.summary.overview.trim() ? (
              <p className="text-base leading-7 text-slate-700">
                {meeting.summary.overview}
              </p>
            ) : null}
            <ul className="list-disc space-y-2 pl-5 text-base leading-7 text-slate-700">
              {meeting.summary.bulletGist.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <section>
            <h2 className="text-lg text-slate-900">Outline</h2>
            <div className="mt-3 space-y-4">
              {meeting.summary.outline.map((section) => (
                <div key={`${section.timestamp}-${section.title}`}>
                  <p className="text-sm font-medium text-slate-900">
                    <span className="text-slate-500">{section.timestamp}</span>{" "}
                    · {section.title}
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
            <h2 className="text-lg text-slate-900">Notes</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-7 text-slate-700">
              {meeting.summary.notes.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>

          <section>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg text-slate-900">Action items</h2>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-xs"
                >
                  Edit
                </Button>

                <DropdownMenu
                  open={copyMenuOpen}
                  onOpenChange={setCopyMenuOpen}
                >
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
                  <a
                    href={`mailto:${assignee}`}
                    className="text-base font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {assignee}
                  </a>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-base leading-7 text-slate-700">
                    {items.map((item) => (
                      <li key={item.id}>
                        {item.text}
                        {item.timestamp ? (
                          <span className="text-slate-500">
                            {" "}
                            ({item.timestamp})
                          </span>
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

      <MeetingViewSidebar
        transcript={meeting.transcript}
        speakers={meeting.speakers}
      />
    </div>
  );
}
