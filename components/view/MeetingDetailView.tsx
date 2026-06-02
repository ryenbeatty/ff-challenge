"use client";

import MeetingHeader from "@/components/meeting/MeetingHeader";
import MeetingViewSidebar from "@/components/view/MeetingViewSidebar";
import LoadingText from "@/components/states/LoadingText";
import MeetingNotFoundState from "@/components/states/MeetingNotFoundState";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  formatActionItemsForCopy,
  formatMeetingSummaryForCopy,
  groupActionItemsByAssignee,
} from "@/lib/meetings/action-items";
import { copyText } from "@/lib/shared/clipboard";
import { getUserByEmail } from "@/lib/shared/user-avatars";
import { useMeetingQuery } from "@/lib/meetings/query";
import {
  SUMMARY_LIST_CLASS,
  SUMMARY_NESTED_LIST_CLASS,
  SUMMARY_TEXT_CLASS,
} from "@/lib/formatting/ui-classes";
import { ChevronDown, Copy } from "lucide-react";
import { useMemo, useState } from "react";

type MeetingDetailViewProps = {
  meetingId: string;
};

export default function MeetingDetailView({
  meetingId,
}: MeetingDetailViewProps) {
  const { data: meeting, isLoading } = useMeetingQuery(meetingId);
  const [copyMenuOpen, setCopyMenuOpen] = useState(false);

  const actionItemsByAssignee = useMemo(() => {
    if (!meeting) {
      return [];
    }

    return groupActionItemsByAssignee(meeting.summary.actionItems);
  }, [meeting]);

  const actionItemsContent = useMemo(() => {
    if (!meeting) {
      return "";
    }

    return formatActionItemsForCopy(meeting.summary.actionItems);
  }, [meeting]);

  if (isLoading) {
    return (
      <LoadingText className="px-5 py-6 sm:px-6">Loading meeting...</LoadingText>
    );
  }

  if (!meeting) {
    return (
      <div className="px-5 py-6 sm:px-6">
        <MeetingNotFoundState />
      </div>
    );
  }

  const meetingSummary = meeting.summary;

  async function copyActionItemsOnly() {
    await copyText(actionItemsContent);
    setCopyMenuOpen(false);
  }

  async function copyEntireSummary() {
    await copyText(formatMeetingSummaryForCopy(meetingSummary));
    setCopyMenuOpen(false);
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
              <p className={SUMMARY_TEXT_CLASS}>{meeting.summary.overview}</p>
            ) : null}
            <ul className={SUMMARY_LIST_CLASS}>
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
                    <ul className={SUMMARY_NESTED_LIST_CLASS}>
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
            <ul className={`mt-3 ${SUMMARY_LIST_CLASS}`}>
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
              {actionItemsByAssignee.map(([assignee, items]) => {
                const assigneeUser = getUserByEmail(assignee);
                const assigneeLabel = assigneeUser?.name ?? assignee;

                return (
                <div key={assignee}>
                  <div className="flex items-center gap-2">
                    <UserAvatar name={assigneeLabel} email={assignee} size="sm" />
                    <a
                      href={`mailto:${assignee}`}
                      className="text-base font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {assignee}
                    </a>
                  </div>
                  <ul className={SUMMARY_NESTED_LIST_CLASS}>
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
              );
              })}
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
